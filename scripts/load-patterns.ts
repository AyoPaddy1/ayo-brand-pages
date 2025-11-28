import * as fs from 'fs';
import * as path from 'path';
import { supabase } from '../lib/supabase';
import { generateEmbedding } from '../lib/embeddings';

async function loadPatterns() {
  console.log('🚀 Loading event patterns...\n');

  const patternsPath = path.join(process.cwd(), '../MVP/Event Pattern/ayo-event-patterns.json');
  const patternsData = JSON.parse(fs.readFileSync(patternsPath, 'utf-8'));

  const patterns = patternsData.patterns || patternsData;

  console.log(`Found ${patterns.length} patterns to process\n`);

  let successCount = 0;
  let errorCount = 0;

  for (const pattern of patterns) {
    try {
      console.log(`Processing: ${pattern.pattern || pattern.name}`);

      // Convert pattern to text for embedding
      const patternText = JSON.stringify(pattern);
      const embedding = await generateEmbedding(patternText);

      const { error } = await supabase
        .from('pattern_embeddings')
        .insert({
          pattern: pattern.pattern || pattern.name,
          content: pattern,
          embedding: embedding,
        });

      if (error) {
        console.error(`  ❌ Error inserting: ${error.message}`);
        errorCount++;
      } else {
        console.log(`  ✅ Loaded successfully`);
        successCount++;
      }

      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));

    } catch (error: any) {
      console.error(`  ❌ Error processing pattern:`, error.message);
      errorCount++;
    }
  }

  console.log(`\n📊 Summary:`);
  console.log(`   ✅ Success: ${successCount}`);
  console.log(`   ❌ Errors: ${errorCount}`);
  console.log(`   📝 Total: ${patterns.length}`);
}

// Run the script
loadPatterns()
  .then(() => {
    console.log('\n✨ Pattern loading complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Fatal error:', error);
    process.exit(1);
  });
