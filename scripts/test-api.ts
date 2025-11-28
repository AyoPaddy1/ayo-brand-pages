import { retrieveContext, assembleContext, detectBrand } from '../lib/rag';
import { generateExplanation } from '../lib/llm';

async function testAPI() {
  console.log('🧪 Testing AYO Co-Pilot API...\n');

  const testQueries = [
    { term: 'Revenue', brand: null },
    { term: 'Gross Margin for Nike', brand: 'Nike' },
    { term: 'DTC Revenue', brand: 'Nike' },
  ];

  for (const query of testQueries) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`Testing: "${query.term}"${query.brand ? ` (Brand: ${query.brand})` : ''}`);
    console.log('='.repeat(60));

    try {
      const startTime = Date.now();

      // Step 1: Detect brand
      let brand = query.brand;
      if (!brand) {
        brand = await detectBrand(query.term);
        if (brand) {
          console.log(`✅ Detected brand: ${brand}`);
        }
      }

      // Step 2: Retrieve context
      console.log('\n📚 Retrieving context...');
      const retrievalResults = await retrieveContext(query.term, brand || undefined);
      console.log(`  - Glossary matches: ${retrievalResults.glossary.length}`);
      console.log(`  - Pattern matches: ${retrievalResults.patterns.length}`);
      console.log(`  - Playbook matches: ${retrievalResults.playbooks.length}`);
      console.log(`  - Brand matches: ${retrievalResults.brands.length}`);

      // Step 3: Assemble context
      const context = assembleContext(query.term, retrievalResults, brand || undefined);

      // Step 4: Generate explanation
      console.log('\n🤖 Generating explanation with Claude...');
      const explanation = await generateExplanation(context);

      const responseTime = Date.now() - startTime;

      console.log('\n✅ Success!');
      console.log(`⏱️  Response time: ${responseTime}ms`);
      console.log('\n📝 Explanation:');
      console.log(JSON.stringify(explanation, null, 2));

    } catch (error: any) {
      console.error('\n❌ Error:', error.message);
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('✨ API testing complete!');
}

testAPI()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('💥 Fatal error:', error);
    process.exit(1);
  });
