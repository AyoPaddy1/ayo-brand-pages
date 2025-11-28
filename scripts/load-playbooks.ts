import * as fs from 'fs';
import * as path from 'path';
import { supabase } from '../lib/supabase';
import { generateEmbedding } from '../lib/embeddings';

async function loadPlaybooks() {
  console.log('🚀 Loading category playbooks...\n');

  const playbooksDir = path.join(process.cwd(), '../MVP/Playbooks');
  const categoryFolders = fs.readdirSync(playbooksDir);

  let successCount = 0;
  let errorCount = 0;

  for (const folder of categoryFolders) {
    const categoryPath = path.join(playbooksDir, folder);
    if (!fs.statSync(categoryPath).isDirectory()) continue;

    // Find the playbook JSON file
    const files = fs.readdirSync(categoryPath);
    const playbookFile = files.find(f => f.startsWith('ayo-playbook-') && f.endsWith('.json'));
    
    if (!playbookFile) {
      console.log(`⚠️  No playbook found in ${folder}`);
      continue;
    }

    try {
      const playbookData = JSON.parse(
        fs.readFileSync(path.join(categoryPath, playbookFile), 'utf-8')
      );

      const category = playbookData.category || folder;
      console.log(`\nProcessing: ${category}`);

      // Chunk the playbook into sections
      const sections = Object.keys(playbookData).filter(key => 
        key !== 'category' && typeof playbookData[key] === 'object'
      );

      for (const sectionKey of sections) {
        try {
          const sectionData = playbookData[sectionKey];
          const sectionText = JSON.stringify(sectionData);
          
          const embedding = await generateEmbedding(sectionText);

          const { error } = await supabase
            .from('playbook_embeddings')
            .insert({
              category: category,
              section: sectionKey,
              content: sectionData,
              embedding: embedding,
            });

          if (error) {
            console.error(`  ❌ Error inserting ${sectionKey}: ${error.message}`);
            errorCount++;
          } else {
            console.log(`  ✅ Loaded ${sectionKey}`);
          }

          // Rate limiting
          await new Promise(resolve => setTimeout(resolve, 100));

        } catch (error: any) {
          console.error(`  ❌ Error processing ${sectionKey}:`, error.message);
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
  console.log(`   ✅ Playbooks loaded: ${successCount}`);
  console.log(`   ❌ Errors: ${errorCount}`);
}

// Run the script
loadPlaybooks()
  .then(() => {
    console.log('\n✨ Playbook loading complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Fatal error:', error);
    process.exit(1);
  });
