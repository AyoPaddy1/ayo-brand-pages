import { NextRequest, NextResponse } from 'next/server';
import { retrieveContext, assembleContext, detectBrand } from '@/lib/rag';
import { generateExplanation } from '@/lib/llm';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    const body = await request.json();
    const { term, brand } = body;

    if (!term) {
      return NextResponse.json(
        { error: 'Missing required parameter: term' },
        { status: 400 }
      );
    }

    // Detect brand if not explicitly provided
    let detectedBrand = brand;
    if (!detectedBrand) {
      detectedBrand = await detectBrand(term);
    }

    console.log(`Processing query: "${term}"${detectedBrand ? ` (Brand: ${detectedBrand})` : ''}`);

    // Retrieve relevant context using RAG
    const retrievalResults = await retrieveContext(term, detectedBrand);

    // Assemble context for LLM
    const context = assembleContext(term, retrievalResults, detectedBrand);

    // Generate explanation using Claude
    const explanation = await generateExplanation(context);

    // Log API usage
    const responseTime = Date.now() - startTime;
    await supabase.from('api_usage').insert({
      query: term,
      brand_detected: detectedBrand,
      response_time_ms: responseTime,
    });

    return NextResponse.json({
      success: true,
      data: explanation,
      metadata: {
        brand_detected: detectedBrand,
        response_time_ms: responseTime,
        sources_used: {
          glossary: retrievalResults.glossary.length,
          patterns: retrievalResults.patterns.length,
          playbooks: retrievalResults.playbooks.length,
          brands: retrievalResults.brands.length,
        },
      },
    });

  } catch (error: any) {
    console.error('Error in explain_term API:', error);

    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Internal server error',
      },
      { status: 500 }
    );
  }
}

// GET endpoint for testing
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const term = searchParams.get('term');
  const brand = searchParams.get('brand');

  if (!term) {
    return NextResponse.json(
      { error: 'Missing required parameter: term' },
      { status: 400 }
    );
  }

  // Forward to POST handler
  return POST(
    new NextRequest(request.url, {
      method: 'POST',
      body: JSON.stringify({ term, brand }),
    })
  );
}
