const { execSync } = require('child_process');

const url = process.env.DATABASE_URL || '';
const isPg = url.startsWith('postgresql://') || url.startsWith('postgres://');
const schema = isPg ? 'prisma/schema.postgresql.prisma' : 'prisma/schema.prisma';

console.log(`[postbuild] DB push with schema: ${schema}`);
try {
  execSync(`npx prisma db push --schema=${schema} --skip-generate`, { stdio: 'inherit' });
} catch {
  process.exit(0); // 與原本 || true 行為一致
}
