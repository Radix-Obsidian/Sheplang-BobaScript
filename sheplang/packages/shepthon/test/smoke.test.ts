/**
 * ShepThon Smoke Tests (Phase 0)
 * 
 * Verifies the package exports and basic parser functionality.
 * These tests prove the pipeline works without implementing full parsing.
 */

import { describe, it, expect } from 'vitest';
import { parseShepThon } from '../src/parser.js';
import type { ShepThonApp } from '../src/types.js';

describe('ShepThon Parser - Phase 0 Smoke Tests', () => {
  it('should export parseShepThon function', () => {
    expect(typeof parseShepThon).toBe('function');
  });

  it('should parse minimal app block', () => {
    const source = 'app TestApp { }';
    const result = parseShepThon(source);
    
    expect(result).toBeDefined();
    expect(result.app).not.toBeNull();
    expect(result.app?.name).toBe('TestApp');
    expect(result.diagnostics).toHaveLength(0);
  });

  it('should extract app name correctly', () => {
    const source = 'app DogReminders { }';
    const result = parseShepThon(source);
    
    expect(result.app?.name).toBe('DogReminders');
  });

  it('should return empty arrays for models, endpoints, jobs in Phase 0', () => {
    const source = 'app MyApp { }';
    const result = parseShepThon(source);
    
    const app = result.app as ShepThonApp;
    expect(app.models).toEqual([]);
    expect(app.endpoints).toEqual([]);
    expect(app.jobs).toEqual([]);
  });

  it('should return error diagnostic when app block is missing', () => {
    const source = 'not valid shepthon';
    const result = parseShepThon(source);
    
    expect(result.app).toBeNull();
    expect(result.diagnostics).toHaveLength(1);
    expect(result.diagnostics[0].severity).toBe('error');
    expect(result.diagnostics[0].message).toContain('Expected "app');
  });

  it('should handle multiline app blocks', () => {
    const source = `app TodoApp {
      
    }`;
    const result = parseShepThon(source);
    
    expect(result.app?.name).toBe('TodoApp');
    expect(result.diagnostics).toHaveLength(0);
  });
});

describe('ShepThon Types - Phase 0', () => {
  it('should export all required types', async () => {
    const types = await import('../src/types.js');
    
    // Types are compile-time only, but we can verify the module exports
    expect(types).toBeDefined();
  });
});
