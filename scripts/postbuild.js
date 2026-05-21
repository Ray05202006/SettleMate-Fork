require('./load-env');
const { execSync } = require('child_process');

const url = process.env.DATABASE_URL || '';
const isPg = url.startsWith('postgresql://') || url.startsWith('postgres://');
const schema = isPg ? 'prisma/schema.postgresql.prisma' : 'prisma/schema.prisma';

console.log(`[postbuild] DB push with schema: ${schema}`);
try {
  execSync(`npx prisma db push --schema=${schema} --skip-generate`, { stdio: 'inherit' });
} catch {
  if (isPg) {
    // Surface real schema-sync failures in production rather than hiding them.
    process.exit(1);
  }
  // SQLite in local dev: tolerate failures (matches original || true behaviour).
  process.exit(0);
}
