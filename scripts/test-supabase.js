require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://fjqbvnafqbrjkumztorj.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function testConnection() {
  try {
    console.log('Attempting to connect to Supabase...');
    
    // Simple query to test connection
    const { data, error } = await supabase
      .from('User')
      .select('count')
      .limit(1);

    if (error) throw error;
    
    console.log('Successfully connected to Supabase!');
    console.log('Query result:', data);
    
  } catch (error) {
    console.error('Error connecting to Supabase:', error);
  }
}

testConnection(); 