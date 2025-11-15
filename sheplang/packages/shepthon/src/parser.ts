/**
 * ShepThon Parser (Phase 0 - Stub)
 * 
 * This is a minimal stub parser for Phase 0.
 * It only returns a placeholder AST to prove the pipeline works.
 * 
 * Real parsing logic will be implemented in Phase 1.
 */

import type { ParseResult, ShepThonApp } from './types.js';

/**
 * Parse ShepThon source code into an AST
 * 
 * Phase 0: Returns a stub AST for testing
 * Phase 1+: Will implement real parsing logic
 * 
 * @param source - ShepThon source code string
 * @returns Parse result with AST and diagnostics
 */
export function parseShepThon(source: string): ParseResult {
  // Phase 0: Minimal stub implementation
  // Just check for "app" keyword and extract name
  
  const appMatch = source.match(/app\s+(\w+)\s*\{/);
  
  if (!appMatch) {
    return {
      app: null,
      diagnostics: [{
        severity: 'error',
        message: 'Expected "app <Name> { ... }" block',
        line: 1,
        column: 1
      }]
    };
  }

  const appName = appMatch[1];

  const stubApp: ShepThonApp = {
    name: appName,
    models: [],
    endpoints: [],
    jobs: []
  };

  return {
    app: stubApp,
    diagnostics: []
  };
}
