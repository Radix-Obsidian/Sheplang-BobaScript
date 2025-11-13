// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"

console.log("ShepKit Vercel Deployment Function")

Deno.serve(async (req) => {
  try {
    // Get Vercel token from environment
    const vercelToken = Deno.env.get('VERCEL_TOKEN');
    if (!vercelToken) {
      return new Response(
        JSON.stringify({ error: 'Vercel token not configured' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Parse request
    const { projectName, files } = await req.json();
    
    if (!projectName || !files || !Array.isArray(files)) {
      return new Response(
        JSON.stringify({ error: 'Project name and files array are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Prepare deployment payload
    const deploymentFiles = {
      'package.json': {
        content: JSON.stringify({
          "name": projectName,
          "version": "1.0.0",
          "private": true,
          "scripts": {
            "dev": "next dev",
            "build": "next build",
            "start": "next start"
          },
          "dependencies": {
            "next": "^14.0.0",
            "react": "^18.2.0",
            "react-dom": "^18.2.0"
          }
        })
      },
      'next.config.js': {
        content: `/** @type {import('next').NextConfig} */\nconst nextConfig = {}\n\nmodule.exports = nextConfig`
      },
      'index.js': {
        content: `import { useEffect, useState } from 'react';\n\nexport default function Home() {\n  const [output, setOutput] = useState('Loading...');\n\n  useEffect(() => {\n    // Load and render the BobaScript output\n    const bobaCode = ${JSON.stringify(files.map(f => f.content).join('\n\n'))};\n    setOutput(bobaCode);\n  }, []);\n\n  return (\n    <div style={{ padding: '20px', fontFamily: 'system-ui, sans-serif' }}>\n      <h1>${projectName}</h1>\n      <div>\n        <pre>{output}</pre>\n      </div>\n    </div>\n  );\n}`
      }
    };

    // Add any additional files from the request
    files.forEach((file, index) => {
      deploymentFiles[`file${index}.js`] = {
        content: file.content
      };
    });

    // Call Vercel API to create deployment
    const vercelResponse = await fetch('https://api.vercel.com/v13/deployments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${vercelToken}`
      },
      body: JSON.stringify({
        name: projectName,
        files: deploymentFiles,
        projectSettings: {
          framework: 'nextjs'
        }
      })
    });

    const deploymentResult = await vercelResponse.json();

    if (!vercelResponse.ok) {
      console.error('Vercel API error:', deploymentResult);
      return new Response(
        JSON.stringify({ error: 'Deployment failed', details: deploymentResult }),
        { status: vercelResponse.status, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({
        url: deploymentResult.url,
        deploymentId: deploymentResult.id,
        readyState: deploymentResult.readyState,
        createdAt: deploymentResult.createdAt
      }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Deployment error:', error);
    
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to deploy' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
})

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/deploy-to-vercel' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
