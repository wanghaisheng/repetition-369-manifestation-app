#!/usr/bin/env node
/**
 * Fix-up: my earlier codemod injected `import { m } from '@/paraglide/messages';`
 * in the middle of multi-line imports. Move it to the top of the file (after any
 * leading comments / "use client" directive but before any import).
 */
import fs from 'node:fs';
import { execSync } from 'node:child_process';

const files = execSync(
  `rg -l "^import \\{ m \\} from '@/paraglide/messages';" src --type ts`,
  { encoding: 'utf8' }
).trim().split('\n').filter(Boolean);

const INJECT = `import { m } from '@/paraglide/messages';\n`;

for (const f of files) {
  let src = fs.readFileSync(f, 'utf8');
  // Remove ALL existing occurrences (in case of duplicates / wrong placement)
  src = src.replace(/^import \{ m \} from '@\/paraglide\/messages';\n/gm, '');

  // Find the first import statement line index
  const lines = src.split('\n');
  let insertAt = 0;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    // Skip leading comments, blank lines, "use client" directives
    if (line === '' || line.startsWith('//') || line.startsWith('/*') || line.startsWith('*') || line.startsWith("'use ") || line.startsWith('"use ')) {
      insertAt = i + 1;
      continue;
    }
    if (line.startsWith('import')) {
      insertAt = i;
      break;
    }
    // first non-import non-comment statement → insert here
    insertAt = i;
    break;
  }
  lines.splice(insertAt, 0, INJECT.trimEnd());
  fs.writeFileSync(f, lines.join('\n'));
}
console.log(`[fixup] re-injected paraglide import in ${files.length} files`);
