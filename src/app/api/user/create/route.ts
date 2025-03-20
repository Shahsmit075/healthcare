import { getSession } from '@auth0/nextjs-auth0';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    // Get the session
    const session = await getSession();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get request body
    const body = await req.json();
    const { auth0Id, email, name } = body;

    // Validate request body
    if (!auth0Id || !email || !name) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Verify auth0Id matches session user
    if (auth0Id !== session.user.sub) {
      return NextResponse.json({ error: 'Invalid auth0Id' }, { status: 403 });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { auth0Id }
    });

    if (existingUser) {
      return NextResponse.json(existingUser);
    }

    // Create new user
    const newUser = await prisma.user.create({
      data: {
        auth0Id,
        email,
        name,
        role: 'CARE_WORKER'
      }
    });

    return NextResponse.json(newUser);
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 