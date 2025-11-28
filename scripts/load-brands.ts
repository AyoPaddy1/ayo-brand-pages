import * as fs from 'fs';
import * as path from 'path';
import { supabase } from '../lib/supabase';
import { generateEmbedding } from '../lib/embeddings';

interface BrandPack {
  brand: string;
  ticker: string;
  category?: string;
  business_story?: any;
  culture_profile?: any;
  metrics_structure?: any;
  recent_developments?: any;
  [key: string]: any;
}

async function loadBrands() {
  console.log('🚀 Loading brand packs...\n');

  const brandsDir = path.join(process.cwd(), '../MVP/Brand Packs');
  const brandFolders = fs.readdirSync(brandsDir);

  let successCount = 0;
  let errorCount = 0;

  for (const folder of brandFolders) {
    const brandPath = path.join(brandsDir, folder);
    if (!fs.statSync(brandPath).isDirectory()) continue;

    // Find the brand pack JSON file
    const files = fs.readdirSync(brandPath);
    const brandFile = files.find(f => f.startsWith('ayo-brand-pack-') && f.endsWith('.json'));
    
    if (!brandFile) {
      console.log(`⚠️  No brand pack found in ${folder}`);
      continue;
    }

    try {
      const brandData: BrandPack = JSON.parse(
        fs.readFileSync(path.join(brandPath, brandFile), 'utf-8')
      );

      console.log(`\nProcessing: ${brandData.brand}`);

      // Insert brand metadata
      const { error: brandError } = await supabase
        .from('brands')
        .insert({
          name: brandData.brand,
          ticker: brandData.ticker,
          category: brandData.category || '',
          one_liner: brandData.business_story?.how_they_make_money?.one_liner || '',
        });

      if (brandError && !brandError.message.includes('duplicate')) {
        console.error(`  ❌ Error inserting brand: ${brandError.message}`);
      }

      // Chunk and embed different sections
      const sections = [
        { key: 'business_story', data: brandData.business_story },
        { key: 'culture_profile', data: brandData.culture_profile },
        { key: 'metrics_structure', data: brandData.metrics_structure },
        { key: 'recent_developments', data: brandData.recent_developments },
      ];

      for (const section of sections) {
        if (!section.data) continue;

        try {
          // Convert section to text for embedding
          const sectionText = JSON.stringify(section.data);
          const embedding = await generateEmbedding(sectionText);

          const { error: embeddingError } = await supabase
            .from('brand_embeddings')
            .insert({
              brand: brandData.brand,
              section: section.key,
              content: section.data,
              embedding: embedding,
            });

          if (embeddingError) {
            console.error(`  ❌ Error inserting ${section.key}: ${embeddingError.message}`);
            errorCount++;
          } else {
            console.log(`  ✅ Loaded ${section.key}`);
          }

          // Rate limiting
          await new Promise(resolve => setTimeout(resolve, 100));

        } catch (error: any) {
          console.error(`  ❌ Error processing ${section.key}:`, error.message);
          errorCount++;
        }
      }

      successCount++;

    } catch (error: any) {
      console.error(`❌ Error loading ${folder}:`, error.message);
      errorCount++;
    }
  }

  console.log(`\n📊 Summary:`);
  console.log(`   ✅ Brands loaded: ${successCount}`);
  console.log(`   ❌ Errors: ${errorCount}`);
}

// Run the script
loadBrands()
  .then(() => {
    console.log('\n✨ Brand loading complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Fatal error:', error);
    process.exit(1);
  });
