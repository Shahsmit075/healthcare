import { NextResponse } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
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

    // Check for active clock-in
    const { data: activeClockIn, error: activeClockInError } = await supabase
      .from('ClockIn')
      .select('*')
      .eq('userId', user.id)
      .is('clockOutTime', null)
      .single();

    if (activeClockInError && activeClockInError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
      console.error('Error checking active clock-in:', activeClockInError);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    if (activeClockIn) {
      // Clock out
      const now = new Date().toISOString();
      const { data: updatedClockIn, error: updateError } = await supabase
        .from('ClockIn')
        .update({ 
          clockOutTime: now,
          updatedAt: now
        })
        .eq('id', activeClockIn.id)
        .select()
        .single();

      if (updateError) {
        console.error('Error clocking out:', updateError);
        return NextResponse.json({ error: 'Failed to clock out' }, { status: 500 });
      }

      return NextResponse.json({
        message: 'Successfully clocked out',
        clockIn: updatedClockIn
      });
    } else {
      // Clock in
      const now = new Date().toISOString();
      const { data: newClockIn, error: insertError } = await supabase
        .from('ClockIn')
        .insert({
          userId: user.id,
          clockInTime: now,
          notes: null,
          updatedAt: now,
          createdAt: now
        })
        .select()
        .single();

      if (insertError) {
        console.error('Error clocking in:', insertError);
        return NextResponse.json({ error: 'Failed to clock in' }, { status: 500 });
      }

      return NextResponse.json({
        message: 'Successfully clocked in',
        clockIn: newClockIn
      });
    }
  } catch (error) {
    console.error('Clock In/Out Error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error') 
    }, { status: 500 });
  }
} 