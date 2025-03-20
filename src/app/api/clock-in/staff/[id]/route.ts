import { NextResponse } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Get cookie store and await it
    const cookieStore = cookies();
    await cookieStore.getAll();

    // Get the session with proper cookie handling
    const session = await getSession();

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // Build the where clause for date filtering
    const whereClause: any = {
      userId: params.id
    };

    if (startDate && endDate) {
      whereClause.clockInTime = {
        gte: new Date(startDate),
        lte: new Date(endDate)
      };
    }

    // Fetch clock-in records
    const records = await prisma.clockIn.findMany({
      where: whereClause,
      orderBy: {
        clockInTime: 'desc'
      }
    });

    return NextResponse.json(records);
  } catch (error) {
    console.error('Error fetching staff clock-in records:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 