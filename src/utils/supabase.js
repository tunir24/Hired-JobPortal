import { createClient } from "@supabase/supabase-js";

export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// 🔴 HARD FAIL if env vars missing
if (!supabaseUrl || !supabaseKey) {
  throw new Error("Supabase env variables are missing");
}

const supabaseClient = (supabaseAccessToken) => {
  return createClient(supabaseUrl, supabaseKey, {
    global: {
      headers: supabaseAccessToken
        ? { Authorization: `Bearer ${supabaseAccessToken}` }
        : {},
    },
  });
};

export default supabaseClient;
