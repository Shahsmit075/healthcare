import { getSession } from '@auth0/nextjs-auth0';
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const session = await getSession();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get today's start timestamp
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get week's start timestamp
    const weekStart = new Date(today);
    weekStart.setDate(weekStart.getDate() - 6); // Get last 7 days including today

    // Get all users with their clock-in records
    const { data: users, error: usersError } = await supabase
      .from('User')
      .select(`
        id,
        name,
        auth0Id,
        ClockIn (
          id,
          clockInTime,
          clockOutTime
        )
      `);

    if (usersError) {
      console.error('Error fetching users:', usersError);
      return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
    }

    // Calculate staff records
    const staffRecords = users.map(user => {
      const clockIns = user.ClockIn || [];
      const latestClockIn = clockIns[0];
      const isActive = latestClockIn && !latestClockIn.clockOutTime;
      
      // Calculate total hours for today
      const hoursToday = clockIns.reduce((total, record) => {
        if (!record.clockOutTime || new Date(record.clockInTime) < today) return total;
        const duration = new Date(record.clockOutTime).getTime() - new Date(record.clockInTime).getTime();
        return total + duration / (1000 * 60 * 60);
      }, 0);

      // Calculate weekly hours
      const weeklyHours = clockIns.reduce((total, record) => {
        if (!record.clockOutTime) return total;
        const duration = new Date(record.clockOutTime).getTime() - new Date(record.clockInTime).getTime();
        return total + duration / (1000 * 60 * 60);
      }, 0);

      return {
        id: user.id,
        name: user.name,
        status: isActive ? 'Active' : 'Inactive',
        clockInTime: isActive ? latestClockIn.clockInTime : undefined,
        hoursToday: parseFloat(hoursToday.toFixed(2)),
        weeklyHours: parseFloat(weeklyHours.toFixed(2)),
        lastClockOut: clockIns.find(record => record.clockOutTime)?.clockOutTime,
        totalShifts: clockIns.filter(record => record.clockOutTime).length,
      };
    });

    // Calculate daily totals for the past week
    const dailyHours = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      const totalHours = users.reduce((total, user) => {
        const clockIns = user.ClockIn || [];
        const dayHours = clockIns.reduce((dayTotal, record) => {
          if (!record.clockOutTime) return dayTotal;
          const clockIn = new Date(record.clockInTime);
          const clockOut = new Date(record.clockOutTime);
          
          // Only count hours within this day
          if (clockIn < date || clockIn >= nextDate) return dayTotal;
          
          const duration = clockOut.getTime() - clockIn.getTime();
          return dayTotal + duration / (1000 * 60 * 60);
        }, 0);
        return total + dayHours;
      }, 0);

      dailyHours.push({
        date: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
        hours: parseFloat(totalHours.toFixed(2)),
      });
    }

    // Calculate summary statistics
    const activeStaffCount = staffRecords.filter(record => record.status === 'Active').length;
    const totalHoursToday = parseFloat(staffRecords.reduce((total, record) => total + record.hoursToday, 0).toFixed(2));

    return NextResponse.json({
      activeStaffCount,
      totalStaffCount: users.length,
      totalHoursToday,
      staffRecords,
      dailyHours,
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { error: 'Error fetching dashboard stats' },
      { status: 500 }
    );
  }
} 