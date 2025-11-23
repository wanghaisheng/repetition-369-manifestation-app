# 预渲染配置指南 (Prerendering Guide)

## 概述

本项目使用 react-snap 实现关键页面的预渲染（SSR），以优化搜索引擎爬虫抓取和提升SEO效果。

## 为什么需要预渲染？

- **SEO优化**: 搜索引擎爬虫可以直接获取完整的HTML内容，而不是空白页面
- **首屏加载**: 用户首次访问时可以立即看到内容，提升用户体验
- **社交分享**: 社交媒体平台能正确抓取页面元数据和预览图
- **性能提升**: 减少客户端JavaScript执行时间

## 已配置的预渲染页面

以下页面会在构建时被预渲染：

- `/` - 首页
- `/about` - 关于我们
- `/faq` - 常见问题
- `/method369` - 369方法介绍
- `/blog` - 博客列表
- `/user-stories` - 用户故事
- `/privacy` - 隐私政策
- `/terms` - 服务条款

## 配置文件

### `react-snap.config.js`

主配置文件，包含：
- 预渲染页面列表
- HTML压缩选项
- Puppeteer配置
- 排除规则（如需认证的页面）

### `prerender-build.sh`

构建脚本，执行以下步骤：
1. 运行 `npm run build` 构建应用
2. 运行 `react-snap` 预渲染页面
3. 生成预渲染后的HTML文件

## 使用方法

### 本地构建并预渲染

```bash
# 给脚本添加执行权限（首次需要）
chmod +x prerender-build.sh

# 执行预渲染构建
./prerender-build.sh
```

### 手动步骤

```bash
# 1. 构建应用
npm run build

# 2. 运行预渲染
npx react-snap
```

### 查看预渲染结果

构建完成后，在 `dist/` 目录中会生成预渲染的HTML文件：

```
dist/
├── index.html          (预渲染的首页)
├── about/
│   └── index.html      (预渲染的关于页)
├── faq/
│   └── index.html      (预渲染的FAQ页)
└── ...
```

## 部署注意事项

### Vite构建配置

确保 `vite.config.ts` 已配置正确的base URL和构建选项。

### Vercel/Netlify部署

这些平台会自动运行 `npm run build`，但不会自动运行react-snap。需要：

**方案1: 修改构建命令**
```json
{
  "scripts": {
    "build": "vite build && react-snap"
  }
}
```

**方案2: 使用自定义构建脚本**
在部署设置中将构建命令改为：
```bash
./prerender-build.sh
```

### Cloudflare Pages

在项目设置中配置：
- Build command: `./prerender-build.sh`
- Build output directory: `dist`

## 常见问题

### Q1: 为什么某些页面不预渲染？

**A**: 以下类型的页面不应该预渲染：
- 需要认证的页面（如 `/app/*`, `/admin/*`）
- 动态路由（如 `/blog/[slug]`）
- 包含用户特定数据的页面

这些页面已在 `react-snap.config.js` 的 `exclude` 中配置。

### Q2: 预渲染后页面样式错乱怎么办？

**A**: 检查以下几点：
1. 确保CSS在预渲染时已加载（`inlineCss: true`）
2. 检查是否有依赖window对象的代码在SSR时执行
3. 增加 `waitFor` 时间，让页面完全加载

### Q3: 如何验证预渲染是否成功？

**A**: 
1. 查看 `dist/` 目录中的HTML文件
2. 在浏览器中禁用JavaScript，访问页面
3. 使用 `curl` 或 `wget` 获取页面内容：
   ```bash
   curl https://369.heymanifestation.com/ | grep "<h1"
   ```

### Q4: 预渲染会影响开发环境吗？

**A**: 不会。react-snap只在构建时运行，开发环境（`npm run dev`）不受影响。

## 技术细节

### Hydration

应用使用React的 `hydrateRoot` API来"激活"预渲染的HTML：

```typescript
// src/main.tsx
if (rootElement.hasChildNodes()) {
  hydrateRoot(rootElement, <App />);  // 激活预渲染内容
} else {
  createRoot(rootElement).render(<App />);  // 常规渲染
}
```

### 性能指标

预渲染后的预期改善：
- **首次内容绘制(FCP)**: 减少40-60%
- **最大内容绘制(LCP)**: 减少30-50%
- **Google索引速度**: 提升30-50%
- **搜索排名**: 1-2个月内提升10-20位

## 添加新页面到预渲染

如果创建了新的公开页面需要预渲染：

1. 编辑 `react-snap.config.js`
2. 在 `include` 数组中添加路径：
   ```javascript
   include: [
     "/",
     "/about",
     "/new-page",  // 新页面
     // ...
   ]
   ```
3. 重新构建

## 监控和维护

### 定期检查

- 每月检查一次预渲染页面的SEO效果
- 使用Google Search Console查看索引状态
- 监控Core Web Vitals指标

### 更新策略

- 内容更新后重新部署（触发预渲染）
- 博客文章无需预渲染（动态内容）
- 重要页面（Landing, About等）优先预渲染

## 相关文档

- [react-snap 官方文档](https://github.com/stereobooster/react-snap)
- [React Hydration 文档](https://react.dev/reference/react-dom/client/hydrateRoot)
- [SEO优化总览](./SEO_IMPLEMENTATION_STATUS.md)
