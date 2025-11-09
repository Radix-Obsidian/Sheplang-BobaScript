import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import type { GenResult } from './types.js';

export function writeOut(outDir: string, gen: GenResult) {
  for (const f of gen.files) {
    const full = join(outDir, gen.appName, f.path);
    mkdirSync(dirname(full), { recursive: true });
    writeFileSync(full, f.content, 'utf8');
  }
}
