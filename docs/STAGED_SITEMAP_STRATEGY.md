# 分阶段Sitemap索引策略 (Staged Sitemap Exposure Strategy)

## 策略概述

本项目采用**分阶段逐步暴露 (Staged Exposure)** 策略，通过动态控制 Sitemap Index 和 robots.txt 来引导搜索引擎抓取，确保核心页面优先被索引。

## 架构设计

### Sitemap Index 结构

```
sitemap_index.xml (主索引)
├── sitemap-core.xml    (P0: 核心静态页面)
├── sitemap-blog.xml    (P0: 博客文章)
├── sitemap-stories.xml (P1: 用户故事)
└── sitemap-app.xml     (P2: 应用页面 - 可选)
```

### 阶段配置

| 阶段 | 时间线 | 开放内容 | 目标 |
|------|--------|----------|------|
| Phase 1 | Week 1-2 | 核心页面 + 博客 | 建立基础权重 |
| Phase 2 | Week 3-4 | + 用户故事 | 扩展内容覆盖 |
| Phase 3 | Week 5+ | + 应用页面(可选) | 完全开放 |

## 实现细节

### 1. Edge Function 配置

文件路径: `supabase/functions/generate-sitemap/index.ts`

```typescript
// 阶段控制配置
const SITEMAP_PHASES = {
  current_phase: 2, // 修改此值控制当前阶段
  phase_config: {
    1: ['sitemap-core', 'sitemap-blog'],
    2: ['sitemap-core', 'sitemap-blog', 'sitemap-stories'],
    3: ['sitemap-core', 'sitemap-blog', 'sitemap-stories', 'sitemap-app'],
  }
};
```

### 2. Sitemap 访问URL

| Sitemap | URL |
|---------|-----|
| 主索引 | `https://hziwbeyokjdswlzzmjem.supabase.co/functions/v1/generate-sitemap?type=index` |
| 核心页面 | `https://hziwbeyokjdswlzzmjem.supabase.co/functions/v1/generate-sitemap?type=core` |
| 博客文章 | `https://hziwbeyokjdswlzzmjem.supabase.co/functions/v1/generate-sitemap?type=blog` |
| 用户故事 | `https://hziwbeyokjdswlzzmjem.supabase.co/functions/v1/generate-sitemap?type=stories` |
| 应用页面 | `https://hziwbeyokjdswlzzmjem.supabase.co/functions/v1/generate-sitemap?type=app` |

### 3. robots.txt 阀门控制

```text
# P0 核心页面 - 完全开放
Allow: /$
Allow: /about
Allow: /blog

# 应用内部页面 - 不需要索引
Disallow: /app
Disallow: /auth
```

## URL 分层策略

### P0 层 - 核心页面 (Priority: 0.9-1.0)
- 首页 `/`, `/en`
- 关于页 `/about`, `/en/about`
- 369方法 `/method369`, `/en/method369`
- FAQ `/faq`, `/en/faq`
- 博客列表 `/blog`, `/en/blog`
- 博客文章 `/blog/:slug`, `/en/blog/:slug`

### P1 层 - 内容页面 (Priority: 0.7-0.8)
- 用户故事 `/user-stories`, `/en/user-stories`

### P2 层 - 辅助页面 (Priority: 0.3-0.4)
- 隐私政策 `/privacy`
- 服务条款 `/terms`
- 认证页面 `/auth` (建议不索引)

### P3 层 - 应用页面 (不索引)
- 应用主页 `/app`
- 管理后台 `/blog-admin`, `/admin-stats`

## 阶段升级操作

### 升级到下一阶段

1. **修改 Edge Function 配置**
   ```typescript
   current_phase: 2, // 改为 3
   ```

2. **部署 Edge Function**
   ```bash
   supabase functions deploy generate-sitemap
   ```

3. **更新 robots.txt** (如需调整)
   - 修改 `public/robots.txt`
   - 提交并部署

4. **通知 Google 更新**
   ```bash
   curl "http://www.google.com/ping?sitemap=https://hziwbeyokjdswlzzmjem.supabase.co/functions/v1/generate-sitemap?type=index"
   ```

## GSC 监控指标

### 每阶段需监控

1. **索引覆盖率**
   - "已抓取 - 尚未索引" 比例 < 20%
   - "已索引" 数量稳步增长

2. **抓取统计**
   - 抓取请求频率
   - 响应时间 < 500ms
   - 5xx 错误 = 0

3. **核心网页指标**
   - LCP < 2.5s
   - FID < 100ms
   - CLS < 0.1

### 暂停升级条件

- "已抓取 - 尚未索引" > 50%
- 出现安全问题报告
- 5xx 错误率 > 5%
- Core Web Vitals 不合格

## 最佳实践

### 内容质量
- ✅ 每篇博客 > 2000 字
- ✅ 关键词密度 2.5-3.5%
- ✅ 独特价值，非采集内容
- ✅ 包含内链 10-15 个

### 链接策略
- ✅ 初期不购买外链
- ✅ 自然获取行业相关链接
- ✅ 内链结构合理

### 技术实现
- ✅ 移动端优先
- ✅ HTTPS 强制
- ✅ Canonical URL 规范
- ✅ hreflang 多语言标记

## 时间线参考

```
Week 1:  Phase 1 - 核心页面 + 博客 (当前)
Week 2:  监控索引情况，确保核心页面被收录
Week 3:  Phase 2 - 添加用户故事
Week 4:  监控新增内容索引情况
Week 5+: 评估是否需要 Phase 3
```

## 相关文档

- [动态Sitemap实现](./DYNAMIC_SITEMAP_IMPLEMENTATION.md)
- [SEO实施状态](./SEO_IMPLEMENTATION_STATUS.md)
- [主题集群策略](./TOPIC_CLUSTER_STRATEGY.md)
