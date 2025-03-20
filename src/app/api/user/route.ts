import { getSession } from '@auth0/nextjs-auth0';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const session = await getSession();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user exists
    let user = await prisma.user.findUnique({
      where: { auth0Id: session.user.sub }
    });

    // Create user if doesn't exist
    if (!user) {
      user = await prisma.user.create({
        data: {
          auth0Id: session.user.sub,
          email: session.user.email,
          name: session.user.name || session.user.email,
          role: 'CARE_WORKER'
        }
      });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error in user route:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 