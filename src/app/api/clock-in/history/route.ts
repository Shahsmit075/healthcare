import { NextResponse } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const session = await getSession();
    if (!session?.user?.sub) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Get user
    const { data: user, error: userError } = await supabase
      .from('User')
      .select('id')
      .eq('auth0Id', session.user.sub)
      .single();

    if (userError || !user) {
      console.error('Error finding user:', userError);
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get clock-in history
    const { data: clockIns, error: clockInsError } = await supabase
      .from('ClockIn')
      .select(`
        id,
        clockInTime,
        clockOutTime,
        User (
          id,
          name
        )
      `)
      .eq('userId', user.id)
      .order('clockInTime', { ascending: false });

    if (clockInsError) {
      console.error('Error fetching clock-in history:', clockInsError);
      return NextResponse.json({ error: 'Failed to fetch history' }, { status: 500 });
    }

    return NextResponse.json(clockIns);
  } catch (error) {
    console.error('Error fetching clock-in history:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 