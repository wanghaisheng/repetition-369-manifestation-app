

# 绘本温暖世界 — 设计系统实施

## 两个产出物

### 产出物 1: 设计哲学文档 + 视觉画布
- `/mnt/documents/storybook-warmth-philosophy.md` — 设计运动宣言
- `/mnt/documents/storybook-warmth-canvas.png` — 视觉表达画布（使用 Lora + NothingYouCouldDo 字体）

### 产出物 2: 代码级设计系统改造

将当前 iOS/科技蓝冷调 → 绘本温暖世界暖调。

## 色彩体系变更

```text
当前 (冷色 iOS 风)              →  目标 (绘本暖色)
──────────────────────────────────────────────────────
--primary: 221 83% 53% (蓝)     →  32 85% 55% (蜂蜜橙)
--accent: 262 83% 58% (紫)      →  350 65% 65% (珊瑚粉)
--secondary: 210 40% 96%        →  40 60% 95% (奶油黄)
--muted: 210 40% 96%            →  45 30% 94% (暖灰)
--background: 0 0% 100%         →  40 40% 99% (微暖白)
--foreground: 222 84% 5%        →  25 30% 15% (暖深棕)
```

新增绘本专属语义色:
```css
--storybook-honey: 38 80% 58%;      /* 蜂蜜金 - 主角色 */
--storybook-coral: 12 70% 72%;      /* 珊瑚粉 - 温馨强调 */
--storybook-sage: 135 25% 58%;      /* 苔藓绿 - 成长/自然 */
--storybook-cream: 42 50% 96%;      /* 奶油白 - 背景 */
--storybook-bark: 25 35% 30%;       /* 树皮棕 - 文字 */
--storybook-blush: 350 50% 90%;     /* 腮红 - 柔和高光 */
```

## 圆角与形态

```text
当前: --radius: 0.75rem (标准圆角)
目标: --radius: 1rem (更圆润，绘本有机感)
新增: --radius-organic: 1.5rem (卡片/按钮的绘本圆角)
```

Tailwind 新增:
```ts
borderRadius: {
  'storybook': '1.25rem',
  'storybook-lg': '1.75rem',
  'blob': '40% 60% 55% 45% / 60% 40% 65% 35%', // 有机不规则形
}
```

## 字体

替换 SF Pro 系统字体为更有温度的组合:
```ts
fontFamily: {
  'storybook': ['Lora', 'Georgia', 'serif'],           // 标题 - 温暖衬线
  'handwritten': ['NothingYouCouldDo', 'cursive'],      // 点缀 - 手写体
  'body': ['"Noto Sans SC"', 'system-ui', 'sans-serif'], // 正文
}
```

通过 Google Fonts 在 `index.html` 中 preload Lora 和 NothingYouCouldDo。

## 纹理与视觉效果

在 `index.css` 新增:
```css
/* 纸张纹理叠加 */
.paper-texture {
  background-image: url("data:image/svg+xml,..."); /* 轻微噪点纹理 */
  background-blend-mode: overlay;
}

/* 水彩边缘效果 */
.watercolor-edge {
  border-image: ... ; /* 不规则边缘 */
}

/* 手绘阴影（柔和扩散） */
--shadow-storybook: 0 4px 20px -4px hsl(var(--storybook-bark) / 0.08);
--shadow-storybook-hover: 0 8px 30px -6px hsl(var(--storybook-bark) / 0.12);
```

## 动画调整

保留现有动画，新增绘本风:
```ts
keyframes: {
  'float-gentle': { /* 轻柔漂浮，如绘本中的云朵 */ },
  'sprout': { /* 种子发芽生长动画 */ },
  'page-turn': { /* 翻页效果 */ },
}
```

## 文件变更

| 操作 | 文件 | 说明 |
|------|------|------|
| **生成** | `/mnt/documents/storybook-warmth-philosophy.md` | 设计哲学宣言 |
| **生成** | `/mnt/documents/storybook-warmth-canvas.png` | 视觉画布 |
| **修改** | `src/index.css` | CSS 变量全量替换为暖色系 + 新增纹理/效果类 + 清理 500 行冗余硬编码样式 |
| **修改** | `tailwind.config.ts` | 新增 storybook 色彩/圆角/字体/动画 token，清理旧 iOS 硬编码色 |
| **修改** | `index.html` | 预加载 Lora + NothingYouCouldDo Google Fonts |
| **更新** | `docs/DESIGN_SYSTEM.md` | 用绘本温暖世界体系替换旧内容 |

### CSS 清理（同步进行）

当前 `index.css` 有大量硬编码颜色（`#007aff`, `#f2f2f7`, `#666` 等）和冗余空类（`.seo-head`, `.structured-data` 等）。将:
- 删除 ~300 行冗余/空类（L220-560 的硬编码 iOS 样式和空占位）
- 将有用样式改为使用 CSS 变量而非硬编码 hex

## 执行顺序

1. 生成设计哲学 .md + 视觉画布 .png（含 QA）
2. 修改 `src/index.css` — 替换 CSS 变量 + 清理冗余 + 新增纹理类
3. 修改 `tailwind.config.ts` — 新增 storybook token
4. 修改 `index.html` — 字体预加载
5. 更新 `docs/DESIGN_SYSTEM.md`

