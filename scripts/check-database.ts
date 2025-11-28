import { supabase } from '../lib/supabase';

async function checkDatabase() {
  console.log('🔍 Checking database contents...\n');

  try {
    // Check glossary_embeddings
    const { count: glossaryCount, error: glossaryError } = await supabase
      .from('glossary_embeddings')
      .select('*', { count: 'exact', head: true });

    if (glossaryError) {
      console.error('❌ Error checking glossary:', glossaryError.message);
    } else {
      console.log(`✅ Glossary embeddings: ${glossaryCount} terms`);
    }

    // Check terms
    const { count: termsCount, error: termsError } = await supabase
      .from('terms')
      .select('*', { count: 'exact', head: true });

    if (termsError) {
      console.error('❌ Error checking terms:', termsError.message);
    } else {
      console.log(`✅ Terms table: ${termsCount} terms`);
    }

    // Check brands
    const { count: brandsCount, error: brandsError } = await supabase
      .from('brands')
      .select('*', { count: 'exact', head: true });

    if (brandsError) {
      console.error('❌ Error checking brands:', brandsError.message);
    } else {
      console.log(`✅ Brands table: ${brandsCount} brands`);
    }

    // Check brand_embeddings
    const { count: brandEmbeddingsCount, error: brandEmbeddingsError } = await supabase
      .from('brand_embeddings')
      .select('*', { count: 'exact', head: true });

    if (brandEmbeddingsError) {
      console.error('❌ Error checking brand embeddings:', brandEmbeddingsError.message);
    } else {
      console.log(`✅ Brand embeddings: ${brandEmbeddingsCount} chunks`);
    }

    // Check playbook_embeddings
    const { count: playbookCount, error: playbookError } = await supabase
      .from('playbook_embeddings')
      .select('*', { count: 'exact', head: true });

    if (playbookError) {
      console.error('❌ Error checking playbooks:', playbookError.message);
    } else {
      console.log(`✅ Playbook embeddings: ${playbookCount} chunks`);
    }

    // Check pattern_embeddings
    const { count: patternCount, error: patternError } = await supabase
      .from('pattern_embeddings')
      .select('*', { count: 'exact', head: true });

    if (patternError) {
      console.error('❌ Error checking patterns:', patternError.message);
    } else {
      console.log(`✅ Pattern embeddings: ${patternCount} patterns`);
    }

  } catch (error: any) {
    console.error('❌ Fatal error:', error.message);
  }
}

checkDatabase()
  .then(() => {
    console.log('\n✨ Database check complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Fatal error:', error);
    process.exit(1);
  });
