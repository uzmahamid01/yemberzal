// src/supabaseClient.js

import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase client with your project URL and anon key
const SUPABASE_URL='https://ttbmtzdxkwzqccvqbdhb.supabase.co'
const SUPABASE_KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR0Ym10emR4a3d6cWNjdnFiZGhiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM3OTg1MjQsImV4cCI6MjA0OTM3NDUyNH0.mCNdki2NG7XIYSMKENzHHcCiq4bRtOJiLSeVSOPKK0M'
export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
