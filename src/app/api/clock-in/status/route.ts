import { getSession } from '@auth0/nextjs-auth0';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    // Ensure cookies are properly awaited
    const cookieStore = cookies();
    
    // Get the session with proper cookie handling
    const session = await getSession();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { auth0Id: session.user.sub }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get active clock-in record
    const activeClockIn = await prisma.clockIn.findFirst({
      where: {
        userId: user.id,
        clockOutTime: null
      }
    });

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
    console.error('Error checking clock-in status:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 