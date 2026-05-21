// Schema-aware Prisma wrapper: forwards all CLI args to prisma with the
// correct --schema flag based on DATABASE_URL.
require('./load-env');
const { spawnSync } = require('child_process');

const url = process.env.DATABASE_URL || '';
const isPg = url.startsWith('postgresql://') || url.startsWith('postgres://');
const schema = isPg ? 'prisma/schema.postgresql.prisma' : 'prisma/schema.prisma';

// Strip any caller-supplied --schema to avoid duplicates, then append ours.
const userArgs = process.argv.slice(2).filter(a => !a.startsWith('--schema'));

const result = spawnSync(
  'npx',
  ['prisma', ...userArgs, `--schema=${schema}`],
  {
    stdio: 'inherit',
    // Use shell on Windows so npx resolves correctly; unnecessary on Unix.
    shell: process.platform === 'win32',
  }
);
process.exit(result.status ?? 1);
