import { getSession } from '@auth0/nextjs-auth0';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const session = await getSession();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user exists in database
    const existingUser = await prisma.user.findUnique({
      where: { auth0Id: session.user.sub }
    });

    if (existingUser) {
      return NextResponse.json(existingUser);
    }

    // Create new user in database
    const newUser = await prisma.user.create({
      data: {
        auth0Id: session.user.sub,
        email: session.user.email,
        name: session.user.name || session.user.email,
        role: 'CARE_WORKER'
      }
    });

    return NextResponse.json(newUser);
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 