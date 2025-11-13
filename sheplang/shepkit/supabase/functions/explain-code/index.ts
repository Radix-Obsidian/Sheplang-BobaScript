// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"

console.log("ShepKit AI Code Explanation Function")

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
    const { code, query } = await req.json();
    
    if (!code) {
      return new Response(
        JSON.stringify({ error: 'Code is required' }),
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
            content: `You are an expert at explaining ShepLang code. ShepLang is a declarative language for building web applications.

Key concepts:
- component: Defines a UI component
- state: Declares reactive state
- props: Component properties
- action: Defines an action handler
- route: Maps URL paths to components

Explain the code in simple, beginner-friendly terms.`
          },
          {
            role: 'user',
            content: `Explain this ShepLang code:

\`\`\`sheplang
${code}
\`\`\`

${query ? `\nSpecific question: ${query}` : ''}

Provide a clear, concise explanation.`
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      })
    });

    const result = await response.json();
    const explanation = result.choices?.[0]?.message?.content || 'No explanation generated.';

    return new Response(
      JSON.stringify({ explanation }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error explaining code:', error);
    
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to explain code' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
})

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/explain-code' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
