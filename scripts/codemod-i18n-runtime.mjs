#!/usr/bin/env node
/**
 * Phase 3 codemod: replace remaining i18next runtime calls with paraglide runtime.
 *  - i18n.language          → getLocale()
 *  - i18n.changeLanguage(x) → setLocale(x as Locale)
 *  - Remove `const { i18n } = useTranslation(...)` and `const { t, i18n } = ...`
 *  - Remove `import { useTranslation } from 'react-i18next';`
 *  - Add `import { getLocale, setLocale } from '@/paraglide/runtime';` where needed
 */
import fs from 'node:fs';
import { execSync } from 'node:child_process';

// Files that still reference i18n.* or useTranslation or import from react-i18next
const files = execSync(
  `rg -l "i18n\\.language|i18n\\.changeLanguage|react-i18next|useTranslation\\(" src --type ts -g '!src/i18n/**' -g '!src/paraglide/**'`,
  { encoding: 'utf8' }
).trim().split('\n').filter(Boolean);

let changedCount = 0;
for (const f of files) {
  let src = fs.readFileSync(f, 'utf8');
  const original = src;

  // 1. Replace i18n.changeLanguage(...) FIRST (more specific)
  src = src.replace(
    /\bi18n\.changeLanguage\s*\(\s*([^)]+?)\s*\)/g,
    (_, arg) => `setLocale(${arg} as 'zh' | 'en')`
  );

  // 2. Replace i18n.language → getLocale()
  src = src.replace(/\bi18n\.language\b/g, 'getLocale()');

  // 3. Remove `const { ... } = useTranslation(...);` (any destructure shape)
  src = src.replace(
    /^\s*const\s*\{\s*[^}]*\}\s*=\s*useTranslation\([^)]*\)\s*;\s*\n/gm,
    ''
  );

  // 4. Remove useTranslation import (drop just that named import)
  src = src.replace(
    /import\s*\{\s*([^}]*)\s*\}\s*from\s*['"]react-i18next['"]\s*;?\n?/g,
    (m, names) => {
      const kept = names
        .split(',')
        .map(s => s.trim())
        .filter(n => n && n !== 'useTranslation' && n !== 'Trans');
      return kept.length ? `import { ${kept.join(', ')} } from 'react-i18next';\n` : '';
    }
  );

  // 5. Inject paraglide runtime import if needed and missing
  const needsRuntime = /\b(getLocale|setLocale)\(/.test(src);
  const hasRuntime = /from\s+['"]@\/paraglide\/runtime['"]/.test(src);
  if (needsRuntime && !hasRuntime) {
    const lines = src.split('\n');
    let insertAt = 0;
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line === '' || line.startsWith('//') || line.startsWith('/*') || line.startsWith('*')) {
        insertAt = i + 1;
        continue;
      }
      if (line.startsWith('import')) {
        insertAt = i;
        break;
      }
      insertAt = i;
      break;
    }
    lines.splice(insertAt, 0, `import { getLocale, setLocale } from '@/paraglide/runtime';`);
    src = lines.join('\n');
  }

  if (src !== original) {
    fs.writeFileSync(f, src);
    changedCount++;
  }
}
console.log(`[codemod-runtime] changed ${changedCount} files`);
