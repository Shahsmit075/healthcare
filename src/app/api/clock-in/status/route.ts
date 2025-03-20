import { getSession } from '@auth0/nextjs-auth0';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    console.log('Status API: Starting request');
    
    // Ensure cookies are properly awaited
    const cookieStore = cookies();
    console.log('Status API: Got cookie store');
    
    // Get the session with proper cookie handling
    const session = await getSession();
    console.log('Status API: Session:', session?.user?.sub);
    
    if (!session?.user) {
      console.log('Status API: No session found');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user from database
    console.log('Status API: Looking for user with auth0Id:', session.user.sub);
    const user = await prisma.user.findUnique({
      where: { auth0Id: session.user.sub }
    });
    console.log('Status API: Found user:', user?.id);

    if (!user) {
      console.log('Status API: User not found in database');
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get active clock-in record
    console.log('Status API: Looking for active clock-in for user:', user.id);
    const activeClockIn = await prisma.clockIn.findFirst({
      where: {
        userId: user.id,
        clockOutTime: null
      }
    });
    console.log('Status API: Active clock-in found:', activeClockIn?.id);

    return NextResponse.json({
      isClockedIn: !!activeClockIn,
      activeClockIn: activeClockIn ? {
        id: activeClockIn.id,
        clockInTime: activeClockIn.clockInTime,
        clockInLat: activeClockIn.clockInLat,
        clockInLong: activeClockIn.clockInLong
      } : null
    });
  } catch (error) {
    console.error('Status API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
} 