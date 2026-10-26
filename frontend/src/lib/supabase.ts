import { createClient } from "@supabase/supabase-js";
import { liveDataAvailable, liveDataMessage, runtimeConfig } from "./runtimeConfig";

// Fall back to stubs so createClient never throws at module-load time when
// the env file is missing or incomplete. Real requests will fail gracefully.
const supabaseUrl = "https://unconfigured.invalid";
const supabaseKey = runtimeConfig.supabaseKey || "unconfigured";

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  global: { fetch: (input, init) => {
    if (!liveDataAvailable || runtimeConfig.isDemo || !runtimeConfig.isConfigured) {
      return Promise.reject(new Error(liveDataMessage));
    }
    return fetch(input, init);
  } },
});
