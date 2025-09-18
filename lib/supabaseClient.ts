// Manually defined types for `import.meta.env` to ensure TypeScript can correctly
// type-check the environment variables without relying on external `vite/client` types.
interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
}

// Augment the global interface to make `import.meta.env` available.
declare global {
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Supabase credentials not found. Make sure to create a .env.local file with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
    throw new Error('Supabase URL and Anon Key must be provided in .env.local');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
