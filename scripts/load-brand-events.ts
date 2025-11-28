import { supabase } from '../lib/supabase';
import * as fs from 'fs';
import * as path from 'path';

interface BrandEventsData {
  version: string;
  brands: string[];
  [key: string]: any;
}

async function loadBrandEvents() {
  console.log('🚀 Loading brand events data...\n');

  // Read the JSON file
  const dataPath = path.join(process.cwd(), 'brand-events-data.json');
  const rawData = fs.readFileSync(dataPath, 'utf-8');
  const data: BrandEventsData = JSON.parse(rawData);

  const brands = ['nike', 'apple', 'tesla', 'netflix'];
  
  for (const brandKey of brands) {
    const brandData = data[brandKey];
    if (!brandData) {
      console.log(`⚠️  No data found for ${brandKey}`);
      continue;
    }

    console.log(`\nProcessing: ${brandData.name} (${brandData.ticker})`);

    // Insert brand metadata
    const { error: metadataError } = await supabase
      .from('brand_metadata')
      .upsert({
        ticker: brandData.ticker,
        name: brandData.name,
        category: brandData.category,
        current_hype_score: brandData.current_hype_score,
        confidence: brandData.confidence,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'ticker'
      });

    if (metadataError) {
      console.error(`  ❌ Error inserting metadata:`, metadataError);
    } else {
      console.log(`  ✅ Metadata inserted`);
    }

    // Insert social events
    if (brandData.social_events && brandData.social_events.length > 0) {
      for (const event of brandData.social_events) {
        const { error } = await supabase
          .from('social_events')
          .insert({
            brand: brandData.name,
            ticker: brandData.ticker,
            date: event.date,
            platform: event.platform,
            title: event.title,
            description: event.description,
            magnitude: event.magnitude,
            sentiment: event.sentiment,
            stock_impact: event.stock_impact,
          });

        if (error) {
          console.error(`  ❌ Error inserting social event:`, error.message);
        }
      }
      console.log(`  ✅ Loaded ${brandData.social_events.length} social events`);
    }

    // Insert key events
    if (brandData.key_events && brandData.key_events.length > 0) {
      for (const event of brandData.key_events) {
        const { error } = await supabase
          .from('key_events')
          .insert({
            brand: brandData.name,
            ticker: brandData.ticker,
            date: event.date,
            event_type: event.type,
            title: event.title,
            summary: event.summary,
            stock_impact: event.stock_impact,
          });

        if (error) {
          console.error(`  ❌ Error inserting key event:`, error.message);
        }
      }
      console.log(`  ✅ Loaded ${brandData.key_events.length} key events`);
    }

    // Insert forecast events
    if (brandData.forecast_events && brandData.forecast_events.length > 0) {
      for (const event of brandData.forecast_events) {
        const { error } = await supabase
          .from('forecast_events')
          .insert({
            brand: brandData.name,
            ticker: brandData.ticker,
            date: event.date,
            title: event.title,
            probability: event.probability,
            expected_impact: event.expected_impact,
          });

        if (error) {
          console.error(`  ❌ Error inserting forecast event:`, error.message);
        }
      }
      console.log(`  ✅ Loaded ${brandData.forecast_events.length} forecast events`);
    }
  }

  console.log('\n✨ Brand events loading complete!');
}

loadBrandEvents()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('💥 Fatal error:', error);
    process.exit(1);
  });
