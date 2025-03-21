import { NextResponse } from 'next/server';
import { supabase, getAuthenticatedClient } from '@/lib/supabase';

type CheckResult = {
  status: 'pending' | 'success' | 'error';
  latency: number | null;
  error?: string;
  has_data?: boolean;
};

type HealthCheck = {
  timestamp: string;
  environment: string;
  supabase_url: string | undefined;
  deployment_url: string;
  checks: {
    basic_connection: CheckResult;
    rls_connection: CheckResult;
    table_access: CheckResult;
  };
};

export async function GET() {
  const startTime = Date.now();
  const results: HealthCheck = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'unknown',
    supabase_url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    deployment_url: process.env.VERCEL_URL || 'localhost',
    checks: {
      basic_connection: { status: 'pending', latency: null },
      rls_connection: { status: 'pending', latency: null },
      table_access: { status: 'pending', latency: null }
    }
  };

  // Test 1: Basic Connection
  try {
    const checkStart = Date.now();
    const { data, error } = await supabase.from('User').select('count').limit(0);
    results.checks.basic_connection = {
      status: error ? 'error' : 'success',
      latency: Date.now() - checkStart,
      error: error?.message
    };
  } catch (e: any) {
    results.checks.basic_connection = {
      status: 'error',
      latency: Date.now() - startTime,
      error: e.message
    };
  }

  // Test 2: RLS Connection
  try {
    const checkStart = Date.now();
    const authenticatedClient = await getAuthenticatedClient();
    const { data, error } = await authenticatedClient.from('User').select('count').limit(0);
    results.checks.rls_connection = {
      status: error ? 'error' : 'success',
      latency: Date.now() - checkStart,
      error: error?.message
    };
  } catch (e: any) {
    results.checks.rls_connection = {
      status: 'error',
      latency: Date.now() - startTime,
      error: e.message
    };
  }

  // Test 3: Table Access
  try {
    const checkStart = Date.now();
    const { data, error } = await supabase
      .from('User')
      .select('id')
      .limit(1);
    results.checks.table_access = {
      status: error ? 'error' : 'success',
      latency: Date.now() - checkStart,
      error: error?.message,
      has_data: data ? data.length > 0 : undefined
    };
  } catch (e: any) {
    results.checks.table_access = {
      status: 'error',
      latency: Date.now() - startTime,
      error: e.message
    };
  }

  // Overall health status
  const isHealthy = Object.values(results.checks).every(
    check => check.status === 'success'
  );

  return NextResponse.json(results, {
    status: isHealthy ? 200 : 503
  });
} 