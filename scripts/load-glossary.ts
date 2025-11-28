import * as fs from 'fs';
import * as path from 'path';
import { supabase } from '../lib/supabase';
import { generateEmbedding, prepareTextForEmbedding } from '../lib/embeddings';

interface GlossaryEntry {
  term: string;
  aliases?: string[];
  definition: string;
  real_talk: string;
  where_it_shows_up?: string;
  why_it_matters?: string;
  category_notes?: Record<string, string>;
  related_terms?: string[];
}

async function loadGlossary() {
  console.log('🚀 Loading glossary terms...\n');

  // Read the master glossary file
  const glossaryPath = path.join(process.cwd(), '../MVP/Gloassry/ayo-glossary-master.json');
  const glossaryData = JSON.parse(fs.readFileSync(glossaryPath, 'utf-8'));

  const terms: GlossaryEntry[] = glossaryData.terms || glossaryData;

  console.log(`Found ${terms.length} terms to process\n`);

  let successCount = 0;
  let errorCount = 0;

  for (const term of terms) {
    try {
      console.log(`Processing: ${term.term}`);

      // Prepare text for embedding
      const embeddingText = prepareTextForEmbedding(term, [
        'term',
        'definition',
        'real_talk',
        'where_it_shows_up',
        'why_it_matters',
      ]);

      // Generate embedding
      const embedding = await generateEmbedding(embeddingText);

      // Insert into glossary_embeddings table
      const { error: embeddingError } = await supabase
        .from('glossary_embeddings')
        .insert({
          term: term.term,
          aliases: term.aliases || [],
          content: term,
          embedding: embedding,
        });

      if (embeddingError) {
        console.error(`  ❌ Error inserting embedding: ${embeddingError.message}`);
        errorCount++;
        continue;
      }

      // Insert into terms table for quick lookup
      const { error: termError } = await supabase
        .from('terms')
        .insert({
          term: term.term,
          aliases: term.aliases || [],
          definition: term.definition,
          real_talk: term.real_talk,
          category_notes: term.category_notes || {},
        });

      if (termError && !termError.message.includes('duplicate')) {
        console.error(`  ⚠️  Error inserting term: ${termError.message}`);
      }

      console.log(`  ✅ Loaded successfully`);
      successCount++;

      // Rate limiting - wait 100ms between requests
      await new Promise(resolve => setTimeout(resolve, 100));

    } catch (error: any) {
      console.error(`  ❌ Error processing ${term.term}:`, error.message);
      errorCount++;
    }
  }

  console.log(`\n📊 Summary:`);
  console.log(`   ✅ Success: ${successCount}`);
  console.log(`   ❌ Errors: ${errorCount}`);
  console.log(`   📝 Total: ${terms.length}`);
}

// Run the script
loadGlossary()
  .then(() => {
    console.log('\n✨ Glossary loading complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Fatal error:', error);
    process.exit(1);
  });
