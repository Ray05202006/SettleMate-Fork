// Uses `prisma db push` (schema sync / prototyping mode) — NOT `prisma migrate deploy`.
// This is intentional: the existing prisma/migrations/ files contain SQLite-specific SQL
// and must not be applied to PostgreSQL. db push syncs the schema directly without
// touching migration history, which is the correct approach here.
require('./load-env');
const { execSync } = require('child_process');

const url = process.env.DATABASE_URL || '';
const isPg = url.startsWith('postgresql://') || url.startsWith('postgres://');
const schema = isPg ? 'prisma/schema.postgresql.prisma' : 'prisma/schema.prisma';

console.log(`[postbuild] db push with schema: ${schema}`);
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
