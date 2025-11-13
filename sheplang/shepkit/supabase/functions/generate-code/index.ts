// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"

// OpenAI client for Deno
import { createClient } from "jsr:@supabase/supabase-js@2";

console.log("ShepKit AI Code Generation Function")

Deno.serve(async (req) => {
  try {
    // Get API key from environment
    const apiKey = Deno.env.get('OPENAI_API_KEY');
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'OpenAI API key not configured' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Parse request
    const { prompt, context } = await req.json();
    
    if (!prompt) {
      return new Response(
        JSON.stringify({ error: 'Prompt is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Call OpenAI API directly
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `You are an expert ShepLang code generator. Generate clean, idiomatic ShepLang code.

ShepLang syntax:
- component Name { body }
- state varName = initialValue
- props { key: value }
- action ActionName(params) { body }
- route "path" -> ComponentName

Generate only valid ShepLang code without explanations unless asked.`
          },
          {
            role: 'user',
            content: `Generate ShepLang code for: ${prompt}\n${context ? `\nExisting code context:\n\`\`\`sheplang\n${context}\n\`\`\`` : ''}\n\nReturn only the ShepLang code.`
          }
        ],
        temperature: 0.8,
        max_tokens: 1500
      })
    });

    const result = await response.json();
    const generatedCode = result.choices?.[0]?.message?.content || 'No code generated.';

    return new Response(
      JSON.stringify({ code: generatedCode }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error generating code:', error);
    
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to generate code' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
})

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/generate-code' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
