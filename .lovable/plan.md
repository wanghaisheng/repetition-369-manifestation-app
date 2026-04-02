

# 纯展示组件改造 — 为 Astro 迁移做准备

## 目标架构

```text
当前 (React SPA):
  Route → Page Component → useEffect/useLocation/Helmet → UI

目标 (Astro-ready):
  Route (beforeLoad/loader) → props → Pure Component → UI
  Route (meta/head)        → SEO tags (no Helmet in components)
  Route (onLoad subscriber) → analytics/scroll/perf side effects
```

**核心原则**: React 组件只接收 props 渲染 UI，不调用 `useEffect`、不访问 `window/document/navigator`、不使用 `useLocation/useTranslation`（改为接收 `locale`/`t` 函数作为 props 或由上层注入）。

---

## 改造范围与分层

### 第 1 层：SEO 组件统一 → 路由 meta 函数（删 6 个组件）

**问题**: 存在 6 个重叠的 SEO 组件（`MultiLanguageSEO`, `UnifiedSEO`, `ComprehensiveSEO`, `AdvancedSEO`, `SEOHead`, `ModularSEO`），全部内部调用 `useLocation` + `useTranslation` + `Helmet`。

**方案**:
- 在 `__root.tsx` 的 `RootComponent` 中，用一个统一的 `<RootHelmet>` 读取路由 context 中的 SEO 数据并输出所有 meta 标签
- 每个路由文件通过 `beforeLoad` 或 `staticData` 提供 `{ seo: { title, description, keywords, image, type } }`
- 删除: `MultiLanguageSEO`, `UnifiedSEO`, `ComprehensiveSEO`, `AdvancedSEO`, `SEOHead`, `ModularSEO`
- 保留: `StructuredData`（已是纯 props 组件）、`AdvancedStructuredData`（改为纯 props）

**示例 — 路由声明 SEO**:
```tsx
// src/routes/about.tsx
export const Route = createRoute({
  path: 'about',
  staticData: {
    seo: {
      titleKey: 'about.seo.title',
      descriptionKey: 'about.seo.description',
      keywords: 'about,manifestation,369',
    }
  },
  component: lazyRouteComponent(() => import('@/pages/About')),
});
```

**示例 — Root 统一输出 Head**:
```tsx
// __root.tsx 内
const RootHelmet = () => {
  const matches = useMatches(); // 读取所有匹配路由的 staticData
  const { i18n } = useTranslation();
  const location = useLocation();
  // 合并最深匹配路由的 seo 数据，生成 title/description/canonical/hreflang
  // 单一 <Helmet> 输出
};
```

### 第 2 层：Landing 营销组件纯化（5 个组件）

| 组件 | 当前问题 | 改造 |
|------|----------|------|
| `ConversionOptimizedCTA` | `useEffect`(interval), `navigator.share`, `window.location` | 移除 interval（静态数字即可），`handleShare` 作为 `onShare` prop 从页面传入 |
| `HeroOptimized` | `useTranslation` 内部调用 | 改为接收 `texts` props（由页面组件传入翻译后的文本） |
| `OptimizedHeader` | `useTranslation` 内部调用 | 同上，接收 `texts` + `locale` props |
| `OptimizedFeatures` | `useTranslation` 内部调用 | 接收 `features[]` + `sectionTitle` props |
| `SocialProofSection` | `useTranslation` + `useSiteStats` hook | 接收 `testimonials[]` + `stats` props，数据获取提到页面/路由层 |

> **注意**: `useTranslation` 在纯展示组件中的去除是渐进的。第一步先处理有 `useEffect`/`window` 的组件，`useTranslation` 可暂时保留（Astro 的 React island 中仍可用 i18n context）。如果要彻底纯化，则页面层传入翻译后文本。

### 第 3 层：副作用集中到 `__root.tsx`（已部分完成）

当前 `__root.tsx` 已有 `LanguageSync`、`RouteEffects`、`RedirectNormalizer`。进一步：
- 将 `document.documentElement.lang = ...` 从 `MultiLanguageSEO` 移到 `LanguageSync`
- 将 `CriticalResourceOptimizer`、`SearchConsoleVerification` 的 Helmet 内容合并到 `RootHelmet`
- `WebVitalsMonitor`、`PageLoadMonitor` 逻辑移到路由 `onLoad` 订阅或 root `useEffect`

### 第 4 层：App 业务组件（HomeView, PracticeView 等）

这些组件通过 hooks（`useWishes`, `usePractice` 等）获取数据。当前模式已经接近展示组件：
- hooks 返回数据 → 组件渲染
- 暂不改动，待 Astro 迁移时将数据获取移到 Astro 页面的 `getStaticProps`/`getServerSideProps` 等效层

---

## 文件变更汇总

| 操作 | 文件 | 说明 |
|------|------|------|
| **创建** | `src/components/seo/RootHelmet.tsx` | 统一 Head 管理，纯读取路由 context |
| **修改** | `src/routes/__root.tsx` | 添加 `RootHelmet`，删除冗余 SEO 组件引用 |
| **修改** | 所有 9 个路由文件 + `$locale` 子路由 | 添加 `staticData.seo` |
| **修改** | `src/pages/Landing.tsx` | 删除 `MultiLanguageSEO`/`AdvancedStructuredData`/`SocialMediaCards` 组件调用 |
| **修改** | `src/components/landing/ConversionOptimizedCTA.tsx` | 移除 `useEffect`、`navigator`/`window` 访问 |
| **修改** | `src/components/seo/AdvancedStructuredData.tsx` | 改为纯 props（`pathname`/`locale` 作为 props） |
| **修改** | `src/components/seo/SocialMediaCards.tsx` | 改为纯 props |
| **删除** | `src/components/seo/MultiLanguageSEO.tsx` | 合并到 RootHelmet |
| **删除** | `src/components/seo/UnifiedSEO.tsx` | 合并到 RootHelmet |
| **删除** | `src/components/seo/ComprehensiveSEO.tsx` | 合并到 RootHelmet |
| **删除** | `src/components/seo/AdvancedSEO.tsx` | 合并到 RootHelmet |
| **删除** | `src/components/seo/SEOHead.tsx` | 合并到 RootHelmet |
| **删除** | `src/components/seo/ModularSEO.tsx` | 合并到 RootHelmet |

### 不改动（保持现状）

- `src/components/landing/OptimizedFooter.tsx` — 仅用 `useTranslation` + `Link`，无副作用，Astro 兼容
- `src/components/landing/AboutFounderOptimized.tsx` — 同上
- App 业务组件（`HomeView`, `PracticeView` 等）— hooks 模式在客户端 island 中仍适用
- Analytics 组件（`GoogleAnalytics`, `MicrosoftClarity`）— 本质是脚本注入，保留在 root 层

---

## 执行顺序

1. 创建 `RootHelmet` + 修改 `__root.tsx` 集成
2. 为所有路由文件添加 `staticData.seo`
3. 修改 `Landing.tsx` 和其他页面，删除 SEO 组件调用
4. 纯化 `ConversionOptimizedCTA`（移除 useEffect/window/navigator）
5. 纯化 `AdvancedStructuredData` 和 `SocialMediaCards`（改为 props 驱动）
6. 删除 6 个冗余 SEO 组件
7. 验证所有路由的 meta 标签输出正确

