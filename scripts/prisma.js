// Generic Prisma wrapper: selects the right schema based on DATABASE_URL,
// then forwards all CLI arguments to the prisma binary.
require('./load-env');
const { execSync } = require('child_process');

const url = process.env.DATABASE_URL || '';
const isPg = url.startsWith('postgresql://') || url.startsWith('postgres://');
const schema = isPg ? 'prisma/schema.postgresql.prisma' : 'prisma/schema.prisma';

const args = process.argv.slice(2).join(' ');
execSync(`npx prisma ${args} --schema=${schema}`, { stdio: 'inherit' });
