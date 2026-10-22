import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Retrieve public client environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Verify if valid-looking credentials are provided
export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseUrl.startsWith('https://') &&
  !supabaseUrl.includes('your-project-id') &&
  supabaseAnonKey &&
  supabaseAnonKey.length > 20 &&
  !supabaseAnonKey.includes('...')
);

export interface SupabaseConfigStatus {
  isConfigured: boolean;
  hasUrl: boolean;
  hasAnonKey: boolean;
  urlPreview: string;
  errorMessage?: string;
}

export function getSupabaseConfigStatus(): SupabaseConfigStatus {
  return {
    isConfigured: isSupabaseConfigured,
    hasUrl: Boolean(supabaseUrl && supabaseUrl.startsWith('https://') && !supabaseUrl.includes('your-project-id')),
    hasAnonKey: Boolean(supabaseAnonKey && supabaseAnonKey.length > 20 && !supabaseAnonKey.includes('...')),
    urlPreview: supabaseUrl ? supabaseUrl.replace(/^(https:\/\/[^.]+).*/, '$1.supabase.co') : 'Not specified',
  };
}

/**
 * Singleton Supabase Client instance for the browser client.
 * Uses real credentials if provided; otherwise falls back to a dummy endpoint
 * so the React app stays resilient during initial setup without runtime exceptions.
 */
export const supabase: SupabaseClient = createClient(
  isSupabaseConfigured ? supabaseUrl : 'https://placeholder.supabase.co',
  isSupabaseConfigured ? supabaseAnonKey : 'placeholder-anon-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
);
