import Anthropic from '@anthropic-ai/sdk';
import { RAGContext } from './rag';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export interface ExplanationResponse {
  definition: string;
  real_talk: string;
  where_it_shows_up?: string;
  why_it_matters?: string;
  brand_context?: string;
  category_context?: string;
  related_terms?: string[];
}

/**
 * Generate explanation using Claude with RAG context
 */
export async function generateExplanation(
  context: RAGContext
): Promise<ExplanationResponse> {
  const prompt = buildPrompt(context);

  try {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 2000,
      temperature: 0.7,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const content = response.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type from Claude');
    }

    // Parse the JSON response (strip markdown code blocks if present)
    let jsonText = content.text.trim();
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/^```json\n/, '').replace(/\n```$/, '');
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/^```\n/, '').replace(/\n```$/, '');
    }
    const explanation = JSON.parse(jsonText);
    return explanation;

  } catch (error: any) {
    console.error('Error generating explanation:', error);
    throw new Error(`Failed to generate explanation: ${error.message}`);
  }
}

/**
 * Build prompt for Claude with RAG context
 */
function buildPrompt(context: RAGContext): string {
  let prompt = `You are AYO Co-Pilot, an AI assistant that explains financial terms in plain language.

Your task: Explain the term "${context.term}" in a way that's accurate but accessible.

`;

  // Add glossary context
  if (context.glossaryMatch) {
    prompt += `## Glossary Definition:\n${JSON.stringify(context.glossaryMatch.content, null, 2)}\n\n`;
  }

  // Add related terms
  if (context.relatedGlossary.length > 0) {
    prompt += `## Related Terms:\n`;
    context.relatedGlossary.forEach((term: any) => {
      prompt += `- ${term.term}: ${term.content.definition}\n`;
    });
    prompt += `\n`;
  }

  // Add category playbook context
  if (context.categoryPlaybook.length > 0) {
    prompt += `## Category Context:\n`;
    context.categoryPlaybook.forEach((playbook: any) => {
      prompt += `### ${playbook.category} - ${playbook.section}:\n${JSON.stringify(playbook.content, null, 2)}\n\n`;
    });
  }

  // Add brand-specific context
  if (context.brandName && context.brandContext.length > 0) {
    prompt += `## ${context.brandName} Context:\n`;
    context.brandContext.forEach((brand: any) => {
      prompt += `### ${brand.section}:\n${JSON.stringify(brand.content, null, 2)}\n\n`;
    });
  }

  // Add event patterns
  if (context.relevantPatterns.length > 0) {
    prompt += `## Relevant Event Patterns:\n`;
    context.relevantPatterns.forEach((pattern: any) => {
      prompt += `- ${pattern.pattern}: ${JSON.stringify(pattern.content, null, 2)}\n`;
    });
    prompt += `\n`;
  }

  // Add instructions
  prompt += `## Instructions:

1. Provide a **definition** (technical but clear)
2. Provide **real_talk** (plain English, conversational, no jargon)
3. Explain **where_it_shows_up** (where in financial statements/reports)
4. Explain **why_it_matters** (why investors care)
5. If brand context is available, provide **brand_context** (how this term specifically relates to ${context.brandName || 'the brand'})
6. If category context is available, provide **category_context** (industry-specific nuances)
7. List **related_terms** (3-5 related concepts)

## Output Format:
Return ONLY a JSON object with these fields (no markdown, no code blocks):

{
  "definition": "...",
  "real_talk": "...",
  "where_it_shows_up": "...",
  "why_it_matters": "...",
  "brand_context": "..." (only if brand mentioned),
  "category_context": "..." (only if category context available),
  "related_terms": ["term1", "term2", "term3"]
}

## Style Guidelines:
- Be conversational but accurate
- Use analogies when helpful
- Avoid jargon in "real_talk"
- Be specific to the brand/category when context is available
- If you don't have enough information, say "I don't have specific information about this"
- NEVER make up numbers or facts
- NEVER give investment advice

Generate the explanation now:`;

  return prompt;
}
