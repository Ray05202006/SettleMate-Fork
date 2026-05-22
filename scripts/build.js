const { execSync } = require('child_process');
const { schema } = require('./prisma-schema');

console.log(`[build] Using schema: ${schema}`);
execSync(`npx prisma generate --schema=${schema}`, { stdio: 'inherit' });
execSync('next build', { stdio: 'inherit' });
