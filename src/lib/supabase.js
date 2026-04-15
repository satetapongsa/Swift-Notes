import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://eekyxgarfxaeivvntkgx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVla3l4Z2FyZnhhZWl2dm50a2d4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYxODQ5MzUsImV4cCI6MjA5MTc2MDkzNX0.MwMyPrrftEmBM_cI-LoIdLVO1MhuygOj5SsZDww20_0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
