-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- ============================================
-- VECTOR STORE TABLES
-- ============================================

-- Glossary terms with embeddings
CREATE TABLE glossary_embeddings (
  id SERIAL PRIMARY KEY,
  term TEXT NOT NULL,
  aliases TEXT[],
  content JSONB NOT NULL,  -- Full glossary entry
  embedding VECTOR(1536),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create index for vector similarity search
CREATE INDEX ON glossary_embeddings USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

-- Event patterns with embeddings
CREATE TABLE pattern_embeddings (
  id SERIAL PRIMARY KEY,
  pattern TEXT NOT NULL,
  content JSONB NOT NULL,
  embedding VECTOR(1536),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX ON pattern_embeddings USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

-- Category playbooks (chunked) with embeddings
CREATE TABLE playbook_embeddings (
  id SERIAL PRIMARY KEY,
  category TEXT NOT NULL,
  section TEXT NOT NULL,
  content JSONB NOT NULL,
  embedding VECTOR(1536),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX ON playbook_embeddings USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

-- Brand content (chunked) with embeddings
CREATE TABLE brand_embeddings (
  id SERIAL PRIMARY KEY,
  brand TEXT NOT NULL,
  section TEXT NOT NULL,
  content JSONB NOT NULL,
  embedding VECTOR(1536),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX ON brand_embeddings USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

-- ============================================
-- STRUCTURED TABLES
-- ============================================

-- Quick term lookup (for exact matches)
CREATE TABLE terms (
  id SERIAL PRIMARY KEY,
  term TEXT UNIQUE NOT NULL,
  aliases TEXT[],
  definition TEXT,
  real_talk TEXT,
  category_notes JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Brand metadata
CREATE TABLE brands (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  ticker TEXT,
  category TEXT,
  one_liner TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Usage analytics (for tracking API calls)
CREATE TABLE api_usage (
  id SERIAL PRIMARY KEY,
  query TEXT NOT NULL,
  brand_detected TEXT,
  response_time_ms INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Function to search similar embeddings
CREATE OR REPLACE FUNCTION match_glossary_embeddings(
  query_embedding VECTOR(1536),
  match_threshold FLOAT,
  match_count INT
)
RETURNS TABLE (
  id INT,
  term TEXT,
  content JSONB,
  similarity FLOAT
)
LANGUAGE SQL STABLE
AS $$
  SELECT
    id,
    term,
    content,
    1 - (embedding <=> query_embedding) AS similarity
  FROM glossary_embeddings
  WHERE 1 - (embedding <=> query_embedding) > match_threshold
  ORDER BY embedding <=> query_embedding
  LIMIT match_count;
$$;

CREATE OR REPLACE FUNCTION match_brand_embeddings(
  query_embedding VECTOR(1536),
  brand_filter TEXT,
  match_threshold FLOAT,
  match_count INT
)
RETURNS TABLE (
  id INT,
  brand TEXT,
  section TEXT,
  content JSONB,
  similarity FLOAT
)
LANGUAGE SQL STABLE
AS $$
  SELECT
    id,
    brand,
    section,
    content,
    1 - (embedding <=> query_embedding) AS similarity
  FROM brand_embeddings
  WHERE brand = brand_filter
    AND 1 - (embedding <=> query_embedding) > match_threshold
  ORDER BY embedding <=> query_embedding
  LIMIT match_count;
$$;

CREATE OR REPLACE FUNCTION match_playbook_embeddings(
  query_embedding VECTOR(1536),
  match_threshold FLOAT,
  match_count INT
)
RETURNS TABLE (
  id INT,
  category TEXT,
  section TEXT,
  content JSONB,
  similarity FLOAT
)
LANGUAGE SQL STABLE
AS $$
  SELECT
    id,
    category,
    section,
    content,
    1 - (embedding <=> query_embedding) AS similarity
  FROM playbook_embeddings
  WHERE 1 - (embedding <=> query_embedding) > match_threshold
  ORDER BY embedding <=> query_embedding
  LIMIT match_count;
$$;

CREATE OR REPLACE FUNCTION match_pattern_embeddings(
  query_embedding VECTOR(1536),
  match_threshold FLOAT,
  match_count INT
)
RETURNS TABLE (
  id INT,
  pattern TEXT,
  content JSONB,
  similarity FLOAT
)
LANGUAGE SQL STABLE
AS $$
  SELECT
    id,
    pattern,
    content,
    1 - (embedding <=> query_embedding) AS similarity
  FROM pattern_embeddings
  WHERE 1 - (embedding <=> query_embedding) > match_threshold
  ORDER BY embedding <=> query_embedding
  LIMIT match_count;
$$;
