import { createClient } from '@supabase/supabase-js';
import { getSession } from '@auth0/nextjs-auth0';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Create base client
export const supabase = createClient(supabaseUrl, supabaseKey);

// Get authenticated client
export async function getAuthenticatedClient() {
  const session = await getSession();
  if (session?.user?.sub) {
    return createClient(supabaseUrl, supabaseKey, {
      global: {
        headers: {
          'x-user-id': session.user.sub,
          'x-user-email': session.user.email || '',
          'x-user-role': 'authenticated'
        }
      }
    });
  }
  return supabase;
} 