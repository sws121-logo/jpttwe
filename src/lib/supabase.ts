import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://eqggjcphcvkocuphrach.supabase.co';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVxZ2dqY3BoY3Zrb2N1cGhyYWNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg3MDgzNjIsImV4cCI6MjA3NDI4NDM2Mn0.i6Dn0RZ9iinZGc72SjhiQ-aABAKxtebz35I6R6eVa5E';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
