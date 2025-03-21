import { NextResponse } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0';
import { supabase } from '@/lib/supabase';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    console.log('Session:', session?.user?.sub); // Debug log

    if (!session?.user?.sub) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Get URL parameters for date range
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    console.log('Date range:', { startDate, endDate }); // Debug log

    // Build the query
    let query = supabase
      .from('ClockIn')
      .select('*')
      .eq('userId', params.id);

    // Add date range filters if provided
    if (startDate) {
      query = query.gte('clockInTime', startDate);
    }
    if (endDate) {
      query = query.lte('clockInTime', endDate);
    }

    // Order by clock-in time descending
    query = query.order('clockInTime', { ascending: false });

    // Execute the query
    const { data, error } = await query;

    console.log('Clock-in records:', data, 'Error:', error); // Debug log

    if (error) {
      console.error('Error fetching clock-in records:', error);
      return NextResponse.json({ error: 'Database error: ' + error.message }, { status: 500 });
    }

    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Error fetching clock-in records:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error') 
    }, { status: 500 });
  }
} 