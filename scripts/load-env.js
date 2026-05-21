// Load .env then .env.local (Next.js convention) into process.env.
// Shell-level env vars are never overwritten; .env.local overrides .env.
const fs = require('fs');
const path = require('path');

const root = process.cwd();
// Snapshot keys that already exist in the shell environment — protect these.
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
      // Never overwrite a shell env var, but allow later files to override earlier ones.
      if (!shellKeys.has(key)) process.env[key] = val;
    }
  } catch {
    // file absent — skip
  }
}
