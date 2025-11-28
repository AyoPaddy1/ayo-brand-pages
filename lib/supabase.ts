import { createClient } from '@supabase/supabase-js';

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL');
}

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY');
}

// Create Supabase client with service role key for admin operations
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

// Database types
export interface GlossaryEmbedding {
  id?: number;
  term: string;
  aliases: string[];
  content: any;
  embedding: number[];
  created_at?: string;
}

export interface BrandEmbedding {
  id?: number;
  brand: string;
  section: string;
  content: any;
  embedding: number[];
  created_at?: string;
}

export interface PlaybookEmbedding {
  id?: number;
  category: string;
  section: string;
  content: any;
  embedding: number[];
  created_at?: string;
}

export interface PatternEmbedding {
  id?: number;
  pattern: string;
  content: any;
  embedding: number[];
  created_at?: string;
}

export interface Term {
  id?: number;
  term: string;
  aliases: string[];
  definition: string;
  real_talk: string;
  category_notes: any;
  created_at?: string;
}

export interface Brand {
  id?: number;
  name: string;
  ticker: string;
  category: string;
  one_liner: string;
  created_at?: string;
}
