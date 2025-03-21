import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { supabase } from '@/lib/supabase';

type PrismaResult = { now: Date }[];

export async function GET() {
  const results = {
    prisma: { status: 'pending', error: null as string | null, timestamp: null as Date | null },
    supabase: { status: 'pending', error: null as string | null, timestamp: null as string | null, count: null as any }
  };

  // Test Prisma Connection
  try {
    const prismaResult = await prisma.$queryRaw<PrismaResult>`SELECT NOW()`;
    results.prisma = {
      status: 'success',
      error: null,
      timestamp: prismaResult[0].now
    };
  } catch (error: any) {
    results.prisma = {
      status: 'error',
      error: error.message,
      timestamp: null
    };
  }

  // Test Supabase Connection
  try {
    const { data, error } = await supabase
      .from('User')
      .select('*', { count: 'exact', head: true });
    
    if (error) throw error;
    
    results.supabase = {
      status: 'success',
      error: null,
      timestamp: new Date().toISOString(),
      count: data
    };
  } catch (error: any) {
    results.supabase = {
      status: 'error',
      error: error.message,
      timestamp: null,
      count: null
    };
  }

  return NextResponse.json({
    environment: process.env.NODE_ENV,
    database_url: process.env.DATABASE_URL?.split('@')[1]?.split(':')[0], // Safe display of DB host
    timestamp: new Date().toISOString(),
    connections: results
  });
} 