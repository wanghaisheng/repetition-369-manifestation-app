# 预渲染脚本配置指南

## 概述

本项目使用 Puppeteer 进行预渲染，确保搜索引擎能够正确抓取 SPA 页面内容。

## 文件结构

```
scripts/
├── prerender.mjs          # 主预渲染脚本
├── prerender-routes.json  # 路由配置（与 sitemap 同步）
└── generate-sitemap.js    # Sitemap 生成脚本
```

## 路由同步

预渲染路由与以下配置保持同步：
- `src/config/routes.ts` - 应用路由配置
- `supabase/functions/generate-sitemap/index.ts` - 动态 Sitemap 生成
- `scripts/prerender-routes.json` - 预渲染专用配置

## 使用方法

### 完整构建（推荐）

```bash
# 给脚本添加执行权限（首次需要）
chmod +x prerender-build.sh

# 执行完整构建和预渲染
./prerender-build.sh
```

### 仅预渲染（已构建后）

```bash
# 确保已运行 npm run build
node scripts/prerender.mjs
```

### 手动步骤

```bash
# 1. 构建应用
npm run build

# 2. 启动预览服务器（在另一个终端）
npm run preview

# 3. 运行预渲染脚本
node scripts/prerender.mjs
```

## 预渲染页面列表

### 中文页面（默认）
- `/` - 首页
- `/about` - 关于我们
- `/faq` - 常见问题
- `/method369` - 369方法介绍
- `/blog` - 博客列表
- `/user-stories` - 用户故事
- `/privacy` - 隐私政策
- `/terms` - 服务条款

### 英文页面
- `/en` - Home
- `/en/about` - About
- `/en/faq` - FAQ
- `/en/method369` - 369 Method
- `/en/blog` - Blog
- `/en/user-stories` - User Stories
- `/en/privacy` - Privacy
- `/en/terms` - Terms

## 排除页面

以下页面不进行预渲染：
- `/app/*` - 应用内页面（需要认证）
- `/auth` - 认证页面
- `/blog-admin` - 博客管理
- `/admin-stats` - 管理统计

## 配置选项

编辑 `scripts/prerender-routes.json`：

```json
{
  "prerenderConfig": {
    "waitTime": 2000,      // 页面加载等待时间（毫秒）
    "viewport": {
      "width": 1920,
      "height": 1080
    },
    "timeout": 30000       // 超时时间（毫秒）
  }
}
```

## 环境变量

- `PREVIEW_PORT` - 预览服务器端口（默认: 4173）

## 输出结构

```
dist/
├── index.html              # 预渲染的首页
├── en/
│   └── index.html          # 预渲染的英文首页
├── about/
│   └── index.html          # 预渲染的关于页
├── en/
│   ├── about/
│   │   └── index.html
│   ├── faq/
│   │   └── index.html
│   └── ...
├── faq/
│   └── index.html
├── method369/
│   └── index.html
├── blog/
│   └── index.html
├── user-stories/
│   └── index.html
├── privacy/
│   └── index.html
└── terms/
    └── index.html
```

## Hydration

预渲染的页面包含标记 `window.__PRERENDERED__ = true`，用于：
1. 在 React hydration 时识别预渲染内容
2. 避免客户端重新渲染

## 故障排除

### 预渲染失败

**症状**: 页面内容为空或不完整

**解决方法**:
1. 增加 `waitTime` 配置
2. 检查页面是否有异步数据加载
3. 确保预览服务器正常运行

### 端口冲突

**症状**: 预览服务器启动失败

**解决方法**:
```bash
# 使用不同端口
PREVIEW_PORT=4174 node scripts/prerender.mjs
```

### Puppeteer 安装问题

**症状**: Cannot find module 'puppeteer'

**解决方法**:
```bash
npm install puppeteer
```

## 与 CI/CD 集成

### GitHub Actions

```yaml
- name: Build and Prerender
  run: |
    npm ci
    chmod +x prerender-build.sh
    ./prerender-build.sh
```

### Vercel

在项目设置中配置：
- Build Command: `./prerender-build.sh`
- Output Directory: `dist`

### Cloudflare Pages

- Build Command: `./prerender-build.sh`
- Build output directory: `dist`

## 添加新页面

1. 在 `src/config/routes.ts` 添加路由
2. 在 `scripts/prerender-routes.json` 的 `marketingPages` 添加配置
3. 在 `supabase/functions/generate-sitemap/index.ts` 的 `corePages` 添加配置
4. 重新运行预渲染

## 相关文档

- [预渲染指南](./docs/PRERENDERING_GUIDE.md)
- [分阶段 Sitemap 策略](./docs/STAGED_SITEMAP_STRATEGY.md)
- [SEO 实施状态](./docs/SEO_IMPLEMENTATION_STATUS.md)
