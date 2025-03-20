import { handleProfile } from '@auth0/nextjs-auth0';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  return handleProfile()(req);
} 
