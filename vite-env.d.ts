// Fix: Manually define types for import.meta.env to resolve TypeScript errors.
// The original `/// <reference types="vite/client" />` was causing a "Cannot find type definition" error.
interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
