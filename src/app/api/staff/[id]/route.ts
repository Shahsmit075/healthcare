import { NextResponse } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getSession();
    console.log('Session:', session?.user?.sub); // Debug log

    if (!session?.user?.sub) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Get requesting user
    const { data: requestingUser, error: requestingUserError } = await supabase
      .from('User')
      .select('id')
      .eq('auth0Id', session.user.sub)
      .single();

    console.log('Requesting user:', requestingUser, 'Error:', requestingUserError); // Debug log

    if (requestingUserError) {
      console.error('Error finding requesting user:', requestingUserError);
      return NextResponse.json({ error: 'Database error: ' + requestingUserError.message }, { status: 500 });
    }

    if (!requestingUser) {
      console.error('No user found with auth0Id:', session.user.sub);
      return NextResponse.json({ error: 'User not found in database' }, { status: 404 });
    }

    // Get staff member details
    const { data: staff, error: staffError } = await supabase
      .from('User')
      .select(`
        id,
        name,
        email,
        role,
        ClockIn (
          id,
          clockInTime,
          clockOutTime,
          notes
        )
      `)
      .eq('id', params.id)
      .single();

    console.log('Staff details:', staff, 'Error:', staffError); // Debug log

    if (staffError) {
      console.error('Error finding staff member:', staffError);
      return NextResponse.json({ error: 'Database error: ' + staffError.message }, { status: 500 });
    }

    if (!staff) {
      return NextResponse.json({ error: 'Staff member not found' }, { status: 404 });
    }

    return NextResponse.json(staff);
  } catch (error) {
    console.error('Error fetching staff details:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error') 
    }, { status: 500 });
  }
} 