import { describe, it, expect } from 'vitest';
import { preprocessIndentToBraces, preprocessWithMap } from '../src/preprocessor';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '..', '..', '..');
const read = (p: string) => readFileSync(resolve(repoRoot, p), 'utf8');

describe('preprocessor', () => {
  it('converts indentation to braces deterministically', () => {
    const src = read('examples/todo.shep');
    const out = preprocessIndentToBraces(src);
    // Basic structure checks
    expect(out).toContain('app MyTodos {');
    expect(out).toContain('data Todo {');
    expect(out).toContain('fields : {');
    expect(out).toContain('rules : {');
    // Balanced braces
    const opens = [...out.matchAll(/{/g)].length;
    const closes = [...out.matchAll(/}/g)].length;
    expect(opens).toBe(closes);
  });

  it('rejects tabs with a clear message', () => {
    const src = 'app X\n\tdata Y:';
    expect(() => preprocessIndentToBraces(src)).toThrow(/Tabs not allowed/i);
  });

  it('provides line mapping for error remap', () => {
    const src = read('examples/todo.shep');
    const { text, map } = preprocessWithMap(src);
    expect(map.length).toBe(text.split('\n').length);
    // Closing brace lines should map to end of original file
    expect(map[map.length - 1]).toBe(src.split('\n').length);
  });
});
