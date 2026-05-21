// Load .env then .env.local (Next.js convention) into process.env.
// Later files take precedence; existing env vars are never overwritten.
const fs = require('fs');
const path = require('path');

const root = process.cwd();
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
      if (!(key in process.env)) process.env[key] = val;
    }
  } catch {
    // file absent — skip
  }
}
