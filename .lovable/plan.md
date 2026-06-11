
# 用 Paraglide JS 替换 i18next

## 现状摸底（已确认）

- **资源**: `src/i18n/resources/{zh,en}/` 共 8 个 namespace（common/landing/app/marketing/about/faq/method369/userStories），zh 侧 **~1008 个 key**
- **调用面**: 70 个文件用 `useTranslation`，**~850 个 `t()` 调用点**
- **复杂度幸运地很低**:
  - 0 个 `<Trans>` 组件
  - 仅 1 处 `{{var}}` 插值
  - 0 处复数（plural / count）
  - 嵌套 key 用点号（`t('wishes.addWish')`）
- **语言切换**: 当前禁用了 i18next 自动检测，由 `LanguageRouter` + TanStack Router `$locale` 段控制
- **未来**: 架构计划迁到 Astro SSR + Cloudflare D1，Paraglide 的"零运行时 / tree-shake" 在这个场景比 i18next 更合适

## 为什么 Paraglide 在本项目是正收益

1. **类型安全**: 850 个 `t('xxx.yyy')` 字符串 key 变成 `m.xxx_yyy()` 函数调用，编译期就能抓到拼错和缺失
2. **Bundle 更小**: 当前 8 个 ns × 2 locale 全量打包；Paraglide 按 message tree-shake，未用到的消息不进 bundle
3. **SSR 干净**: 没有 i18next 的初始化 / Suspense / 语言检测器副作用，对未来 Astro SSR 友好
4. **与 `$locale` 路由天然契合**: Paraglide 的 `setLocale(locale)` 可以直接在 TanStack Router `beforeLoad` 里调用

## 实施策略：codemod 驱动的分批迁移

850 个调用点手改不现实，核心策略是**写一个一次性 codemod 脚本**自动转换。

### Phase 1 — 基建（不动业务代码）

1. 安装 `@inlang/paraglide-js` + Vite plugin，配置 `project.inlang/`（locales: zh/en, baseLocale: zh）
2. 写一个 `scripts/i18n-to-paraglide.ts`:
   - 读取所有 `resources/{zh,en}/*.json`
   - 扁平化嵌套 key：`wishes.addWish` → `wishes_addWish`（命名空间作为前缀以避免冲突：`app_wishes_addWish`）
   - 输出 `messages/zh.json` 和 `messages/en.json`（Paraglide 标准格式）
3. 运行 `paraglide-js compile` 生成 `src/paraglide/messages.ts`（类型化的 `m.app_wishes_addWish()`）
4. 写一份 `key-map.json`（旧 key → 新 key 的映射表），供下一步使用

### Phase 2 — codemod 改调用点（一次性，自动）

写 `scripts/codemod-t-calls.ts`（用 ts-morph 或 jscodeshift）：

- 找到所有 `useTranslation(...)` → 删除导入和声明
- 把 `t('wishes.addWish')` 用 `key-map.json` 反查得到新 key，替换成 `m.app_wishes_addWish()`
- 多 namespace 形式（`useTranslation(['common', 'app'])` + `t('common:foo')`）按前缀分发
- 唯一一处 `{{var}}` 插值改成 Paraglide 的 `m.xxx({ var })`
- 改完后跑 `tsc --noEmit`：任何 `m.xxx` 不存在都会立刻报错，等于自带回归网

> **可选回退栏杆**: 保留一个 `t()` shim（包装 `m.*`），让 codemod 先无脑替 import 不替函数名，分两步上线，风险更低。我倾向直接一次到位，因为 tsc 会兜底。

### Phase 3 — 语言切换接线

- 删除 `src/i18n/index.ts` 和 `i18next` / `react-i18next` / `i18next-browser-languagedetector` 依赖
- `LanguageRouter` 改为调用 `setLocale(locale)`（Paraglide）
- TanStack Router `$locale` layout 的 `beforeLoad` 里同步 `setLocale`
- 确认 `i18n-resource-parity` 校验脚本指向新的 `messages/{zh,en}.json`

### Phase 4 — 验证

- `tsc --noEmit` 通过（兜住所有 key）
- 跑现有的 i18n parity 校验（zh/en key 集合相等）
- 手工烟雾测试：Landing / 5 个 App view 各切一次中英文
- 对比 bundle size（预期 main chunk 减少 50-150 KB）

## 工作量预估

- Phase 1: 0.5 天
- Phase 2: 1 天（写 codemod + 跑 + 修边界情况）
- Phase 3: 0.5 天
- Phase 4: 0.5 天
- **合计 ~2.5 天**，绝大部分是脚本工作，手改预计 < 10 个文件

## 风险与对策

| 风险 | 对策 |
|---|---|
| Key 命名冲突（不同 ns 同名） | 强制加 ns 前缀 `{ns}_{flatKey}` |
| 动态 key `t(\`foo.${id}\`)` | codemod 先 grep，若存在则单独 case-by-case 处理（初步扫已知无） |
| Astro 预渲染脚本依赖 i18next | 同步改 `scripts/prerender.*` 走 Paraglide 的 `getLocale()` |
| zh 是 baseLocale，回退行为变化 | 显式设置 `fallbackLocale: 'zh'` 等价 |

## 不在本次范围

- 不引入新的 locale（只保 zh + en）
- 不改 UI 文案、不改资源内容
- 不改 routing 结构（`$locale` 段保留）
- 不动 React 组件除被 codemod 自动改的 import / `t()` 调用

## 需要你确认 1 件事

`key-map` 命名约定我倾向 `{ns}_{dotted_key_with_underscore}`（如 `app_wishes_addWish`）。如果你更喜欢 `{ns}__{key}` 双下划线或纯扁平无 ns 前缀（要求全局唯一），告诉我，否则我按上面方案执行。
