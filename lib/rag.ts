import { supabase } from './supabase';
import { generateEmbedding } from './embeddings';

export interface RetrievalResult {
  glossary: any[];
  patterns: any[];
  playbooks: any[];
  brands: any[];
}

export interface RAGContext {
  term: string;
  brandName?: string;
  glossaryMatch: any | null;
  relatedGlossary: any[];
  relevantPatterns: any[];
  categoryPlaybook: any[];
  brandContext: any[];
}

/**
 * Retrieve relevant context for a query using vector similarity search
 */
export async function retrieveContext(
  query: string,
  brandName?: string,
  options: {
    glossaryLimit?: number;
    patternLimit?: number;
    playbookLimit?: number;
    brandLimit?: number;
    threshold?: number;
  } = {}
): Promise<RetrievalResult> {
  const {
    glossaryLimit = 5,
    patternLimit = 3,
    playbookLimit = 3,
    brandLimit = 4,
    threshold = 0.7,
  } = options;

  // Generate embedding for the query
  const queryEmbedding = await generateEmbedding(query);

  // Retrieve from glossary
  const { data: glossaryData, error: glossaryError } = await supabase.rpc(
    'match_glossary_embeddings',
    {
      query_embedding: queryEmbedding,
      match_threshold: threshold,
      match_count: glossaryLimit,
    }
  );

  if (glossaryError) {
    console.error('Error retrieving glossary:', glossaryError);
  }

  // Retrieve from patterns
  const { data: patternData, error: patternError } = await supabase.rpc(
    'match_pattern_embeddings',
    {
      query_embedding: queryEmbedding,
      match_threshold: threshold,
      match_count: patternLimit,
    }
  );

  if (patternError) {
    console.error('Error retrieving patterns:', patternError);
  }

  // Retrieve from playbooks
  const { data: playbookData, error: playbookError } = await supabase.rpc(
    'match_playbook_embeddings',
    {
      query_embedding: queryEmbedding,
      match_threshold: threshold,
      match_count: playbookLimit,
    }
  );

  if (playbookError) {
    console.error('Error retrieving playbooks:', playbookError);
  }

  // Retrieve brand-specific context if brand is specified
  let brandData: any[] = [];
  if (brandName) {
    const { data, error: brandError } = await supabase.rpc(
      'match_brand_embeddings',
      {
        query_embedding: queryEmbedding,
        brand_filter: brandName,
        match_threshold: threshold - 0.1, // Slightly lower threshold for brand context
        match_count: brandLimit,
      }
    );

    if (brandError) {
      console.error('Error retrieving brand context:', brandError);
    } else {
      brandData = data || [];
    }
  }

  return {
    glossary: glossaryData || [],
    patterns: patternData || [],
    playbooks: playbookData || [],
    brands: brandData,
  };
}

/**
 * Assemble RAG context from retrieval results
 */
export function assembleContext(
  term: string,
  retrievalResults: RetrievalResult,
  brandName?: string
): RAGContext {
  // Find exact or best glossary match
  const glossaryMatch = retrievalResults.glossary.length > 0
    ? retrievalResults.glossary[0]
    : null;

  // Get related glossary terms (excluding the main match)
  const relatedGlossary = retrievalResults.glossary.slice(1);

  return {
    term,
    brandName,
    glossaryMatch,
    relatedGlossary,
    relevantPatterns: retrievalResults.patterns,
    categoryPlaybook: retrievalResults.playbooks,
    brandContext: retrievalResults.brands,
  };
}

/**
 * Detect brand mentions in query
 */
export async function detectBrand(query: string): Promise<string | null> {
  const { data: brands, error } = await supabase
    .from('brands')
    .select('name, ticker');

  if (error || !brands) {
    return null;
  }

  const queryLower = query.toLowerCase();

  for (const brand of brands) {
    if (
      queryLower.includes(brand.name.toLowerCase()) ||
      (brand.ticker && queryLower.includes(brand.ticker.toLowerCase()))
    ) {
      return brand.name;
    }
  }

  return null;
}
