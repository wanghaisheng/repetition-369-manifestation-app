#!/usr/bin/env node
/**
 * Convert src/i18n/resources/{zh,en}/*.json (i18next nested format)
 * → messages/{zh,en}.json (Paraglide v2 flat format)
 * Also emit scripts/key-map.json mapping `${ns}:${dotted.key}` → `${ns}_${flat_key}`
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const SRC = path.join(ROOT, 'src/i18n/resources');
const OUT = path.join(ROOT, 'messages');
const MAP_OUT = path.join(ROOT, 'scripts/key-map.json');

const LOCALES = ['zh', 'en'];
const NAMESPACES = ['common', 'landing', 'app', 'marketing', 'about', 'faq', 'method369', 'userStories'];

// Convert "wishes.addWish" → "wishes_addWish" (dots → underscores, dashes → underscores)
const sanitize = (s) => s.replace(/[.\-]/g, '_').replace(/[^a-zA-Z0-9_]/g, '_');
const makeKey = (ns, dotted) => `${ns}_${sanitize(dotted)}`;

// Convert i18next {{var}} → paraglide {var}
const convertInterpolation = (val) =>
  typeof val === 'string' ? val.replace(/\{\{\s*(\w+)\s*\}\}/g, '{$1}') : val;

function flatten(obj, prefix = '', out = {}) {
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === 'object' && !Array.isArray(v)) {
      flatten(v, key, out);
    } else if (Array.isArray(v)) {
      // serialize arrays as JSON-encoded strings; usage in app should be re-considered case-by-case
      out[key] = JSON.stringify(v);
    } else {
      out[key] = v;
    }
  }
  return out;
}

fs.mkdirSync(OUT, { recursive: true });

// First pass: build keyMap from zh (source of truth) and detect collisions
const keyMap = {}; // "ns:dotted" → flat
const collisionGuard = new Set();
const messagesByLocale = {};

for (const locale of LOCALES) {
  const messages = {
    $schema: 'https://inlang.com/schema/inlang-message-format',
  };
  for (const ns of NAMESPACES) {
    const file = path.join(SRC, locale, `${ns}.json`);
    if (!fs.existsSync(file)) {
      console.warn(`[warn] missing ${file}`);
      continue;
    }
    const raw = JSON.parse(fs.readFileSync(file, 'utf8'));
    const flat = flatten(raw);
    for (const [dotted, val] of Object.entries(flat)) {
      const newKey = makeKey(ns, dotted);
      if (messages[newKey] !== undefined) {
        console.error(`[collision] ${locale} ${ns}:${dotted} → ${newKey} already exists`);
        collisionGuard.add(newKey);
      }
      messages[newKey] = convertInterpolation(val);
      if (locale === 'zh') {
        keyMap[`${ns}:${dotted}`] = newKey;
      }
    }
  }
  messagesByLocale[locale] = messages;
}

for (const locale of LOCALES) {
  const out = path.join(OUT, `${locale}.json`);
  fs.writeFileSync(out, JSON.stringify(messagesByLocale[locale], null, 2) + '\n');
  console.log(`[ok] wrote ${out} (${Object.keys(messagesByLocale[locale]).length - 1} messages)`);
}

fs.writeFileSync(MAP_OUT, JSON.stringify(keyMap, null, 2) + '\n');
console.log(`[ok] wrote ${MAP_OUT} (${Object.keys(keyMap).length} entries)`);
if (collisionGuard.size) {
  console.error(`[fatal] ${collisionGuard.size} collisions detected`);
  process.exit(1);
}

// Parity check
const zhKeys = new Set(Object.keys(messagesByLocale.zh).filter(k => k !== '$schema'));
const enKeys = new Set(Object.keys(messagesByLocale.en).filter(k => k !== '$schema'));
const missingInEn = [...zhKeys].filter(k => !enKeys.has(k));
const missingInZh = [...enKeys].filter(k => !zhKeys.has(k));
if (missingInEn.length) console.warn(`[parity] ${missingInEn.length} keys missing in en (first 5):`, missingInEn.slice(0, 5));
if (missingInZh.length) console.warn(`[parity] ${missingInZh.length} keys missing in zh (first 5):`, missingInZh.slice(0, 5));

// Ensure en has every zh key (fill with zh value as fallback so paraglide compile works)
for (const k of missingInEn) messagesByLocale.en[k] = messagesByLocale.zh[k];
for (const k of missingInZh) messagesByLocale.zh[k] = messagesByLocale.en[k];
fs.writeFileSync(path.join(OUT, 'zh.json'), JSON.stringify(messagesByLocale.zh, null, 2) + '\n');
fs.writeFileSync(path.join(OUT, 'en.json'), JSON.stringify(messagesByLocale.en, null, 2) + '\n');
