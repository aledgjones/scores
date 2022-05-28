import { createClient } from "@supabase/supabase-js";

export const DB_NAME = "@sr";

export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);
