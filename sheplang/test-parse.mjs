import { parseShep } from './packages/language/dist/src/index.js';
import { preprocess } from './packages/language/dist/src/preprocessor.js';
import fs from 'fs';

const src = fs.readFileSync('./examples/todo.shep', 'utf8');
console.log('=== Source ===');
console.log(src);

console.log('\n=== Preprocessed ===');
const pre = preprocess(src);
console.log(pre);

try {
  console.log('\n=== Calling parseShep ===');
  const result = await parseShep(src, './examples/todo.shep');
  console.log('\n=== Result ===');
  console.log('AST:', result.ast ? 'present' : 'missing');
  console.log('AppModel:', result.appModel ? 'present' : 'missing');
  console.log('Diagnostics:', result.diagnostics);
  
  if (result.appModel) {
    console.log('\n=== AppModel ===');
    console.log(JSON.stringify(result.appModel, null, 2));
  } else {
    console.log('\n=== AST ===');
    console.log(JSON.stringify(result.ast, null, 2));
  }
} catch (e) {
  console.error('\n=== Error ===');
  console.error(e.message);
  if (e.stack) console.error(e.stack);
}
