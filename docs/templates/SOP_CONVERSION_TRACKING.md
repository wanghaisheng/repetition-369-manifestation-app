# SOP：转化追踪标准操作流程

## 📋 概述

| 项目 | 说明 |
|------|------|
| 目的 | 建立完整的转化追踪体系，实现 SEO ROI 可量化 |
| 核心链路 | 关键词 → 流量 → 转化 |
| 执行频率 | 每日监控 / 周度分析 / 月度报告 |
| 工具 | Google Analytics 4 + GSC + 自定义事件 |

---

## 🎯 转化漏斗模型

### SEO 获客漏斗

```
┌─────────────────────────────────────────────────────┐
│  Keyword Ranking  关键词排名                         │
│  ↓                                                  │
│  Impressions  展示量                                │
│  ↓                                                  │
│  Clicks  点击量                                     │
│  ↓                                                  │
│  Visitors  访问者                                   │
│  ↓                                                  │
│  Engagement  参与（停留时间、页面浏览）              │
│  ↓                                                  │
│  Registration  注册                                 │
│  ↓                                                  │
│  Free Trial  免费试用                               │
│  ↓                                                  │
│  Paid Conversion  付费转化                          │
└─────────────────────────────────────────────────────┘
```

### 核心问题

> **关键思考**：Ranking 的提升给 Paid 带来的提升是多少？算清楚了才做得清楚。

---

## 📊 转化事件定义

### 关键转化事件

| 事件名称 | 事件类型 | 触发条件 | 价值 |
|---------|---------|---------|------|
| page_view | 自动 | 页面加载 | - |
| scroll_depth_50 | 自定义 | 滚动到页面 50% | - |
| scroll_depth_90 | 自定义 | 滚动到页面 90% | - |
| cta_click | 自定义 | 点击 CTA 按钮 | - |
| signup_start | 自定义 | 开始注册流程 | - |
| signup_complete | 转化 | 完成注册 | ¥10 |
| first_practice | 转化 | 完成首次练习 | ¥20 |
| day_3_retention | 转化 | 3日留存 | ¥30 |
| day_7_retention | 转化 | 7日留存 | ¥50 |
| premium_purchase | 转化 | 付费购买 | 实际金额 |

### 事件追踪代码

```typescript
// src/services/AnalyticsService.ts

export class AnalyticsService {
  // CTA 点击追踪
  static trackCTAClick(ctaName: string, ctaLocation: string) {
    if (typeof gtag !== 'undefined') {
      gtag('event', 'cta_click', {
        cta_name: ctaName,
        cta_location: ctaLocation,
        page_path: window.location.pathname,
      });
    }
  }

  // 注册开始
  static trackSignupStart(source: string) {
    if (typeof gtag !== 'undefined') {
      gtag('event', 'signup_start', {
        source: source,
        page_path: window.location.pathname,
      });
    }
  }

  // 注册完成
  static trackSignupComplete(method: string) {
    if (typeof gtag !== 'undefined') {
      gtag('event', 'signup_complete', {
        method: method,
        value: 10,
        currency: 'CNY',
      });
    }
  }

  // 首次练习
  static trackFirstPractice() {
    if (typeof gtag !== 'undefined') {
      gtag('event', 'first_practice', {
        value: 20,
        currency: 'CNY',
      });
    }
  }

  // 付费转化
  static trackPurchase(value: number, planName: string) {
    if (typeof gtag !== 'undefined') {
      gtag('event', 'purchase', {
        value: value,
        currency: 'CNY',
        items: [{
          item_name: planName,
        }],
      });
    }
  }
}
```

---

## 🔗 页面级 CTA 规范

### CTA 布局标准

```
┌──────────────────────────────────────────────────┐
│  HERO SECTION                                    │
│  ┌────────────────────────────────────────────┐  │
│  │  主 CTA: 立即开始免费试用                    │  │
│  │  [位置: 首屏, 醒目, 大按钮]                  │  │
│  └────────────────────────────────────────────┘  │
├──────────────────────────────────────────────────┤
│  CONTENT SECTION                                 │
│  ┌────────────────────────────────────────────┐  │
│  │  辅助 CTA: 下载指南 / 订阅邮件               │  │
│  │  [位置: 内容中部, 与内容相关]                │  │
│  └────────────────────────────────────────────┘  │
├──────────────────────────────────────────────────┤
│  FOOTER SECTION                                  │
│  ┌────────────────────────────────────────────┐  │
│  │  结尾 CTA: 开始你的显化之旅                  │  │
│  │  [位置: 页面底部, 收尾行动号召]              │  │
│  └────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────┘
```

### 页面类型 CTA 配置

| 页面类型 | 主 CTA | 辅助 CTA | 结尾 CTA |
|---------|--------|---------|---------|
| 首页 | 免费开始 | 查看功能 | 立即注册 |
| 产品页 | 免费试用 | 查看定价 | 开始使用 |
| 博客文章 | 相关功能 | 订阅更新 | 免费试用 |
| 对比页 | 选择我们 | 功能对比表 | 立即切换 |
| 用例页 | 开始试用 | 查看案例 | 联系我们 |

### CTA 组件实现

```tsx
// src/components/landing/ConversionOptimizedCTA.tsx
interface CTAProps {
  variant: 'primary' | 'secondary' | 'footer';
  text: string;
  href: string;
  trackingName: string;
  trackingLocation: string;
}

export const ConversionCTA = ({ 
  variant, 
  text, 
  href, 
  trackingName,
  trackingLocation 
}: CTAProps) => {
  const handleClick = () => {
    AnalyticsService.trackCTAClick(trackingName, trackingLocation);
  };

  return (
    <Button
      variant={variant}
      onClick={handleClick}
      asChild
    >
      <Link to={href}>{text}</Link>
    </Button>
  );
};
```

---

## 📈 归因分析

### 来源追踪

```typescript
// 记录用户首次来源
const trackFirstTouch = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const source = urlParams.get('utm_source');
  const medium = urlParams.get('utm_medium');
  const campaign = urlParams.get('utm_campaign');
  
  if (!localStorage.getItem('first_touch')) {
    localStorage.setItem('first_touch', JSON.stringify({
      source: source || 'organic',
      medium: medium || 'organic',
      campaign: campaign || 'none',
      landing_page: window.location.pathname,
      timestamp: new Date().toISOString(),
    }));
  }
};
```

### 多触点归因

| 归因模型 | 说明 | 适用场景 |
|---------|------|---------|
| 首次触点 | 100% 归因给首次接触渠道 | 品牌认知分析 |
| 最终触点 | 100% 归因给最后一次接触 | 转化渠道分析 |
| 线性归因 | 平均分配给所有触点 | 综合分析 |
| 时间衰减 | 越近的触点权重越高 | 短周期产品 |

---

## 📊 报告模板

### 周度转化报告

```markdown
# 周度转化报告 - W[XX]

## 漏斗概览
| 阶段 | 本周 | 上周 | 变化 | 转化率 |
|------|------|------|------|--------|
| 展示量 | | | | - |
| 点击量 | | | | % |
| 注册开始 | | | | % |
| 注册完成 | | | | % |
| 首次练习 | | | | % |
| 7日留存 | | | | % |

## Top 5 转化来源
| 来源页面 | 访问量 | 注册数 | 转化率 |
|---------|--------|--------|--------|
| | | | |

## Top 5 CTA 表现
| CTA 名称 | 位置 | 点击量 | 转化数 | 转化率 |
|---------|------|--------|--------|--------|
| | | | | |

## 问题诊断
- 漏斗瓶颈：[阶段] - [问题描述]
- 优化建议：[建议]

## 下周实验
| 实验名称 | 假设 | 指标 | 预期提升 |
|---------|------|------|---------|
| | | | |
```

### 月度 SEO ROI 报告

```markdown
# 月度 SEO ROI 报告 - [月份]

## 投入
| 项目 | 成本 |
|------|------|
| 内容生产 | ¥ |
| 外链建设 | ¥ |
| 工具订阅 | ¥ |
| 人力成本 | ¥ |
| **总投入** | **¥** |

## 产出
| 指标 | 数值 | 价值 |
|------|------|------|
| 自然流量 | | - |
| 注册用户 | | ¥ (×¥10) |
| 付费用户 | | ¥ (实际收入) |
| **总产出** | | **¥** |

## ROI 计算
- ROI = (总产出 - 总投入) / 总投入 × 100%
- 本月 ROI = ___%

## 关键词 → 转化 归因
| 关键词 | 排名 | 点击 | 注册 | 付费 | 收入 |
|--------|------|------|------|------|------|
| | | | | | |

## 下月目标
| 指标 | 本月实际 | 下月目标 | 增长 % |
|------|---------|---------|--------|
| 自然流量 | | | |
| 注册转化 | | | |
| 付费转化 | | | |
```

---

## 🧪 A/B 测试框架

### CTA 测试计划

```markdown
# CTA A/B 测试计划

## 测试信息
- 测试名称：[名称]
- 测试页面：[URL]
- 测试时间：[开始] - [结束]
- 流量分配：50% / 50%

## 变体
| 变体 | CTA 文案 | CTA 颜色 | CTA 位置 |
|------|---------|---------|---------|
| A (控制组) | | | |
| B (实验组) | | | |

## 假设
如果 [改变]，那么 [预期结果]，因为 [原因]。

## 主要指标
- 主要指标：CTA 点击率
- 次要指标：注册完成率

## 结果
| 变体 | 访问量 | CTA 点击 | 点击率 | 注册 | 注册率 |
|------|--------|---------|--------|------|--------|
| A | | | | | |
| B | | | | | |

## 统计显著性
- p 值：
- 置信度：
- 推荐决策：

## 后续行动
[根据结果确定下一步]
```

---

## 🛠️ 工具配置

### Google Analytics 4 配置清单

- [ ] 创建 GA4 属性
- [ ] 安装追踪代码
- [ ] 配置转化事件
- [ ] 设置转化价值
- [ ] 连接 GSC
- [ ] 设置自定义维度
- [ ] 创建自定义报告
- [ ] 设置告警

### 事件命名规范

```
格式：[类别]_[动作]
示例：
- cta_click
- signup_start
- signup_complete
- practice_complete
- purchase_complete
```
