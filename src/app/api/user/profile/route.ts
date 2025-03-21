import { NextResponse } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0';
import { getAuthenticatedClient } from '@/lib/supabase';

export async function GET() {
  try {
    const session = await getSession();
    if (!session?.user?.sub) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const supabase = await getAuthenticatedClient();
    
    // Query will be restricted by RLS to only return the user's own data
    const { data: user, error } = await supabase
      .from('User')
      .select('*')
      .eq('auth0Id', session.user.sub)
      .single();

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error in user profile API:', error);
    return NextResponse.json(
      { error: 'Error fetching user profile' },
      { status: 500 }
    );
  }
} 