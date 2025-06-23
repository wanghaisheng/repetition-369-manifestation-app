
# 部署指南

## 🚀 项目部署文档

### 📋 部署前检查清单

#### 代码质量检查
- [ ] 所有TypeScript错误已修复
- [ ] ESLint检查通过
- [ ] 所有测试用例通过
- [ ] 代码已经过code review

#### 性能优化
- [ ] 图片资源已压缩优化
- [ ] 代码已进行tree shaking
- [ ] 懒加载已实现
- [ ] Bundle大小在合理范围内

#### PWA就绪检查
- [ ] manifest.json配置完整
- [ ] Service Worker注册成功
- [ ] 离线功能测试通过
- [ ] 图标文件齐全

## 🛠️ 本地开发环境

### 环境要求
```bash
Node.js >= 16.0.0
npm >= 8.0.0
Git >= 2.20.0
```

### 快速开始
```bash
# 克隆项目
git clone [repository-url]
cd xianghua369

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview
```

## 🌐 Lovable平台部署

### 自动部署
- Lovable平台支持自动构建和部署
- 每次代码提交会触发自动构建
- 构建成功后自动发布到staging环境

### 发布到生产环境
1. 在Lovable编辑器中点击"Publish"按钮
2. 选择发布域名（支持自定义域名）
3. 确认发布配置
4. 等待部署完成

## 📱 PWA部署配置

### Manifest配置
```json
{
  "name": "显化369 - 愿望成真的神奇力量",
  "short_name": "显化369",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#F2F2F7",
  "theme_color": "#007AFF",
  "orientation": "portrait"
}
```

### Service Worker
```javascript
// 缓存策略配置
const CACHE_NAME = 'xianghua369-v1.0.0'
const STATIC_ASSETS = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json'
]
```

## 🔧 环境变量配置

### 开发环境 (.env.development)
```bash
VITE_APP_NAME=显化369
VITE_APP_VERSION=1.0.0
VITE_APP_ENV=development
VITE_ENABLE_ANALYTICS=false
```

### 生产环境 (.env.production)
```bash
VITE_APP_NAME=显化369
VITE_APP_VERSION=1.0.0
VITE_APP_ENV=production
VITE_ENABLE_ANALYTICS=true
VITE_API_BASE_URL=https://api.xianghua369.com
```

## 📊 性能监控

### Core Web Vitals目标
- **LCP (Largest Contentful Paint)**: < 2.5s
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1

### 监控工具
- Google Analytics 4
- Google PageSpeed Insights
- Lighthouse CI
- Web Vitals库

## 🛡️ 安全配置

### HTTPS配置
- 强制使用HTTPS
- HSTS header配置
- 安全cookies设置

### CSP (Content Security Policy)
```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' 'unsafe-inline'; 
               style-src 'self' 'unsafe-inline';">
```

## 📈 CDN配置

### 静态资源CDN
- 图片资源使用CDN加速
- 字体文件CDN优化
- CSS/JS文件压缩和缓存

### 全球加速
- 多地域部署
- 智能DNS解析
- 边缘缓存策略

## 🔄 CI/CD流程

### GitHub Actions配置
```yaml
name: Deploy to Production
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '16'
      - name: Install dependencies
        run: npm ci
      - name: Build project
        run: npm run build
      - name: Deploy to Lovable
        run: npm run deploy
```

## 📱 移动端优化

### iOS Safari优化
- viewport meta tag配置
- 状态栏样式设置
- 安全区域适配
- 触摸反馈优化

### Android Chrome优化
- PWA安装提示
- 全屏模式支持
- 手势导航适配

## 🚨 错误监控

### 错误追踪
- 前端错误自动捕获
- 用户行为回放
- 性能异常监控
- 崩溃报告分析

### 日志收集
```javascript
// 错误处理示例
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error)
  // 发送错误报告到监控服务
})
```

## 🔧 维护指南

### 定期维护任务
- [ ] 依赖包安全更新
- [ ] 性能监控数据分析
- [ ] 用户反馈处理
- [ ] 功能使用数据分析

### 备份策略
- 代码仓库定期备份
- 用户数据备份方案
- 配置文件版本控制
- 数据库迁移脚本

## 📞 技术支持

### 故障排除
1. 检查控制台错误信息
2. 验证网络连接状态
3. 清除浏览器缓存
4. 检查Service Worker状态

### 联系方式
- 技术支持邮箱: support@xianghua369.com
- 紧急联系电话: [待填写]
- 在线文档: https://docs.xianghua369.com

部署流程已经优化为自动化，确保快速、安全、可靠的发布流程。
