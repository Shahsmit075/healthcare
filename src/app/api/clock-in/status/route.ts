import { NextResponse } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const session = await getSession();
    console.log('Session:', session?.user?.sub); // Debug log

    if (!session?.user?.sub) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Get user from Supabase
    const { data: user, error: userError } = await supabase
      .from('User')
      .select('id')
      .eq('auth0Id', session.user.sub)
      .single();

    if (userError || !user) {
      console.error('Error finding user:', userError);
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get active clock-in
    const { data: activeClockIn, error: clockInError } = await supabase
      .from('ClockIn')
      .select('*')
      .eq('userId', user.id)
      .is('clockOutTime', null)
      .single();

    if (clockInError && clockInError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
      console.error('Error checking clock-in status:', clockInError);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    return NextResponse.json({
      isClockedIn: !!activeClockIn,
      clockInTime: activeClockIn?.clockInTime || null,
      clockInId: activeClockIn?.id || null
    });
  } catch (error) {
    console.error('Status API Error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error') 
    }, { status: 500 });
  }
} 