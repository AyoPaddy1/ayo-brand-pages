import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: 'https://api.openai.com/v1',
});

async function testOpenAI() {
  console.log('🔌 Testing OpenAI API...\n');
  console.log('API Key (first 20 chars):', process.env.OPENAI_API_KEY?.substring(0, 20) + '...');

  try {
    const response = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: 'test',
      encoding_format: 'float',
    });

    console.log('\n✅ OpenAI API is working!');
    console.log('✅ Embedding dimension:', response.data[0].embedding.length);
    console.log('✅ Model:', response.model);
    
  } catch (error: any) {
    console.error('\n❌ OpenAI API error:', error.message);
    console.error('Status:', error.status);
    console.error('Type:', error.type);
    
    if (error.status === 404) {
      console.error('\n💡 Possible issues:');
      console.error('   - API key is invalid or expired');
      console.error('   - API key doesn\'t have access to embeddings');
      console.error('   - Check your key at: https://platform.openai.com/api-keys');
    }
  }
}

testOpenAI();
