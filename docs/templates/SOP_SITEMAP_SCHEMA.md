# SOP：Sitemap 与 Schema 标记标准操作流程

## 📋 概述

| 项目 | 说明 |
|------|------|
| 目的 | 确保搜索引擎正确抓取和理解网站内容 |
| 核心组件 | XML Sitemap + robots.txt + Schema 结构化数据 |
| 执行频率 | 新内容发布自动更新 / 月度审计 |
| 验证工具 | GSC, Rich Results Test, Schema Validator |

---

## 🗺️ XML Sitemap 规范

### Sitemap 结构

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <loc>https://369.heymanifestation.com/</loc>
    <lastmod>2024-01-15</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
    <!-- 多语言 hreflang -->
    <xhtml:link rel="alternate" hreflang="zh" href="https://369.heymanifestation.com/" />
    <xhtml:link rel="alternate" hreflang="en" href="https://369.heymanifestation.com/en/" />
    <xhtml:link rel="alternate" hreflang="x-default" href="https://369.heymanifestation.com/" />
  </url>
</urlset>
```

### 页面优先级配置

| 页面类型 | Priority | Changefreq | 说明 |
|---------|----------|------------|------|
| 首页 | 1.0 | daily | 最高优先级 |
| 核心功能页 | 0.9 | weekly | 产品核心页面 |
| 博客文章 | 0.8 | monthly | 内容页面 |
| 用户故事 | 0.7 | monthly | UGC 内容 |
| About/FAQ | 0.6 | monthly | 静态信息页 |
| 法律页面 | 0.3 | yearly | 很少更新 |

### 动态 Sitemap 生成

```typescript
// supabase/functions/generate-sitemap/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Content-Type': 'application/xml',
};

serve(async (req) => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );

  // 静态页面
  const staticPages = [
    { url: '/', priority: 1.0, changefreq: 'daily' },
    { url: '/method369', priority: 0.9, changefreq: 'weekly' },
    { url: '/about', priority: 0.6, changefreq: 'monthly' },
    { url: '/faq', priority: 0.6, changefreq: 'monthly' },
    { url: '/blog', priority: 0.8, changefreq: 'daily' },
    { url: '/user-stories', priority: 0.7, changefreq: 'weekly' },
  ];

  // 动态博客文章
  const { data: posts } = await supabase
    .from('blog_posts')
    .select('slug, updated_at, language')
    .eq('published', true);

  const blogUrls = posts?.map(post => ({
    url: `/blog/${post.slug}`,
    priority: 0.8,
    changefreq: 'monthly',
    lastmod: post.updated_at,
    language: post.language
  })) || [];

  // 生成 XML
  const sitemap = generateSitemapXML([...staticPages, ...blogUrls]);
  
  return new Response(sitemap, { headers: corsHeaders });
});
```

### Sitemap 提交清单

- [ ] Sitemap 已生成并可访问
- [ ] Sitemap URL 已添加到 robots.txt
- [ ] Sitemap 已提交到 Google Search Console
- [ ] Sitemap 已提交到 Bing Webmaster Tools
- [ ] 验证 Sitemap 无错误
- [ ] 设置 Sitemap 自动更新

---

## 🤖 robots.txt 规范

### 标准配置

```txt
# 显化369 robots.txt

User-agent: *
Allow: /

# 禁止访问敏感区域
Disallow: /admin/
Disallow: /api/
Disallow: /app/
Disallow: /.env*
Disallow: /node_modules/
Disallow: /src/

# 允许静态资源
Allow: /assets/
Allow: /*.css
Allow: /*.js
Allow: /*.jpg
Allow: /*.png
Allow: /*.webp
Allow: /*.svg

# 主要爬虫配置
User-agent: Googlebot
Allow: /
Crawl-delay: 1

User-agent: Bingbot
Allow: /
Crawl-delay: 1

# 社交媒体爬虫
User-agent: Twitterbot
Allow: /

User-agent: facebookexternalhit
Allow: /

User-agent: LinkedInBot
Allow: /

# Sitemap 位置
Sitemap: https://369.heymanifestation.com/sitemap.xml
```

---

## 📊 Schema 结构化数据

### 已部署的 Schema 类型

| Schema 类型 | 适用页面 | 优先级 |
|------------|---------|--------|
| SoftwareApplication | 首页、产品页 | 高 |
| Article/BlogPosting | 博客文章 | 高 |
| FAQPage | FAQ 页面 | 高 |
| HowTo | 教程页面 | 中 |
| Organization | 全站 | 中 |
| BreadcrumbList | 所有页面 | 中 |
| WebSite | 首页 | 低 |

### SoftwareApplication Schema

```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "显化369",
  "description": "基于尼古拉·特斯拉369法则的科学显化应用",
  "applicationCategory": "LifestyleApplication",
  "operatingSystem": "Web, iOS, Android",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "ratingCount": "1250"
  },
  "author": {
    "@type": "Organization",
    "name": "显化369团队"
  }
}
```

### Article Schema

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "文章标题",
  "description": "文章描述",
  "image": "https://369.heymanifestation.com/images/article.jpg",
  "author": {
    "@type": "Person",
    "name": "作者名"
  },
  "publisher": {
    "@type": "Organization",
    "name": "显化369",
    "logo": {
      "@type": "ImageObject",
      "url": "https://369.heymanifestation.com/logo.png"
    }
  },
  "datePublished": "2024-01-15",
  "dateModified": "2024-01-20"
}
```

### FAQPage Schema

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "什么是369显化法？",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "369显化法是一种基于尼古拉·特斯拉数字理论的愿望实现方法..."
      }
    }
  ]
}
```

### BreadcrumbList Schema

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "首页",
      "item": "https://369.heymanifestation.com/"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "博客",
      "item": "https://369.heymanifestation.com/blog"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "369法则起源",
      "item": "https://369.heymanifestation.com/blog/369-origin"
    }
  ]
}
```

---

## 🛠️ Schema 实现代码

### React 组件示例

```tsx
// src/components/seo/StructuredData.tsx
import { Helmet } from 'react-helmet-async';

interface ArticleSchemaProps {
  title: string;
  description: string;
  image: string;
  author: string;
  datePublished: string;
  dateModified: string;
}

export const ArticleSchema = ({
  title,
  description,
  image,
  author,
  datePublished,
  dateModified
}: ArticleSchemaProps) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": title,
    "description": description,
    "image": image,
    "author": {
      "@type": "Person",
      "name": author
    },
    "publisher": {
      "@type": "Organization",
      "name": "显化369",
      "logo": {
        "@type": "ImageObject",
        "url": "https://369.heymanifestation.com/logo.png"
      }
    },
    "datePublished": datePublished,
    "dateModified": dateModified
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
};
```

---

## ✅ 验证清单

### Sitemap 验证

- [ ] Sitemap 格式正确（XML 有效）
- [ ] 所有 URL 可访问（无 404）
- [ ] lastmod 日期准确
- [ ] hreflang 标签正确
- [ ] 已在 GSC 提交并无错误
- [ ] 动态内容正确更新

### Schema 验证

- [ ] 使用 Google Rich Results Test 验证
- [ ] 使用 Schema.org Validator 验证
- [ ] 无错误和警告
- [ ] 在 GSC 增强功能中显示正常
- [ ] 社交预览正确显示

---

## 📝 交付模板

### Schema 部署检查表

| 页面 | Schema 类型 | 状态 | 验证结果 | 备注 |
|------|------------|------|---------|------|
| / | SoftwareApplication, Organization | ✅ | 通过 | |
| /method369 | HowTo, Article | ✅ | 通过 | |
| /faq | FAQPage | ✅ | 通过 | |
| /blog | Article | ✅ | 通过 | |
| /blog/:slug | Article, BreadcrumbList | ✅ | 通过 | |
| /about | Organization | ✅ | 通过 | |
