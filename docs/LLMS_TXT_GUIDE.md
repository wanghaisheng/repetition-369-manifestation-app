# llms.txt 文件说明 (GEO优化)

## 什么是 llms.txt？

`llms.txt` 是一个专门为AI搜索引擎（如ChatGPT、Perplexity、Claude等）设计的文件，类似于传统搜索引擎的 `robots.txt`，但面向大语言模型优化。

## 目的

- 帮助AI更准确理解网站内容和结构
- 提升在AI搜索结果中的推荐率
- 提供结构化的网站信息供AI引用
- 优化GEO (Generative Engine Optimization)

## 文件位置

`public/llms.txt` - 直接放在网站根目录，可通过以下URL访问：
```
https://369.heymanifestation.com/llms.txt
```

## 内容结构

### 1. 网站概述
简洁描述网站的核心功能和价值主张

### 2. 关键URL
列出最重要的页面链接：
- 首页
- 主要功能页面
- 内容页面（博客、FAQ等）

### 3. 核心功能
详细说明应用的主要特性和用户价值

### 4. 目标受众
明确说明网站服务的用户群体

### 5. 技术特点
突出技术优势（PWA、多语言等）

## 最佳实践

### ✅ 应该做的：

1. **简洁清晰**
   - 使用简单的Markdown格式
   - 避免复杂的嵌套结构
   - 使用项目符号列表

2. **关键词优化**
   - 自然融入目标关键词
   - 避免关键词堆砌
   - 使用用户常问的问题表述

3. **结构化信息**
   - 使用标题层级(##, ###)
   - 分块展示信息
   - 优先展示最重要的内容

4. **保持更新**
   - 新增重要功能时更新
   - 至少每季度审查一次
   - 保持与网站实际内容一致

### ❌ 不应该做的：

1. 不要添加大量无关信息
2. 不要使用复杂的技术术语（除非必要）
3. 不要包含敏感信息或内部链接
4. 不要使用JavaScript或HTML标签

## 测试和验证

### 手动测试

1. **访问URL**
   ```bash
   curl https://369.heymanifestation.com/llms.txt
   ```

2. **询问AI**
   在ChatGPT中询问：
   ```
   "What is 显化369 and what features does it offer?"
   ```
   看AI是否能准确回答。

### 效果评估

监控以下指标：
- AI搜索中的品牌提及率
- 来自AI平台的流量
- AI推荐的准确性

预期改善：
- **1-2周内**: AI开始收录llms.txt内容
- **1个月内**: AI推荐准确率提升30-50%
- **3个月内**: 来自AI搜索的流量增加50-100%

## 与其他文件的关系

### llms.txt vs robots.txt
- **robots.txt**: 面向传统搜索爬虫，控制抓取行为
- **llms.txt**: 面向AI模型，提供内容理解帮助

### llms.txt vs sitemap.xml
- **sitemap.xml**: 提供完整的URL列表
- **llms.txt**: 提供网站的功能和价值说明

### llms.txt vs meta标签
- **meta标签**: 页面级别的SEO优化
- **llms.txt**: 网站级别的AI优化

## 更新频率

### 必须更新的情况：
- 新增重要功能
- 改变核心定位
- URL结构调整
- 新增语言版本

### 建议更新的情况：
- 每季度审查一次
- 重大营销活动前
- 用户反馈发现AI理解偏差

## 行业案例

许多领先的AI优化网站都采用了llms.txt：
- **Stripe**: 清晰描述支付API功能
- **Vercel**: 突出部署平台优势
- **Supabase**: 说明开源替代方案定位

## GEO策略整体

llms.txt是GEO策略的一部分，完整策略包括：

1. **llms.txt** (本文档) ✅
2. **结构化数据** (JSON-LD) ✅ 已实现
3. **语义化HTML** (正确使用h标签) ✅ 已实现
4. **高质量内容** (博客、FAQ) ✅ 已实现
5. **清晰的信息架构** (面包屑、内链) ✅ 已实现

## 参考资源

- [GEO最佳实践](https://www.geo-guide.com/)
- [AI搜索优化指南](https://www.searchengineland.com/ai-search-optimization)
- [llms.txt 规范提案](https://github.com/llms-txt/llms-txt)

## 维护责任

- **SEO团队**: 负责内容审查和更新
- **产品团队**: 提供功能更新信息
- **技术团队**: 确保文件可访问性

## 总结

`llms.txt` 是面向AI时代的SEO优化必备文件，投入少（一次创建）、回报高（持续改善AI推荐），是GEO策略的基础组成部分。

定期维护和优化这个文件，将显著提升网站在AI搜索中的可见性和准确性。
