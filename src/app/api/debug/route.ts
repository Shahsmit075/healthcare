import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Get all users with their clock-in records
    const users = await prisma.user.findMany({
      include: {
        clockIns: true,
      },
    });

    return NextResponse.json({ users });
  } catch (error) {
    console.error('Debug endpoint error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch debug data' },
      { status: 500 }
    );
  }
} 