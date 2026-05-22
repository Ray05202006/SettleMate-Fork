// Uses `prisma db push` (schema sync) — NOT `prisma migrate deploy`.
// Intentional: prisma/migrations/ contains SQLite-specific SQL that must not
// be applied to PostgreSQL. db push syncs schema state without migration history.
const { execSync } = require('child_process');
const { schema, isPg } = require('./prisma-schema');

console.log(`[postbuild] db push with schema: ${schema}`);
try {
  execSync(`npx prisma db push --schema=${schema} --skip-generate`, { stdio: 'inherit' });
} catch (e) {
  const isLocalDev = !process.env.CI && process.env.NODE_ENV !== 'production';
  if (isPg || !isLocalDev) {
    console.error('[postbuild] prisma db push failed:', e.message);
    process.exit(1);
  }
  // SQLite + local dev only: warn but don't block (preserves original || true behaviour).
  console.warn('[postbuild] prisma db push failed (tolerated in local dev):', e.message);
}
