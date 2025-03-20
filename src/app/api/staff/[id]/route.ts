import { NextResponse } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
      });
    }

    // Get URL parameters for date range
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('start');
    const endDate = searchParams.get('end');

    // Await the params
    const { id } = await context.params;

    // Fetch user details
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    if (!user) {
      return new NextResponse(JSON.stringify({ error: 'User not found' }), {
        status: 404,
      });
    }

    // Fetch clock-in history within date range
    const clockIns = await prisma.clockIn.findMany({
      where: {
        userId: id,
        clockInTime: {
          gte: startDate ? new Date(startDate) : undefined,
          lte: endDate ? new Date(endDate) : undefined,
        },
      },
      orderBy: {
        clockInTime: 'desc',
      },
    });

    // Calculate statistics
    let totalHours = 0;
    let completedShifts = 0;

    clockIns.forEach((record) => {
      if (record.clockOutTime) {
        const duration = (new Date(record.clockOutTime).getTime() - new Date(record.clockInTime).getTime()) / (1000 * 60 * 60);
        totalHours += duration;
        completedShifts++;
      }
    });

    const averageHoursPerDay = completedShifts > 0 ? totalHours / completedShifts : 0;

    return new NextResponse(JSON.stringify({
      ...user,
      totalHours,
      averageHoursPerDay,
      clockInHistory: clockIns,
    }));
  } catch (error) {
    console.error('Error in staff details API:', error);
    return new NextResponse(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
    });
  }
} 