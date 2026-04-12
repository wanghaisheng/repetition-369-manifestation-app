
# 显化369 设计系统 — Storybook Warmth

## 🎨 设计哲学

**Storybook Warmth** — 翻开一本治愈系绘本的视觉体验。圆润有机的形态取代锐利几何，手绘笔触质感取代平滑渐变，温暖低饱和色彩营造亲切、友好、充满陪伴感的氛围。

### 核心原则
1. **有机温暖**: 圆润形态，手绘质感，纸张纹理
2. **绘本叙事**: 通过视觉隐喻传达成长旅程（种子→发芽→开花）
3. **治愈陪伴**: 色彩温暖、空间宽裕、交互柔和
4. **匠心精作**: 每个细节都经过精心打磨，如同手工绘本插画

## 🌈 色彩系统

### 核心语义色（CSS 变量）

| Token | Light 值 | 用途 |
|-------|---------|------|
| `--primary` | `32 85% 55%` | 蜂蜜橙 — 主要操作 |
| `--accent` | `350 65% 65%` | 珊瑚粉 — 温馨强调 |
| `--secondary` | `40 60% 95%` | 奶油黄 — 次要背景 |
| `--background` | `40 40% 99%` | 微暖白 — 页面底色 |
| `--foreground` | `25 30% 15%` | 暖深棕 — 正文文字 |
| `--muted` | `45 30% 94%` | 暖灰 — 静音区域 |

### 绘本专属色

| Token | 值 | 用途 |
|-------|---|------|
| `--storybook-honey` | `38 80% 58%` | 蜂蜜金 — 主角色/品牌色 |
| `--storybook-coral` | `12 70% 72%` | 珊瑚粉 — 温馨强调 |
| `--storybook-sage` | `135 25% 58%` | 苔藓绿 — 成长/自然 |
| `--storybook-cream` | `42 50% 96%` | 奶油白 — 柔和背景 |
| `--storybook-bark` | `25 35% 30%` | 树皮棕 — 深色文字 |
| `--storybook-blush` | `350 50% 90%` | 腮红 — 柔和高光 |

### 使用规则
- **永远不要**在组件中使用硬编码颜色（如 `#007aff`、`text-white`）
- **始终使用**语义 token：`bg-primary`、`text-foreground`、`bg-storybook-cream`
- 所有颜色通过 HSL CSS 变量定义，支持 light/dark 模式自动切换

## 📐 圆角与形态

```css
--radius: 1rem;              /* 基础圆角 — 比标准更圆润 */
--radius-organic: 1.5rem;    /* 有机圆角 — 卡片/按钮 */
```

Tailwind 扩展：
- `rounded-storybook` → `1.25rem`
- `rounded-storybook-lg` → `1.75rem`
- `rounded-blob` → 有机不规则形状

## 🔤 字体系统

| 用途 | 字体 | Tailwind class |
|------|------|----------------|
| 标题/品牌 | Lora (衬线) | `font-storybook` |
| 手写点缀 | Nothing You Could Do | `font-handwritten` |
| 正文 | Noto Sans SC / system-ui | `font-body` |

## 🎭 动画系统

### 绘本专属动画

| 名称 | 用途 | Tailwind class |
|------|------|----------------|
| `float-gentle` | 轻柔漂浮，如云朵 | `animate-float-gentle` |
| `sprout` | 种子发芽生长 | `animate-sprout` |
| `page-turn` | 绘本翻页效果 | `animate-page-turn` |

### 继承动画
fade-in, scale-in, slide-up, bounce-gentle 等保持不变。

## 🖌️ 纹理与效果

### CSS 工具类

| Class | 效果 |
|-------|------|
| `.paper-texture` | SVG 噪点纹理叠加，模拟手工纸质感 |
| `.watercolor-edge` | 水彩边缘效果（organic 圆角 + 内阴影） |

### 阴影系统

| Token | 用途 |
|-------|------|
| `shadow-storybook` | 默认卡片阴影 — 柔和温暖 |
| `shadow-storybook-hover` | 悬停状态阴影 |
| `shadow-elegant` | 精致长阴影 |

## 📱 响应式与触控

- 最小触控目标：44px（Apple HIG）
- 安全区域：`safe-area-inset` / `safe-area-bottom` / `safe-area-top`
- 移动端隐藏滚动条，桌面端显示暖色调滚动条
- 触控反馈：`scale(0.97)` + `opacity(0.8)` 动画

## ♿ 无障碍

- 焦点状态：`2px solid hsl(var(--primary))` + `2px offset`
- `prefers-reduced-motion`：关闭所有动画
- 输入框 iOS 缩放修复：`font-size: 16px !important`
