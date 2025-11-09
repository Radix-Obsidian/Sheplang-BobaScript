import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import chalk from 'chalk';
import { parseShep } from '@sheplang/language';
import fs from 'node:fs/promises';

async function run() {
  const argv = await yargs(hideBin(process.argv))
    .scriptName('shep')
    .command(
      'parse <file>',
      'Parse a .shep file and print AppModel JSON',
      (y) => y.positional('file', { type: 'string', demandOption: true }),
      async (args) => {
        try {
          const src = await fs.readFile(String(args.file), 'utf8');
          const result = await parseShep(src, String(args.file));
          console.log(JSON.stringify(result.appModel, null, 2));
          process.exit(0);
        } catch (e: unknown) {
          const err = e as Error;
          console.error(chalk.red(err?.message ?? String(e)));
          process.exit(1);
        }
      }
    )
    .demandCommand(1)
    .help()
    .strict()
    .parse();
}

run();
