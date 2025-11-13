import { transpileShepToBoba, type BobaTranspileResult } from '@adapters/sheplang-to-boba'

export interface TranspileResult {
  output: string
  canonicalAst: any
  diagnostics: any[]
  success: boolean
}

export interface TranspileError {
  message: string
  diagnostics: any[]
}

/**
 * Transpile ShepLang source code to BobaScript
 * @param source - ShepLang source code
 * @returns TranspileResult with output, AST, and diagnostics
 */
export async function transpile(source: string): Promise<TranspileResult> {
  const result = await transpileShepToBoba(source)
  
  if (!result.success || !result.output) {
    throw {
      message: result.diagnostics
        .filter(d => d.severity === 'error')
        .map(d => d.message)
        .join('\n') || 'Transpilation failed',
      diagnostics: result.diagnostics
    } as TranspileError
  }
  
  return {
    output: result.output,
    canonicalAst: result.canonicalAst || null,
    diagnostics: result.diagnostics,
    success: true
  }
}

/**
 * Safely transpile with error handling
 * @param source - ShepLang source code
 * @returns Result object with either success or error
 */
export async function safeTranspile(source: string): Promise<
  | { success: true; result: TranspileResult }
  | { success: false; error: TranspileError }
> {
  try {
    const result = await transpile(source)
    return { success: true, result }
  } catch (error: any) {
    return {
      success: false,
      error: {
        message: error?.message || String(error),
        diagnostics: error?.diagnostics || []
      }
    }
  }
}
