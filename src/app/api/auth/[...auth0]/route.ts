import { handleAuth, handleCallback } from '@auth0/nextjs-auth0';
import { prisma } from '@/lib/prisma';
import { NextRequest } from 'next/server';

// Define afterCallback function with proper typings
const afterCallback = async (req: NextRequest, session: any) => {
  if (session?.user) {
    try {
      // Check if user exists in database
      const existingUser = await prisma.user.findUnique({
        where: { auth0Id: session.user.sub }
      });

      if (!existingUser) {
        // Create new user in database
        await prisma.user.create({
          data: {
            auth0Id: session.user.sub,
            email: session.user.email,
            name: session.user.name || session.user.email,
            role: 'CARE_WORKER'
          }
        });
      }
    } catch (error) {
      console.error('Error creating user:', error);
    }
  }
  return session;
};

// Create handlers with specific typing to handle the params issue
export async function GET(req: NextRequest, context: { params: { auth0: string[] } }) {
  // This wrapper ensures params are properly awaited
  const auth = handleAuth({
    callback: handleCallback({ afterCallback })
  });
  
  return auth(req, context);
}

export async function POST(req: NextRequest, context: { params: { auth0: string[] } }) {
  const auth = handleAuth({
    callback: handleCallback({ afterCallback })
  });
  
  return auth(req, context);
}