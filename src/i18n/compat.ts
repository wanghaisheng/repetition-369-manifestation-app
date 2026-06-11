/**
 * Compatibility shim mimicking react-i18next's useTranslation, backed by Paraglide.
 *
 * Migration strategy:
 *   - Simple files were converted directly to m.{ns}_{key}() calls (typed, tree-shakable).
 *   - Files with dynamic keys, multi-line patterns, or i18n.* access kept their
 *     original API via this shim — no behavior change required.
 *
 * The shim resolves keys by trying the requested namespace first, then 'common',
 * then any other namespace. That matches i18next's defaultNS fallback and lets
 * the shim absorb keys the original code already relied on falling back.
 */
import * as paraglideMessages from '@/paraglide/messages';
import { getLocale, setLocale, type Locale } from '@/paraglide/runtime';

type MessageFn = (params?: Record<string, unknown>) => string;
const M = paraglideMessages as unknown as Record<string, MessageFn>;

const NAMESPACES = [
  'common',
  'landing',
  'app',
  'marketing',
  'about',
  'faq',
  'method369',
  'userStories',
] as const;

const sanitize = (s: string) =>
  s.replace(/[.\-]/g, '_').replace(/[^a-zA-Z0-9_]/g, '_');

function resolveMessageKey(defaultNs: string, rawKey: string): string | null {
  let ns = defaultNs;
  let dotted = rawKey;
  if (rawKey.includes(':')) {
    const [n, ...rest] = rawKey.split(':');
    ns = n;
    dotted = rest.join(':');
  }
  const flat = sanitize(dotted);
  // Try requested ns first, then common, then all other namespaces.
  const candidates = [
    `${ns}_${flat}`,
    `common_${flat}`,
    ...NAMESPACES.filter((n) => n !== ns && n !== 'common').map(
      (n) => `${n}_${flat}`,
    ),
  ];
  for (const c of candidates) {
    if (typeof M[c] === 'function') return c;
  }
  return null;
}

type TFn = {
  (key: string | string[]): string;
  (key: string | string[], defaultValue: string): string;
  (key: string | string[], options: Record<string, unknown>): string;
};

const t: TFnFactory = (defaultNs: string) =>
  ((key: string | string[], opts?: unknown) => {
    const isStringDefault = typeof opts === 'string';
    const vars = isStringDefault ? undefined : (opts as Record<string, unknown> | undefined);
    // i18next-style fallback: try each key in order
    const keys = Array.isArray(key) ? key : [key];
    for (const k of keys) {
      const resolved = resolveMessageKey(defaultNs, k);
      if (resolved) {
        try {
          return M[resolved](vars ?? {});
        } catch {
          /* try next */
        }
      }
    }
    return isStringDefault ? (opts as string) : keys[0];
  }) as TFn;

type TFnFactory = (ns: string) => TFn;

const i18nObject = {
  get language(): Locale {
    return getLocale();
  },
  changeLanguage(lang: string): Promise<void> {
    setLocale(lang as Locale);
    return Promise.resolve();
  },
};

export function useTranslation(ns?: string | string[]) {
  const defaultNs = Array.isArray(ns) ? ns[0] : ns ?? 'common';
  return {
    t: t(defaultNs),
    i18n: i18nObject,
    ready: true,
  };
}
