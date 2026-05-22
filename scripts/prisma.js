// Schema-aware Prisma wrapper: forwards all CLI args to prisma with the
// correct --schema flag based on DATABASE_URL.
const { spawnSync } = require('child_process');
const { schema } = require('./prisma-schema');

// Strip caller-supplied --schema in both forms (--schema=... and --schema <path>)
// to avoid duplicates or stray positional args.
const rawArgs = process.argv.slice(2);
const userArgs = [];
for (let i = 0; i < rawArgs.length; i++) {
  if (rawArgs[i] === '--schema') { i++; continue; } // skip flag + path
  if (rawArgs[i].startsWith('--schema=')) continue;
  userArgs.push(rawArgs[i]);
}

const result = spawnSync(
  'npx',
  ['prisma', ...userArgs, `--schema=${schema}`],
  {
    stdio: 'inherit',
    shell: process.platform === 'win32', // npx needs shell resolution on Windows
  }
);

if (result.error) {
  console.error('[prisma] Failed to spawn npx:', result.error.message);
  process.exit(1);
}
process.exit(result.status ?? 1);
