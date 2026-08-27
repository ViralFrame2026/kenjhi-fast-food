import { createClient } from '@supabase/supabase-js';
export const supabase=createClient(
 process.env.NEXT_PUBLIC_SUPABASE_URL||'https://ryliuvglhdlzawqgfgif.supabase.co',
 process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY||'sb_publishable__6ZcHSq83xz6k5GsiTFbpg_sAPX5TiQ'
);