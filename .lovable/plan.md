
# Phase 01 · High-Fidelity Mockup 生成计划

基于 Phase 00 已确定的设计语言（Midnight Indigo + Cormorant/Karla + Single Column + Dark Only + Gold-only accent），本阶段产出 5 个视图的高保真静态图，并为每个视图提供 3 个可对比版本，供你择一进入 Phase 02。

## 范围

5 个 App 内部视图：Home / Wishes / Practice / Progress / Community

## 每视图产出 3 个可对比版本

三版本沿同一设计语言（色板/字体/版式锁定），仅在**构图与节奏**上拉开差异：

| 版本 | 代号 | 设计取向 |
|------|------|---------|
| A | **Observatory** | 极简留白 · 大段 Cormorant 斜体 · 单一 Indigo 光晕 · 类天文台仪表 |
| B | **Manuscript** | 编辑式排版 · Gold 金线分隔 · 序号/编号文本 · 类古籍手稿 |
| C | **Aurora** | 沉浸式渐变 · 顶部弧形极光带 · 卡片浮于深空 · 类深夜冥想 App |

三版本共享同一 design-system.md tokens，只是把 token 用在不同的视觉重音上 —— 方便 Phase 02 抽取资产时只需切换"构图分支"。

## 生成方法

- 使用 imagegen `premium` 档（含可读字符的 UI 类 mockup 必须用 premium）
- 单图尺寸：1024 × 1920（移动端 9:16，对齐"一屏"原则）
- 每图都喂入 Phase 00 `imagegen-prompt.md` 中的 base prompt + 视图专属内容 + 版本专属构图指令
- 共 5 视图 × 3 版本 = **15 张图**，并行生成

## 产出物

```
/mnt/documents/redesign/v1/mockups/
├── home/
│   ├── home-A-observatory.png
│   ├── home-B-manuscript.png
│   └── home-C-aurora.png
├── wishes/
│   ├── wishes-A-observatory.png
│   ├── wishes-B-manuscript.png
│   └── wishes-C-aurora.png
├── practice/         (×3)
├── progress/         (×3)
├── community/        (×3)
└── COMPARISON.md     ← 对比清单：缩略图九宫格 + 每版本设计意图 + 推荐使用场景 + 我的初步推荐
```

`COMPARISON.md` 会给你：
- 每行一个视图，三列并排的 markdown 图表
- 每个版本一句话设计语句（"为什么是它"）
- 每个版本一句话权衡（"代价是什么"）
- 我的推荐组合（可全部同版本，也可跨版本混搭）

## 不做的事

- 不写任何 React/CSS 代码
- 不进入 Phase 02 资产提取
- 不修改现有组件
- 不生成 Landing / Auth / Settings 的 mockup（超出本轮范围）

## 决策点（你看到 COMPARISON.md 之后）

1. 五个视图分别选哪个版本？（可同款也可混搭）
2. 是否需要某版本的微调重生成？
3. 确认后进入 Phase 02（资产提取 + visual_inventory 对账）
