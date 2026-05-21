const { execSync } = require('child_process');

const url = process.env.DATABASE_URL || '';
const isPg = url.startsWith('postgresql://') || url.startsWith('postgres://');
const schema = isPg ? 'prisma/schema.postgresql.prisma' : 'prisma/schema.prisma';

console.log(`[build] Using schema: ${schema}`);
execSync(`npx prisma generate --schema=${schema}`, { stdio: 'inherit' });
execSync('next build', { stdio: 'inherit' });
