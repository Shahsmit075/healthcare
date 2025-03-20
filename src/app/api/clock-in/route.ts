import { getSession } from '@auth0/nextjs-auth0';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    // Ensure cookies are properly awaited
    const cookieStore = cookies();
    await cookieStore.getAll(); // Properly await cookies
    
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

    const body = await request.json();
    const { action } = body;

    if (!action || !['CLOCK_IN', 'CLOCK_OUT'].includes(action)) {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    if (action === 'CLOCK_IN') {
      // Check if already clocked in
      const activeClockIn = await prisma.clockIn.findFirst({
        where: {
          userId: user.id,
          clockOutTime: null
        }
      });

      if (activeClockIn) {
        return NextResponse.json({ error: 'Already clocked in' }, { status: 400 });
      }

      // Create new clock-in record
      const clockIn = await prisma.clockIn.create({
        data: {
          userId: user.id,
          clockInTime: new Date()
        }
      });

      return NextResponse.json(clockIn);
    } else {
      // Find active clock-in record
      const activeClockIn = await prisma.clockIn.findFirst({
        where: {
          userId: user.id,
          clockOutTime: null
        }
      });

      if (!activeClockIn) {
        return NextResponse.json({ error: 'Not clocked in' }, { status: 400 });
      }

      // Update clock-out time
      const updatedClockIn = await prisma.clockIn.update({
        where: { id: activeClockIn.id },
        data: {
          clockOutTime: new Date()
        }
      });

      return NextResponse.json(updatedClockIn);
    }
  } catch (error) {
    console.error('Error processing clock-in/out:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 