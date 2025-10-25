import { createClient } from "@supabase/supabase-js";

// ✅ Must use NEXT_PUBLIC_ vars for client-side access
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables.");
}

// Named export for consistency
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
