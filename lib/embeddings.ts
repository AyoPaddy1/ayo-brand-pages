import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: 'https://api.openai.com/v1',
});

/**
 * Generate embedding for a text string using OpenAI's text-embedding-3-small model
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const response = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: text,
      encoding_format: 'float',
    });

    return response.data[0].embedding;
  } catch (error) {
    console.error('Error generating embedding:', error);
    throw error;
  }
}

/**
 * Generate embeddings for multiple texts in batch
 */
export async function generateEmbeddings(texts: string[]): Promise<number[][]> {
  try {
    const response = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: texts,
      encoding_format: 'float',
    });

    return response.data.map(item => item.embedding);
  } catch (error) {
    console.error('Error generating embeddings:', error);
    throw error;
  }
}

/**
 * Prepare text for embedding by combining relevant fields
 */
export function prepareTextForEmbedding(obj: Record<string, any>, fields: string[]): string {
  const parts: string[] = [];
  
  for (const field of fields) {
    const value = obj[field];
    if (value) {
      if (typeof value === 'string') {
        parts.push(value);
      } else if (typeof value === 'object') {
        parts.push(JSON.stringify(value));
      }
    }
  }
  
  return parts.join(' ');
}
