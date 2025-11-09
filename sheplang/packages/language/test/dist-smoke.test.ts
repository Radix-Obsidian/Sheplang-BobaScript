import { describe, it, expect } from 'vitest';
import { parseAndMap } from '../dist/src/index.js';
import { preprocessIndentToBraces } from '../dist/src/preprocessor.js';

describe('dist smoke test', () => {
  it('exports compile correctly', () => {
    expect(typeof parseAndMap).toBe('function');
    expect(typeof preprocessIndentToBraces).toBe('function');
  });
});
