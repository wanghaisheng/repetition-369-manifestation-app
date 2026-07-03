# Art Concept — 显化 369 (Manifestation 369)

> Phase 00 of the AI Product Compiler.
> Locks the world-view **before** any page, component, or asset exists.
> Any downstream style drift is treated as an Art Concept bug and fixed here first.

---

## 1. One-line world

**"A hand-bound storybook of intentions, warmed by afternoon light."**

不是一个"效率 App"，不是"冥想 App"，不是"打卡 App"。
它是一本被反复翻阅、写满字迹的**私人手工书**——温暖、有质感、带手写痕迹、随时间加深。

## 2. Product archetype

| 维度 | 定位 |
|------|------|
| Archetype | The Storyteller × The Sage（讲述者 × 智者） |
| Tone | 温柔、笃定、不喊叫、不焦虑 |
| Metaphor | 手工书 / 羊皮日记 / 木质书桌 / 暖色台灯 |
| **拒绝的类型** | 硅谷 SaaS 冷淡风、赛博朋克、玄学神秘学、女性向粉紫、AI 生成通用感 |

## 3. World-view axioms

1. **书写是仪式，不是任务** —— 每一次输入都应有"落笔"的重量感，不是聊天气泡。
2. **时间是朋友，不是压力** —— 进度是"年轮"，不是进度条百分比。
3. **私密优于社交** —— 默认单人叙事，社交是可选章节，不是主线。
4. **暖大于冷** —— 一切色温向暖偏移；冷色仅作为极少数功能性状态（info / focus）。
5. **纸感 > 玻璃感** —— 拒绝 iOS 毛玻璃、Neumorphism、Glassmorphism。用纸、墨、水彩边。
6. **手写笔触是签名** —— 标题字用衬线 / 手写体；正文保持清晰无衬线。

## 4. Sensory metaphor

- **视觉**：黄昏窗边、旧书页、蜂蜜色台灯、干燥的野花
- **触觉**：粗棉纸的粒感、皮质封面、蜡封
- **听觉参照**（不出现，仅指导节奏）：钢笔划过纸的沙沙声、翻页声
- **嗅觉参照**（同上）：旧书、雪松、蜂蜡

## 5. Color world

见 [`color-system.json`](./color-system.json)。原则：

- **1 主色** Honey `hsl(32 85% 55%)` — 阳光、蜂蜜、木质
- **1 辅色** Coral `hsl(12 70% 72%)` — 温柔的情绪、心跳
- **1 平衡色** Sage `hsl(135 25% 58%)` — 植物、呼吸、稳定
- **1 中性基底** Cream `hsl(42 50% 96%)` — 纸
- **1 文字色** Bark `hsl(25 35% 30%)` — 墨、木
- **0 蓝紫** —— 蓝仅用于 `info` 状态，紫**完全禁止**（避免"AI 通用感"）

## 6. Material & light

| 元素 | 材质语言 |
|------|----------|
| 卡片 | 纸卡片，有细微纸纹，边缘略带水彩晕染 |
| 按钮 | 蜡封 / 印章 / 邮票的实体感，非拟物但有厚度 |
| 分隔线 | 干笔画的手绘线，非 1px solid |
| 阴影 | 暖色低透明度（bark 5-12%），从上方偏斜（模拟台灯 45°） |
| 高光 | Honey 15% glow，用于焦点态和成就时刻 |
| 背景 | 米色/奶油纸底，section 之间用极浅色阶变化制造"翻页"感 |

**光源约定**：唯一光源在**左上 45°**，暖色（Honey）。所有阴影、渐变、材质高光遵守此方向。

## 7. Typography voice

| 用途 | 字族 | 语气 |
|------|------|------|
| Display / 章节标题 | **Lora**（衬线） | 郑重、书本感、文学 |
| 手写强调 / 引言 / 用户书写内容展示 | **Caveat** / **Kalam**（手写体） | 私密、当下、真实 |
| 正文 / UI | **Inter** / **Noto Sans SC** | 清晰、克制、退居其次 |
| **禁用** | Poppins, Montserrat, Roboto default | "AI 通用感"来源 |

字号阶梯：**大跳段**（display 3x body），不使用平缓的 1.125 modular scale——书籍排版感更重。

## 8. Icon language

- **Line-based** stroke 1.5px, **rounded caps**, 手绘感（非几何完美）
- 优先使用 **Lucide** 的圆角变体，但关键情感节点（愿望、成就、里程碑）用**定制手绘 SVG**
- **禁止**：Material Symbols、Ant Design 图标、渐变填充图标、3D 图标
- 情感符号（❤️ ✨ 🌱）**允许**作为文本 emoji 出现在用户书写内容里，但**不出现在 UI chrome**

## 9. Motion language

- **缓动**：`cubic-bezier(0.22, 1, 0.36, 1)`（缓出，如翻页）
- **时长**：默认 400-600ms，重要仪式感动作 800ms+
- **拒绝**：spring bounce、弹性、震动、Lottie 卡通爆炸
- **允许**：翻页、渐显、手写路径动画（stroke-dashoffset）、纸张飘落、蜡封盖章

## 10. UI 十条戒律（The Ten）

1. 不用蓝紫渐变（`#4f46e5 → #a855f7` 是禁忌）
2. 不用玻璃拟态、毛玻璃、Neumorphism
3. 不用 Material Design 默认组件外观
4. 不用等宽 grid 均匀分布——用**书页留白**（外边距 > 内边距 × 2）
5. 不用满屏 hero 视频 / 大字幕滚动
6. 不用刻板"Emoji + 标题 + 副标题"的 SaaS feature card 三段式
7. 不用 100% 纯白（`#ffffff`）——最亮也是 Cream `hsl(40 40% 99%)`
8. 不用纯黑（`#000000`）——最深是 Bark `hsl(25 30% 15%)`
9. 不用 shadcn 默认圆角（0.5rem）——本项目 `--radius: 1rem`
10. 不用"号称 AI 驱动"的 marketing 视觉套路（发光光晕 + 粒子 + 神经网络背景）

## 11. Applies-to matrix

| 场景 | 世界观强度 |
|------|-----------|
| Landing / Marketing | 100% —— 满血叙事，最强艺术性 |
| App 内核心页面（Wishes, Practice, Progress） | 85% —— 保留纸感、暖色、手写标题，减少装饰性纹理以保证可读 |
| 表单、Modal、Settings | 60% —— 功能优先，但边框圆角、阴影、字体依然遵守 |
| 系统 Toast / Alert | 40% —— 只保留色彩语言 |

## 12. Sign-off checklist

一个新组件 / 新页面 / 新素材上线前，必须能答"是"：

- [ ] 是否只使用 `color-system.json` 里的颜色？
- [ ] 阴影方向是否为**左上 45° 暖色**？
- [ ] 字体组合是否为 Lora + 手写 + Inter 三者之一或组合？
- [ ] 圆角是否 ≥ `1rem`？
- [ ] 是否**完全没有**蓝紫、玻璃感、Material 图标？
- [ ] 有没有至少一处"手工"痕迹（手绘线、水彩边、蜡封、手写字）？

如任一项为否 —— **回到 Art Concept，不要继续。**

---

**版本**：v1.0 — 2026-07-03
**下一阶段**：`01-design-scheme`（把这个世界翻译成页面地图 + 组件库 + 布局规则 + Imagen spec）
