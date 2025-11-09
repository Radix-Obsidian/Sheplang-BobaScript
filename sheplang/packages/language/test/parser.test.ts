import { describe, it, expect } from 'vitest';
import { parseAndMap } from '../src/index';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
// from packages/language/test → repo root = ../../..
const repoRoot = resolve(__dirname, '..', '..', '..');
const read = (p: string) => readFileSync(resolve(repoRoot, p), 'utf8');

describe('parser → AppModel', () => {
  it('parses examples/todo.shep and maps to expected AppModel', async () => {
    const src = read('examples/todo.shep');
    const res = await parseAndMap(src, 'file://todo.shep');
    expect(res.diagnostics.length).toBe(0);
    // Get correct path to fixtures within the language package
    const expected = JSON.parse(readFileSync(resolve(__dirname, 'fixtures/appmodel.todo.json'), 'utf8'));
    expect(res.appModel).toEqual(expected);
  });
});
