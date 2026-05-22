// Loads env files and returns the correct Prisma schema path for the current
// DATABASE_URL. Import this once; Node's require cache prevents duplicate loading.
require('./load-env');

const url = process.env.DATABASE_URL || '';
const isPg = url.startsWith('postgresql://') || url.startsWith('postgres://');

module.exports = {
  schema: isPg ? 'prisma/schema.postgresql.prisma' : 'prisma/schema.prisma',
  isPg,
};
