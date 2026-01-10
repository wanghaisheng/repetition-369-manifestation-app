# Google SEO 风险规避指南

> 新站在 Google 眼中处于"信任考察期"（Sandbox），以下是容易被忽视但会导致惩罚或降权的风险点。

## 1. 内容层面的"自杀式"行为

### A. 采集与"洗稿"式 Programmatic SEO
- **风险**：利用 AI 瞬间生成数万个没有独到见解的页面，会被判定为"垃圾内容 (Scraped/Thin Content)"
- **对策**：确保每一页都有独特价值，增加用户评论、独特对比或使用建议
- **项目状态**：✅ 博客文章使用 KeywordDensityChecker 确保内容质量

### B. 关键词堆砌 (Keyword Stuffing)
- **风险**：在标题、描述、Alt标签里疯狂重复核心关键词，触发"过度优化惩罚"
- **对策**：使用 LSI（语义相关词），自然提及相关概念
- **项目状态**：✅ 关键词密度目标 2.5-3.5%，使用 BlogEditor 内置检查器

## 2. 链接与权重层面的陷阱

### A. "有毒"的初始外链 (Toxic Backlinks)
- **风险**：购买"5000个高权重外链"会导致 Manual Action（人工惩罚）
- **对策**：新站前期宁可外链为0，优先获取1-2个行业相关的自然外链
- **项目状态**：⏳ 建议通过真实内容营销获取外链

### B. 站群关联 (PBN 风险)
- **风险**：多个网站底层代码、IP、WHOIS 高度关联且疯狂互链
- **对策**：保持站点独立性，必须互链时使用 `rel="nofollow"`
- **项目状态**：✅ 单一域名运营

## 3. 技术与用户体验层面的隐患

### A. 隐形跳转与遮盖 (Sneaky Redirects / Cloaking)
- **风险**：给 Googlebot 和真实用户看不同内容，是 Google 的高压线
- **对策**：确保 Google 抓取的内容与用户看到的基本一致
- **项目状态**：✅ 无 cloaking，使用 react-snap 预渲染

### B. 移动端极其糟糕的体验
- **风险**：Mobile-First Indexing 下，移动端体验差会降低排名
- **对策**：在 GSC 中检查核心网页指标 (Core Web Vitals)
- **项目状态**：✅ 响应式设计，WebVitalsMonitor 实时监控

### C. 重复内容 (Duplicate Content) 误区
- **风险**：
  - 同时存在 http 和 https
  - 同时存在 www 和不带 www
  - 同一页面有多个带参数的 URL
- **对策**：严格设置 Canonical URL（规范链接）
- **项目状态**：✅ 已实现
  - RedirectHandler 强制 HTTPS 和 non-www
  - 所有页面自动生成 canonical URL
  - MultiLanguageSEO 组件处理多语言版本

## 4. GSC 负面信号监控

| 指标 | 警告阈值 | 应对措施 |
|------|---------|---------|
| "已抓取-尚未索引"比例 | >50% | 提升内容质量，减少薄内容 |
| 安全问题报告 | 任何 | 立即修复代码注入漏洞 |
| 5xx 错误 | 频繁 | 检查服务器稳定性 |
| 404 错误 | 大量积累 | 设置 301 重定向 |

## 5. 新站"避坑"建议总结

### 核心原则
1. **不要为了 SEO 而 SEO**：算法看重"用户意图满足度"
2. **建立 E-E-A-T**：
   - 完善"关于我们"页面 → `/about`, `/en/about`
   - 添加真实社交媒体链接
   - 展示团队专业背景
3. **保持频率稳定**："每周稳定更新3篇" > "一天100篇后停更"
4. **避免死链接积累**：及时 301 重定向或 GSC 提交移除

### 前3个月策略
- 排名波动或无排名是正常的
- 保持"逐步暴露"策略（见 STAGED_SITEMAP_STRATEGY.md）
- 结合高质量内容
- 通过 GSC 监控抓取报错

---

## 分阶段索引策略实施

### 工程架构
```
/sitemaps/
  ├── sitemap_p0_core.xml      # 核心页面
  ├── sitemap_p1_blog.xml      # 博客文章
  ├── sitemap_p2_stories.xml   # 用户故事
  └── sitemap_p3_app.xml       # 应用页面
```

### 动态控制原理
1. **一次性生成所有子 Sitemap**
2. **通过 sitemap_index.xml 动态控制暴露哪些子 Sitemap**
3. **同步更新 robots.txt 的 Allow/Disallow 规则**

### 当前实现
- Edge Function: `generate-sitemap?type=index|core|blog|stories|app`
- 配置变量: `current_phase` 控制阶段（1-4）
- robots.txt: 与阶段配置同步更新

### Sitemap 更新通知
更新 sitemap_index.xml 后，可通过以下 URL 通知 Google：
```
http://www.google.com/ping?sitemap=https://369.heymanifestation.com/sitemap_index.xml
```

---

## 项目 SEO 合规检查清单

| 检查项 | 状态 | 说明 |
|--------|------|------|
| HTTPS 强制 | ✅ | RedirectHandler 实现 |
| www 重定向 | ✅ | RedirectHandler 实现 |
| Canonical URL | ✅ | 所有页面自动生成 |
| Hreflang 标签 | ✅ | 多语言页面关联 |
| robots.txt 优化 | ✅ | 分阶段控制 |
| sitemap 动态生成 | ✅ | Edge Function 实现 |
| 关键词密度控制 | ✅ | 2.5-3.5% 目标 |
| 结构化数据 | ✅ | WebApplication/Organization Schema |
| Core Web Vitals | ✅ | 监控组件实现 |
| 移动端优化 | ✅ | 响应式设计 |
| E-E-A-T 信号 | ✅ | About 页面完善 |
| 内链策略 | ✅ | EnhancedInternalLinks 组件 |

---

*最后更新: 2026-01-10*
*参考: docs/STAGED_SITEMAP_STRATEGY.md*
