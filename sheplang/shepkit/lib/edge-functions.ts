/**
 * ShepKit Edge Functions Client
 * Provides typed interfaces for calling Supabase Edge Functions
 */

// Your Supabase project URL (replace with your actual URL)
const SUPABASE_FUNCTION_URL = 'https://lfdlbvmcxzaaptgoruwt.supabase.co/functions/v1';

/**
 * Generate ShepLang code using AI
 */
export async function generateCode(prompt: string, context?: string): Promise<{ code: string } | { error: string }> {
  try {
    const response = await fetch(`${SUPABASE_FUNCTION_URL}/generate-code`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt, context }),
    });

    return await response.json();
  } catch (error) {
    console.error('Error calling generate-code function:', error);
    return { error: 'Failed to connect to code generation service' };
  }
}

/**
 * Explain ShepLang code using AI
 */
export async function explainCode(code: string, query?: string): Promise<{ explanation: string } | { error: string }> {
  try {
    const response = await fetch(`${SUPABASE_FUNCTION_URL}/explain-code`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code, query }),
    });

    return await response.json();
  } catch (error) {
    console.error('Error calling explain-code function:', error);
    return { error: 'Failed to connect to code explanation service' };
  }
}

/**
 * Debug ShepLang code using AI
 */
export async function debugCode(code: string, error?: string, transpiled?: string, query?: string): Promise<{ debugInfo: string } | { error: string }> {
  try {
    const response = await fetch(`${SUPABASE_FUNCTION_URL}/debug-code`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code, error, transpiled, query }),
    });

    return await response.json();
  } catch (error) {
    console.error('Error calling debug-code function:', error);
    return { error: 'Failed to connect to code debugging service' };
  }
}

/**
 * Deploy ShepLang app to Vercel
 */
export async function deployToVercel(projectName: string, files: Array<{ name: string, content: string }>): Promise<
  | { url: string, deploymentId: string, readyState: string, createdAt: string }
  | { error: string, details?: any }
> {
  try {
    const response = await fetch(`${SUPABASE_FUNCTION_URL}/deploy-to-vercel`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ projectName, files }),
    });

    return await response.json();
  } catch (error) {
    console.error('Error calling deploy-to-vercel function:', error);
    return { error: 'Failed to connect to deployment service' };
  }
}
