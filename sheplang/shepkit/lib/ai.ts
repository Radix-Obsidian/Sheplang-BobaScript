import OpenAI from 'openai'

if (!process.env.OPENAI_API_KEY) {
  console.warn('Warning: OPENAI_API_KEY not set')
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || ''
})

export interface AIRequest {
  code: string
  transpiled?: string
  error?: string | null
  query: string
}

export interface AIResponse {
  response: string
  usage?: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
}

export async function explainCode(request: AIRequest): Promise<AIResponse> {
  const systemPrompt = `You are an expert at explaining ShepLang code. ShepLang is a declarative language for building web applications.
  
Key concepts:
- component: Defines a UI component
- state: Declares reactive state
- props: Component properties
- action: Defines an action handler
- route: Maps URL paths to components

Explain the code in simple, beginner-friendly terms.`

  const userPrompt = `Explain this ShepLang code:

\`\`\`sheplang
${request.code}
\`\`\`

${request.query ? `\nSpecific question: ${request.query}` : ''}

Provide a clear, concise explanation.`

  const completion = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ],
    temperature: 0.7,
    max_tokens: 1000
  })

  const response = completion.choices[0]?.message?.content || 'No response generated.'

  return {
    response,
    usage: {
      promptTokens: completion.usage?.prompt_tokens || 0,
      completionTokens: completion.usage?.completion_tokens || 0,
      totalTokens: completion.usage?.total_tokens || 0
    }
  }
}

export async function generateCode(request: AIRequest): Promise<AIResponse> {
  const systemPrompt = `You are an expert ShepLang code generator. Generate clean, idiomatic ShepLang code.

ShepLang syntax:
- component Name { body }
- state varName = initialValue
- props { key: value }
- action ActionName(params) { body }
- route "path" -> ComponentName

Generate only valid ShepLang code without explanations unless asked.`

  const userPrompt = `Generate ShepLang code for: ${request.query}

${request.code ? `\nExisting code context:\n\`\`\`sheplang\n${request.code}\n\`\`\`` : ''}

Return only the ShepLang code.`

  const completion = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ],
    temperature: 0.8,
    max_tokens: 1500
  })

  const response = completion.choices[0]?.message?.content || 'No code generated.'

  return {
    response,
    usage: {
      promptTokens: completion.usage?.prompt_tokens || 0,
      completionTokens: completion.usage?.completion_tokens || 0,
      totalTokens: completion.usage?.total_tokens || 0
    }
  }
}

export async function debugCode(request: AIRequest): Promise<AIResponse> {
  const systemPrompt = `You are an expert at debugging ShepLang code. Analyze errors and suggest fixes.

Provide:
1. What the error means
2. Why it occurred
3. How to fix it
4. Corrected code if applicable`

  const userPrompt = `Debug this ShepLang code:

\`\`\`sheplang
${request.code}
\`\`\`

${request.error ? `\nError: ${request.error}` : ''}
${request.transpiled ? `\nTranspiled to:\n\`\`\`javascript\n${request.transpiled}\n\`\`\`` : ''}
${request.query ? `\nAdditional context: ${request.query}` : ''}

Help me fix this issue.`

  const completion = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ],
    temperature: 0.7,
    max_tokens: 1500
  })

  const response = completion.choices[0]?.message?.content || 'No debugging suggestions generated.'

  return {
    response,
    usage: {
      promptTokens: completion.usage?.prompt_tokens || 0,
      completionTokens: completion.usage?.completion_tokens || 0,
      totalTokens: completion.usage?.total_tokens || 0
    }
  }
}
