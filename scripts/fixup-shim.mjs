#!/usr/bin/env node
/**
 * For every src/**.ts file that references `t(` or `i18n.` but doesn't
 * declare them (Cannot find name errors), re-inject a useTranslation
 * destructure from the @/i18n/compat shim.
 *
 * Picks the namespace from the file's existing `m.<ns>_...` calls if
 * present, otherwise defaults to 'common'.
 */
import fs from 'node:fs';
import { execSync } from 'node:child_process';

// Get tsc error files
const tscOut = execSync('bunx tsc --noEmit -p tsconfig.app.json 2>&1 || true', {
  encoding: 'utf8',
});
const filesNeedingFix = new Set();
for (const line of tscOut.split('\n')) {
  const m = line.match(/^(src\/[^(]+)\(\d+,\d+\): error TS2304: Cannot find name '(t|i18n|useTranslation)'/);
  if (m) filesNeedingFix.add(m[1]);
}

console.log(`[fixup-shim] ${filesNeedingFix.size} files need shim`);

let changed = 0;
for (const f of filesNeedingFix) {
  let src = fs.readFileSync(f, 'utf8');
  const original = src;

  // Pick default ns from first m.<ns>_ call if any
  let defaultNs = 'common';
  const mMatch = src.match(/\bm\.(\w+?)_/);
  if (mMatch && ['common','landing','app','marketing','about','faq','method369','userStories'].includes(mMatch[1])) {
    defaultNs = mMatch[1];
  }

  // Add compat import if missing
  if (!/from\s+['"]@\/i18n\/compat['"]/.test(src)) {
    const lines = src.split('\n');
    let insertAt = 0;
    for (let i = 0; i < lines.length; i++) {
      const l = lines[i].trim();
      if (l === '' || l.startsWith('//') || l.startsWith('/*') || l.startsWith('*')) { insertAt = i + 1; continue; }
      if (l.startsWith('import')) { insertAt = i; break; }
      insertAt = i; break;
    }
    lines.splice(insertAt, 0, `import { useTranslation } from '@/i18n/compat';`);
    src = lines.join('\n');
  }

  // Inject destructure inside the first function/arrow component body.
  // Heuristic: find the first opening brace of a function/component and insert after it.
  // We look for patterns like `= () => {` or `export function X() {` or `function X(...) {`
  // and inject `const { t, i18n } = useTranslation('<ns>');` as a new line.
  const destructureLine = `  const { t, i18n } = useTranslation('${defaultNs}');\n`;

  // Find a good insertion: first arrow `=> {` followed by newline, that isn't already followed by useTranslation
  const arrowRegex = /(=>\s*\{|\)\s*\{)\s*\n/;
  const match = src.match(arrowRegex);
  if (match) {
    const idx = src.indexOf(match[0]) + match[0].length;
    // Check it's a component-like body (the next non-empty lines do reference t/i18n)
    src = src.slice(0, idx) + destructureLine + src.slice(idx);
  }

  if (src !== original) {
    fs.writeFileSync(f, src);
    changed++;
  }
}

console.log(`[fixup-shim] injected shim in ${changed} files`);
