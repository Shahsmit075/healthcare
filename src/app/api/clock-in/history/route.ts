import { getSession } from '@auth0/nextjs-auth0';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    // Ensure cookies are properly awaited
    await cookies();
    
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

    // Get clock-in history
    const clockIns = await prisma.clockIn.findMany({
      where: {
        userId: user.id
      },
      orderBy: {
        clockInTime: 'desc'
      }
    });

    return NextResponse.json(clockIns);
  } catch (error) {
    console.error('Error fetching clock-in history:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 