import { createClient } from '@supabase/supabase-js';

// Supabase configuration - requires VITE_ prefix for Vite to expose them
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Debug logging - show partial values for verification
console.log('=== SUPABASE CONFIG DEBUG ===');
console.log('VITE_SUPABASE_URL:', supabaseUrl ? `${supabaseUrl.substring(0, 30)}...` : 'NOT SET');
console.log('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? `${supabaseAnonKey.substring(0, 20)}...` : 'NOT SET');
console.log('Key length:', supabaseAnonKey?.length || 0);

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables.');
}

// Create Supabase client
export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    })
  : null;

export const isSupabaseConfigured = () => !!supabase;

// Test raw connection to Supabase
export const testConnection = async () => {
  if (!supabaseUrl || !supabaseAnonKey) {
    return { success: false, error: 'Missing configuration' };
  }

  try {
    // Test 1: Raw fetch to Supabase health endpoint
    console.log('Testing raw fetch to Supabase...');
    const healthUrl = `${supabaseUrl}/rest/v1/`;
    const response = await fetch(healthUrl, {
      method: 'GET',
      headers: {
        'apikey': supabaseAnonKey,
        'Authorization': `Bearer ${supabaseAnonKey}`,
      },
    });
    console.log('Health check response:', response.status, response.statusText);

    // Test 2: Auth API health
    console.log('Testing auth API...');
    const authUrl = `${supabaseUrl}/auth/v1/settings`;
    const authResponse = await fetch(authUrl, {
      method: 'GET',
      headers: {
        'apikey': supabaseAnonKey,
        'Authorization': `Bearer ${supabaseAnonKey}`,
      },
    });
    const authData = await authResponse.json();
    console.log('Auth settings:', authData);

    return {
      success: true,
      restStatus: response.status,
      authStatus: authResponse.status,
      authSettings: authData
    };
  } catch (err) {
    console.error('Connection test failed:', err);
    return { success: false, error: err.message, fullError: err };
  }
};

// Helper to check connection
export const checkConnection = async () => {
  if (!supabase) return { connected: false, error: 'Not configured' };

  try {
    const { error } = await supabase.from('profiles').select('count').limit(1);
    if (error) throw error;
    return { connected: true, error: null };
  } catch (err) {
    return { connected: false, error: err.message };
  }
};
