import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Try to connect and perform a simple query
    const result = await prisma.$queryRaw`SELECT NOW()`;
    
    return NextResponse.json({
      status: 'success',
      message: 'Database connection successful',
      timestamp: result[0],
      environment: process.env.NODE_ENV,
      database_url: process.env.DATABASE_URL?.split('@')[1]?.split(':')[0] || 'hidden' // Only shows host, not credentials
    });
  } catch (error) {
    console.error('Database connection error:', error);
    return NextResponse.json({
      status: 'error',
      message: 'Database connection failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      environment: process.env.NODE_ENV
    }, { status: 500 });
  }
} 