import { NextResponse } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0';
import { supabase } from '@/lib/supabase';

export async function POST() {
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

    // Check if user has an active clock-in
    const { data: activeClockIn, error: activeClockInError } = await supabase
      .from('ClockIn')
      .select('*')
      .eq('userId', user.id)
      .is('clockOutTime', null)
      .single();

    if (activeClockInError && activeClockInError.code !== 'PGRST116') { // PGRST116 is "not found" error
      console.error('Error checking active clock-in:', activeClockInError);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    if (activeClockIn) {
      // Clock out
      const { data: updatedClockIn, error: updateError } = await supabase
        .from('ClockIn')
        .update({ clockOutTime: new Date().toISOString() })
        .eq('id', activeClockIn.id)
        .select()
        .single();

      if (updateError) {
        console.error('Error updating clock-in:', updateError);
        return NextResponse.json({ error: 'Failed to clock out' }, { status: 500 });
      }

      return NextResponse.json({
        message: 'Successfully clocked out',
        clockIn: updatedClockIn
      });
    } else {
      // Clock in
      const { data: newClockIn, error: insertError } = await supabase
        .from('ClockIn')
        .insert([{
          userId: user.id,
          clockInTime: new Date().toISOString(),
        }])
        .select()
        .single();

      if (insertError) {
        console.error('Error creating clock-in:', insertError);
        return NextResponse.json({ error: 'Failed to clock in' }, { status: 500 });
      }

      return NextResponse.json({
        message: 'Successfully clocked in',
        clockIn: newClockIn
      });
    }
  } catch (error) {
    console.error('Clock in/out error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 