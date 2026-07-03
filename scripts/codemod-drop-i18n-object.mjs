#!/usr/bin/env node
/**
 * Cleanup pass: drop `i18n` from useTranslation destructures.
 *  - Replace `i18n.language` → `getLocale()`
 *  - Replace `i18n.changeLanguage(x)` → `setLocale(x)`
 *  - Remove `i18n` from `const { t, i18n } = useTranslation(...)`
 *  - If only `i18n` was used (no t), remove useTranslation entirely
 *  - Inject `import { getLocale, setLocale } from '@/paraglide/runtime'` when needed
 */
import fs from 'node:fs';
import { execSync } from 'node:child_process';

const files = execSync(`rg -l "from '@/i18n/compat'" src`, { encoding: 'utf8' })
  .trim().split('\n').filter(Boolean);

let changed = 0;
for (const f of files) {
  let src = fs.readFileSync(f, 'utf8');
  const orig = src;

  const usesLang = /\bi18n\.language\b/.test(src);
  const usesChange = /\bi18n\.changeLanguage\s*\(/.test(src);
  if (!usesLang && !usesChange) continue;

  // Replace usages
  src = src.replace(/\bi18n\.language\b/g, 'getLocale()');
  src = src.replace(/\bi18n\.changeLanguage\s*\(/g, 'setLocale(');

  // Trim destructure
  // const { t, i18n } = useTranslation(...)
  src = src.replace(/const\s*\{\s*([^}]*?)\s*\}\s*=\s*useTranslation\(([^)]*)\)/g, (m, inside, args) => {
    const parts = inside.split(',').map(s => s.trim()).filter(s => s && s !== 'i18n');
    if (parts.length === 0) return ''; // remove line entirely
    return `const { ${parts.join(', ')} } = useTranslation(${args})`;
  });

  // If useTranslation import no longer used, drop it
  if (!/\buseTranslation\s*\(/.test(src)) {
    src = src.replace(/^import\s*\{\s*useTranslation\s*\}\s*from\s*'@\/i18n\/compat';\s*\n/m, '');
  }

  // Ensure paraglide runtime import
  if (!/from '@\/paraglide\/runtime'/.test(src)) {
    // insert after first import
    src = src.replace(/^(import[^\n]*\n)/, `$1import { getLocale, setLocale } from '@/paraglide/runtime';\n`);
  } else {
    // ensure both symbols present
    src = src.replace(/import\s*\{\s*([^}]*)\s*\}\s*from\s*'@\/paraglide\/runtime';/, (m, inside) => {
      const set = new Set(inside.split(',').map(s => s.trim()).filter(Boolean));
      if (usesLang) set.add('getLocale');
      if (usesChange) set.add('setLocale');
      return `import { ${[...set].join(', ')} } from '@/paraglide/runtime';`;
    });
  }

  // Prune unused setLocale/getLocale if not actually referenced (defensive)
  src = src.replace(/import\s*\{\s*([^}]*)\s*\}\s*from\s*'@\/paraglide\/runtime';/, (m, inside) => {
    const kept = inside.split(',').map(s => s.trim()).filter(sym => sym && new RegExp(`\\b${sym}\\b`).test(src.replace(m, '')));
    if (kept.length === 0) return '';
    return `import { ${kept.join(', ')} } from '@/paraglide/runtime';`;
  });

  if (src !== orig) {
    fs.writeFileSync(f, src);
    changed++;
    console.log(`[edit] ${f}`);
  }
}
console.log(`[done] ${changed} files modified`);
