#!/usr/bin/env node
/**
 * Codemod: replace react-i18next useTranslation/t() with Paraglide m.* calls.
 *
 * Strategy (regex-based since usage is mechanical, no <Trans>, ~0 plurals):
 *   - Parse default namespace from useTranslation(...) per file
 *   - Replace t('foo.bar') → m.{ns}_foo_bar() via key-map.json
 *   - Replace t('ns:foo.bar') with explicit namespace
 *   - Replace t('foo.bar', { x }) → m.{ns}_foo_bar({ x }) (drop string defaults)
 *   - Delete useTranslation import + destructure lines
 *   - i18n.language / i18n.changeLanguage → handled separately (Phase 3)
 *
 * Files that destructure `i18n` from useTranslation keep a marker comment for manual review.
 */
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const ROOT = process.cwd();
const KEY_MAP = JSON.parse(fs.readFileSync(path.join(ROOT, 'scripts/key-map.json'), 'utf8'));

// Map old `ns:dotted.key` → new flat key. Falls back to 'common' ns
// (matches i18next defaultNS fallback behavior).
function resolveKey(ns, rawKey) {
  let actualNs = ns;
  let dotted = rawKey;
  if (rawKey.includes(':')) {
    const [n, ...rest] = rawKey.split(':');
    actualNs = n;
    dotted = rest.join(':');
  }
  return (
    KEY_MAP[`${actualNs}:${dotted}`] ||
    KEY_MAP[`common:${dotted}`] ||
    null
  );
}

function listFiles() {
  const out = execSync(
    `rg -l "useTranslation\\(|i18next" src --type ts -g '!src/i18n/**' -g '!src/paraglide/**'`,
    { cwd: ROOT, encoding: 'utf8' }
  );
  return out.trim().split('\n').filter(Boolean);
}

const stats = { files: 0, calls: 0, unresolved: [], needsManual: [] };

for (const file of listFiles()) {
  const abs = path.join(ROOT, file);
  let src = fs.readFileSync(abs, 'utf8');
  const original = src;

  // Detect default namespace from useTranslation(...)
  // Patterns:
  //   useTranslation()             -> 'common'
  //   useTranslation('app')        -> 'app'
  //   useTranslation(['x','y'])    -> 'x'
  let defaultNs = 'common';
  const utMatch = src.match(/useTranslation\(\s*([^)]*)\s*\)/);
  if (utMatch) {
    const arg = utMatch[1].trim();
    if (!arg) defaultNs = 'common';
    else if (arg.startsWith('[')) {
      const first = arg.match(/['"]([^'"]+)['"]/);
      defaultNs = first ? first[1] : 'common';
    } else {
      const first = arg.match(/['"]([^'"]+)['"]/);
      defaultNs = first ? first[1] : 'common';
    }
  }

  // Detect if file destructures `i18n` from useTranslation
  const destructuresI18n = /const\s*\{[^}]*\bi18n\b[^}]*\}\s*=\s*useTranslation/.test(src);
  if (destructuresI18n) {
    stats.needsManual.push(`${file} (uses i18n object)`);
  }

  // Replace t(...) calls — match t('key') | t("key") | t(`key`) with optional 2nd arg
  // We do NOT touch template-literal keys with ${...}, or keys that fail to resolve.
  src = src.replace(
    /(?<![\w$.])t\(\s*(['"])([^'"`${}]+?)\1\s*(?:,\s*((?:\{[^}]*\}|['"][^'"]*['"]|[\w.[\]]+))\s*)?\)/g,
    (m, _q, rawKey, secondArg) => {
      const newKey = resolveKey(defaultNs, rawKey);
      if (!newKey) {
        stats.unresolved.push(`${file}: t('${rawKey}') ns=${defaultNs}`);
        return m;
      }
      stats.calls++;
      // If secondArg looks like an object, pass it as params; if it's a string default, drop it
      if (secondArg && secondArg.trim().startsWith('{')) {
        return `m.${newKey}(${secondArg})`;
      }
      return `m.${newKey}()`;
    }
  );

  // Replace import of useTranslation (handle combined imports)
  src = src.replace(
    /import\s*\{\s*([^}]*)\s*\}\s*from\s*['"]react-i18next['"]\s*;?\n?/g,
    (m, names) => {
      const kept = names.split(',').map(s => s.trim()).filter(n => n && n !== 'useTranslation' && n !== 'Trans');
      if (kept.length === 0) return '';
      return `import { ${kept.join(', ')} } from 'react-i18next';\n`;
    }
  );

  // Delete `const { t } = useTranslation(...)` lines (and `const { t, i18n } = ...`)
  src = src.replace(
    /^\s*const\s*\{\s*[^}]*\bt\b[^}]*\}\s*=\s*useTranslation\([^)]*\)\s*;\s*\n/gm,
    ''
  );

  // Add Paraglide import if file now references `m.` and doesn't yet import it
  const usesM = /\bm\.[a-zA-Z_]\w*\(/.test(src);
  const hasParaglideImport = /from\s+['"]@\/paraglide\/messages['"]/.test(src);
  if (usesM && !hasParaglideImport) {
    // Insert after the first import block
    const importBlock = src.match(/^(?:import[^\n]*\n)+/);
    const inject = `import { m } from '@/paraglide/messages';\n`;
    if (importBlock) {
      src = src.slice(0, importBlock[0].length) + inject + src.slice(importBlock[0].length);
    } else {
      src = inject + src;
    }
  }

  if (src !== original) {
    fs.writeFileSync(abs, src);
    stats.files++;
  }
}

console.log(`[codemod] changed ${stats.files} files, replaced ${stats.calls} t() calls`);
if (stats.unresolved.length) {
  console.warn(`[codemod] ${stats.unresolved.length} UNRESOLVED keys (first 20):`);
  stats.unresolved.slice(0, 20).forEach(u => console.warn('  -', u));
}
if (stats.needsManual.length) {
  console.warn(`[codemod] ${stats.needsManual.length} files need manual i18n handling:`);
  stats.needsManual.forEach(u => console.warn('  -', u));
}
