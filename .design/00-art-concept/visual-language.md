# Visual Language — 显化 369

> Companion to `art-concept.md`. This is the **operational** doc: patterns, do/don't, code-level rules that turn the world-view into shippable UI.

## 1. Layout DNA

- **书页留白**: 页面外边距 ≥ 内容内边距 × 2。移动端 24px 外，桌面 96-160px 外。
- **单列叙事优先**: App 主界面遵循"一屏一件事"（memory: mobile one-screen principle）。多列仅用于 Landing 的对比 section。
- **垂直节奏**: section 之间 spacing 用 8 的倍数递增（48 / 64 / 96 / 128），非线性——像章节间距。
- **对齐**: 左对齐为主，居中仅用于仪式感节点（欢迎语、成就）。

## 2. Component patterns

### Card
```
背景: bg-card (cream)
边框: 1px solid border（偏暖）
圆角: rounded-2xl (16px)
阴影: shadow-storybook（左上偏斜暖阴影）
hover: translateY(-2px) + shadow-storybook-hover
可选装饰: 左侧 4px 手绘色带 / 右上角"蜡封"emoji 印章
```

### Button
```
primary:  bg-primary text-primary-foreground rounded-full px-6 py-3
          hover: brightness(1.05) + shadow-glow
          active: translateY(1px)
secondary: bg-secondary border border-border（纸质按钮，无阴影）
ghost:     text-foreground hover:bg-muted（页面 chrome）
```
- **禁止**: gradient buttons except CTA / conversion moments
- 大 CTA 允许 `bg-gradient-primary`（honey→coral）+ shadow-glow

### Input
```
背景: bg-background
边框: 1px solid input，focus 时 ring-2 ring-primary/40
圆角: rounded-xl (12px)
字体: 正文用 Inter；用户书写内容显示时用手写体 (Caveat)
```

### Modal / Sheet
- 底层遮罩: `bg-bark/40 backdrop-blur-none`（**不用毛玻璃**）
- 面板: `bg-card rounded-3xl shadow-elegant`
- 入场: 从下 24px 缓出，400ms

## 3. Typography scale

| Token | Font | Size / Line | Use |
|-------|------|-------------|-----|
| `display-xl` | Lora 700 | 56/64 | Hero |
| `display-lg` | Lora 600 | 40/48 | Section 章节 |
| `display-md` | Lora 600 | 28/36 | Card title, page title |
| `handwritten-lg` | Caveat 500 | 32/40 | 引言、用户书写内容 |
| `handwritten-md` | Caveat 500 | 22/30 | 副标签、注解 |
| `body`     | Inter 400 | 16/26 | 正文 |
| `body-sm`  | Inter 400 | 14/22 | 辅助 |
| `caption`  | Inter 500 | 12/16 uppercase tracking-wide | 标签 |

**禁止**: font-weight ≥ 800 用于 UI（只有 Lora 700 display 允许）；font-weight 300 一律不用。

## 4. Iconography

- **默认库**: Lucide (rounded variant)
- **stroke-width**: 1.5
- **size ladder**: 16 / 20 / 24 / 32 / 48
- **色**: 继承 currentColor；不主动上色除非表达情感（Heart=coral, Star=honey）
- **手绘图标位置**: Wishes 图标、成就徽章、Practice 打卡印章、Milestone 蜡封——这五处必须是**定制 SVG**，不是 Lucide

## 5. Illustration & imagery

- **风格**: 水彩 + 干笔勾线，暖色为主，留白多
- **主题**: 植物 (蒲公英、麦穗、橄榄枝)、光线、书页、手、蜡封
- **禁止**: 3D 渲染、扁平企业插画（Corporate Memphis）、真人照片（除创始人）、AI 通用感"渐变球体+粒子"
- **人物**: 创始人真实照片可用；其他一律用抽象化的手/剪影，不用具象人物插画

## 6. Motion patterns

| 场景 | 动效 |
|------|------|
| 页面切换 | fade + 上移 8px, 400ms |
| Card 出现 | stagger, 每张 delay 60ms, 400ms |
| 完成打卡 | 蜡封盖章 800ms: scale 1.2→1 + rotate -5°→0 + shadow bloom |
| 成就解锁 | 纸片飘落 1200ms + 光晕呼吸 |
| 手写内容显示 | stroke-dasharray 动画 800ms（一次性，之后不重播） |
| Skeleton | 暖色微弱 shimmer（非蓝白）|

**Framer Motion 缓动统一**: `[0.22, 1, 0.36, 1]`

## 7. Voice & copy alignment

不是 UI 但决定视觉的呼吸：

- 标题**避免**"Boost", "Unlock", "Supercharge", "10x"
- **倾向** "Begin your...", "A gentle way to...", "Today, three..."
- 数字**手写体**呈现（3-6-9, 连续天数, 里程碑）——视觉与文字共同强化仪式感

## 8. Accessibility non-negotiables

- 所有文字 contrast ratio ≥ 4.5:1（Bark 25 30% 15% on Cream 42 50% 96% = 12.8:1 ✓）
- 焦点态: `ring-2 ring-primary ring-offset-2`, 永不 `outline: none` 不补偿
- Motion respects `prefers-reduced-motion`

## 9. Anti-patterns 检查

任何 PR 出现以下代码 = 违规，回炉：

```tsx
// ❌ 禁止
className="text-white bg-black"
className="bg-gradient-to-r from-purple-500 to-indigo-600"
className="backdrop-blur-lg bg-white/20"        // glassmorphism
className="rounded-md"                           // 默认 shadcn 圆角
style={{ boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} // 冷阴影
<Sparkles /> <Zap /> <Rocket />                  // AI 生成套路图标组合

// ✅ 应该
className="text-foreground bg-background"
className="bg-gradient-primary"                  // honey→coral
className="bg-card border shadow-storybook"
className="rounded-2xl"
```

## 10. Component provenance rule

新建组件时必须在文件头部注释艺术依据：

```tsx
/**
 * WishCard — "手工书的一页"
 * Art: nested paper card, honey seal on complete
 * Motion: enter fade+8px, complete stamp 800ms
 */
```

无此注释的组件不合入。
