

# 动态 Locale 前缀路由重构

## 问题

当前每个营销页面都有硬编码的 `/en/*` 路由文件（9个文件），添加新语言需要复制整套路由文件。

## 方案

用一个 `$locale` 参数路由替代所有 `/en/*` 硬编码路由。通过 `beforeLoad` 校验 locale 参数是否为支持的非默认语言，不合法则 404。

### 路由结构变化

```text
当前:
  src/routes/en/index.tsx        → /en
  src/routes/en/about.tsx        → /en/about
  src/routes/en/faq.tsx          → /en/faq
  src/routes/en/method369.tsx    → /en/method369
  ...（共9个文件）

重构后:
  src/routes/$locale.tsx         → /$locale (layout, validates locale)
  src/routes/$locale/index.tsx   → /$locale/ (landing)
  src/routes/$locale/about.tsx   → /$locale/about
  src/routes/$locale/faq.tsx     → /$locale/faq
  src/routes/$locale/method369.tsx
  src/routes/$locale/privacy.tsx
  src/routes/$locale/terms.tsx
  src/routes/$locale/user-stories.tsx
  src/routes/$locale/blog/index.tsx
  src/routes/$locale/blog/$slug.tsx
```

### 实现细节

**1. 创建 `src/routes/$locale.tsx`（layout route）**

```tsx
import { createRoute, Outlet, redirect } from '@tanstack/react-router';
import { Route as rootRoute } from './__root';
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from '@/config/routes';

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: '$locale',
  beforeLoad: ({ params }) => {
    const { locale } = params;
    // 默认语言不带前缀，重定向回无前缀路径
    if (locale === DEFAULT_LANGUAGE) {
      throw redirect({ to: '/' });
    }
    // 非支持语言 → 不匹配（让 catch-all 处理 404）
    if (!SUPPORTED_LANGUAGES.includes(locale as any)) {
      throw redirect({ to: '/$', params: { _splat: locale } });
    }
  },
  component: Outlet,
});
```

**2. 创建 `$locale/` 下的子路由**（每个文件模式相同）

例如 `src/routes/$locale/about.tsx`:
```tsx
import { createRoute, lazyRouteComponent } from '@tanstack/react-router';
import { Route as localeRoute } from '../$locale';

export const Route = createRoute({
  getParentRoute: () => localeRoute,
  path: 'about',
  component: lazyRouteComponent(() => import('@/pages/About')),
});
```

**3. 删除所有 `src/routes/en/*` 文件**（9个）

**4. 更新 `src/router.tsx`** — 替换 `en*` 导入为 `$locale*` 导入

**5. 更新 `src/utils/languageUrl.ts`** — `getLanguageFromPath` 已经正确处理动态 locale，无需改动。`removeLanguagePrefix` 也已兼容。

### 好处

- 添加新语言只需在 `SUPPORTED_LANGUAGES` 加一项，零新路由文件
- 默认语言 `zh` 无前缀，`/zh/*` 自动重定向到 `/*`
- 不支持的 locale 自动 404
- 营销页面组件完全复用

### 文件变更

| 操作 | 文件 |
|------|------|
| **创建** | `src/routes/$locale.tsx` (layout) |
| **创建** | `src/routes/$locale/index.tsx`, `about.tsx`, `faq.tsx`, `method369.tsx`, `privacy.tsx`, `terms.tsx`, `user-stories.tsx`, `blog/index.tsx`, `blog/$slug.tsx` (9个) |
| **删除** | `src/routes/en/index.tsx`, `about.tsx`, `faq.tsx`, `method369.tsx`, `privacy.tsx`, `terms.tsx`, `user-stories.tsx`, `blog/index.tsx`, `blog/$slug.tsx` (9个) |
| **修改** | `src/router.tsx` — 更新导入 |

