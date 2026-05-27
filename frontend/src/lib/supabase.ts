import { createClient } from "@supabase/supabase-js";

// Fall back to stubs so createClient never throws at module-load time when
// the env file is missing or incomplete. Real requests will fail gracefully.
const supabaseUrl =
  (import.meta.env.VITE_SUPABASE_URL as string) ||
  "https://placeholder.supabase.co";
const supabaseKey =
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || "placeholder-key";

export const supabase = createClient(supabaseUrl, supabaseKey);
