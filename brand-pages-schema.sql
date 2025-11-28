-- AYO Brand Pages Database Schema
-- Run this in Supabase SQL Editor

-- Social events (curated)
CREATE TABLE IF NOT EXISTS social_events (
  id SERIAL PRIMARY KEY,
  brand TEXT NOT NULL,
  ticker TEXT NOT NULL,
  date DATE NOT NULL,
  platform TEXT NOT NULL, -- tiktok, twitter, instagram
  title TEXT NOT NULL,
  description TEXT,
  magnitude INT CHECK (magnitude >= 0 AND magnitude <= 100),
  sentiment TEXT CHECK (sentiment IN ('positive', 'negative', 'neutral', 'mixed')),
  stock_impact TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_social_events_brand ON social_events(brand);
CREATE INDEX IF NOT EXISTS idx_social_events_date ON social_events(date);

-- Key events (earnings, launches, management changes, etc.)
CREATE TABLE IF NOT EXISTS key_events (
  id SERIAL PRIMARY KEY,
  brand TEXT NOT NULL,
  ticker TEXT NOT NULL,
  date DATE NOT NULL,
  event_type TEXT NOT NULL, -- earnings, product_launch, management, competition, scandal
  title TEXT NOT NULL,
  summary TEXT,
  stock_impact TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_key_events_brand ON key_events(brand);
CREATE INDEX IF NOT EXISTS idx_key_events_date ON key_events(date);

-- Forecast events (predicted future events)
CREATE TABLE IF NOT EXISTS forecast_events (
  id SERIAL PRIMARY KEY,
  brand TEXT NOT NULL,
  ticker TEXT NOT NULL,
  date DATE NOT NULL,
  title TEXT NOT NULL,
  probability INT CHECK (probability >= 0 AND probability <= 100),
  expected_impact TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_forecast_events_brand ON forecast_events(brand);
CREATE INDEX IF NOT EXISTS idx_forecast_events_date ON forecast_events(date);

-- Brand metadata
CREATE TABLE IF NOT EXISTS brand_metadata (
  id SERIAL PRIMARY KEY,
  ticker TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  current_hype_score INT CHECK (current_hype_score >= 0 AND current_hype_score <= 100),
  confidence INT CHECK (confidence >= 0 AND confidence <= 100),
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_brand_metadata_ticker ON brand_metadata(ticker);
