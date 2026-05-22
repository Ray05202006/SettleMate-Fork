// Load .env then .env.local into process.env.
// Shell-level env vars are never overwritten; .env.local overrides .env.
// Only these two files are loaded — Next.js handles NODE_ENV-specific files
// (.env.development, .env.production, etc.) during next dev / next build.
const fs = require('fs');
const path = require('path');

const root = process.cwd();
// Snapshot keys already present in the shell — these are never overwritten.
const shellKeys = new Set(Object.keys(process.env));

for (const file of ['.env', '.env.local']) {
  try {
    const content = fs.readFileSync(path.join(root, file), 'utf8');
    for (const line of content.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eq = trimmed.indexOf('=');
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      let val = trimmed.slice(eq + 1).trim();
      if (/^["'].*["']$/.test(val)) val = val.slice(1, -1);
      // Protect original shell env vars; allow later files to override earlier ones.
      if (!shellKeys.has(key)) process.env[key] = val;
    }
  } catch {
    // file absent — skip
  }
}
