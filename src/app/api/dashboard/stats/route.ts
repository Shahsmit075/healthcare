import { getSession } from '@auth0/nextjs-auth0';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    // Get cookie store and await it
    const cookieStore = cookies();
    await cookieStore.getAll(); // Ensure all cookie operations are complete
    
    // Get the session with proper cookie handling
    const session = await getSession();
    
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { auth0Id: session.user.sub }
    });

    if (!user) {
      return new NextResponse('User not found', { status: 404 });
    }

    // Get today's start timestamp
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get week's start timestamp
    const weekStart = new Date(today);
    weekStart.setDate(weekStart.getDate() - 6); // Get last 7 days including today

    // Get all users with their clock-in records
    const users = await prisma.user.findMany({
      include: {
        clockIns: {
          where: {
            clockInTime: {
              gte: weekStart,
            },
          },
          orderBy: {
            clockInTime: 'desc',
          },
        },
      },
    });

    // Calculate staff records
    const staffRecords = users.map(user => {
      const latestClockIn = user.clockIns[0];
      const isActive = latestClockIn && !latestClockIn.clockOutTime;
      
      // Calculate total hours for today
      const hoursToday = user.clockIns.reduce((total, record) => {
        if (!record.clockOutTime || record.clockInTime < today) return total;
        const duration = new Date(record.clockOutTime).getTime() - new Date(record.clockInTime).getTime();
        return total + duration / (1000 * 60 * 60);
      }, 0);

      // Calculate weekly hours
      const weeklyHours = user.clockIns.reduce((total, record) => {
        if (!record.clockOutTime) return total;
        const duration = new Date(record.clockOutTime).getTime() - new Date(record.clockInTime).getTime();
        return total + duration / (1000 * 60 * 60);
      }, 0);

      return {
        id: user.id,
        name: user.name,
        status: isActive ? 'Active' : 'Inactive',
        clockInTime: isActive ? latestClockIn.clockInTime : undefined,
        hoursToday,
        weeklyHours,
        lastClockOut: user.clockIns.find(record => record.clockOutTime)?.clockOutTime,
        totalShifts: user.clockIns.filter(record => record.clockOutTime).length,
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
        const dayHours = user.clockIns.reduce((dayTotal, record) => {
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
    const totalHoursToday = staffRecords.reduce((total, record) => total + record.hoursToday, 0);

    return NextResponse.json({
      activeStaffCount,
      totalStaffCount: users.length,
      totalHoursToday,
      staffRecords,
      dailyHours,
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 