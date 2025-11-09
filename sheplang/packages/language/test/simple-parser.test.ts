import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '..', '..', '..');

describe('parser → AppModel', () => {
  it('can load fixture data for test verification', () => {
    const expected = JSON.parse(readFileSync(resolve(__dirname, 'fixtures/appmodel.todo.json'), 'utf8'));
    expect(expected.name).toEqual('MyTodos');
    expect(expected.datas[0].name).toEqual('Todo');
    expect(expected.views[0].name).toEqual('Dashboard');
    expect(expected.actions[0].name).toEqual('CreateTodo');
  });
});
