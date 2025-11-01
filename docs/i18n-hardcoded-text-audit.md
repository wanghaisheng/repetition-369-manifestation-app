# 国际化与生产环境代码审查报告

生成时间: 2025-11-01

## 🔴 严重问题

### 1. 硬编码的中文文本（已修复部分）

#### ✅ 已修复
- `WishSelector.tsx` - 已国际化
- `EmptyState.tsx` - 已国际化
- `NotificationCenter.tsx` - 部分国际化
- `AnalyticsDashboard.tsx` - 部分国际化

#### ⚠️ 需要修复
- `SettingsPanel.tsx` - 所有UI文本都是硬编码中文
- `AddWishModal.tsx` - 所有UI文本都是硬编码中文
- `AdvancedPracticeModal.tsx` - 多处硬编码
- `WritingInterface.tsx` - 心情选择等
- `ShareModal.tsx` - 按钮文本
- `PracticeWritingModal.tsx` - 按钮文本
- `NotificationCenter.tsx` - 还有标题和设置项
- `AnalyticsDashboard.tsx` - 大量图表和分析文本

### 2. 不一致的国际化实现

以下文件使用条件判断而非 t() 函数：
- `BlogEditor.tsx`
- `BlogManagement.tsx`
- `Blog.tsx`
- `UserStories.tsx`
- `ConversionOptimizedCTA.tsx`

示例问题代码：
```tsx
// ❌ 不推荐
{i18n.language === 'zh' ? '中文' : 'English'}

// ✅ 推荐
{t('key')}
```

### 3. 生产环境不当代码

#### 原生对话框
- `SettingsPanel.tsx` line 35: `confirm('确定要清除...')`
- `BlogManagement.tsx` line 111: `confirm('确定要删除...')`

应使用 shadcn AlertDialog 组件

#### Console语句
大量文件包含 console.log/error，需要条件化或移除：
- `AuthContext.tsx` - 调试日志
- `AnalyticsDashboard.tsx` - 错误日志
- `BlogManagement.tsx` - 错误日志
- `NotFound.tsx` - 错误记录

## 🟡 次要问题

### 开发者占位符
- Analytics 配置中的 "XXXXXXXXXX" 占位符（可保留，用于验证）

### 硬编码的分类名称
- `AddWishModal.tsx` - categories 数组中的中文名称

### 硬编码的模板文本
- `AddWishModal.tsx` - generateAffirmation 中的肯定句模板

## 📋 修复优先级

### P0 - 立即修复（影响用户体验）
1. ✅ WishSelector.tsx 
2. ✅ EmptyState.tsx
3. ✅ NotificationCenter.tsx (部分)
4. ⚠️ AddWishModal.tsx
5. ⚠️ SettingsPanel.tsx
6. ⚠️ AdvancedPracticeModal.tsx

### P1 - 高优先级（下一迭代）
1. AnalyticsDashboard.tsx - 完整国际化
2. NotificationCenter.tsx - 完成剩余部分
3. ShareModal.tsx
4. WritingInterface.tsx

### P2 - 中优先级
1. 统一所有条件判断为 t() 函数
2. 替换 confirm() 为 AlertDialog
3. 条件化 console 语句

### P3 - 低优先级
1. 移除或条件化调试代码
2. 优化开发者注释

## 📝 i18n 资源更新状态

### ✅ 已添加的翻译键
- `app.wishSelector.*`
- `app.emptyState.*`
- `app.notifications.empty`
- `app.analytics.empty`
- `app.settings.*` (部分)
- `app.modal.*` (部分)
- `app.advancedPractice.*`

### ⚠️ 需要添加的翻译键

#### settings 命名空间
```json
{
  "settings": {
    "title": "应用设置",
    "notifications": "通知",
    "performance": "性能",
    "privacy": "隐私",
    "about": "关于",
    "performanceMode": "性能模式",
    "performanceModeDesc": "启用后将减少动画效果，提升应用响应速度",
    "checkMemory": "检查内存",
    "dataPrivacy": "数据和隐私",
    "localDataDesc": "您的愿望、练习记录和设置都存储在本地设备上，我们不会收集您的个人数据。",
    "aboutApp": "关于显化369",
    "version": "版本",
    "techStack": "技术栈"
  }
}
```

#### modal 命名空间扩展
```json
{
  "modal": {
    "addWish": "添加新愿望",
    "wishTitle": "愿望标题",
    "wishTitlePlaceholder": "例如：获得理想工作",
    "generateAffirmation": "生成肯定句",
    "customAffirmation": "自定义肯定句",
    "or": "或者",
    "nextStep": "下一步",
    "previousStep": "返回上一步",
    "creating": "创建中…",
    "createWish": "创建愿望",
    "modifyAffirmation": "修改肯定句"
  }
}
```

## 🎯 建议的架构改进

1. **创建专门的 Dialog 组件**
   - 替换所有原生 confirm/alert
   - 使用 shadcn AlertDialog

2. **创建统一的日志工具**
   ```tsx
   // utils/logger.ts
   export const logger = {
     log: (msg: string, data?: any) => {
       if (process.env.NODE_ENV === 'development') {
         console.log(msg, data);
       }
     },
     error: (msg: string, error?: any) => {
       console.error(msg, error);
       // 可以集成错误追踪服务
     }
   };
   ```

3. **i18n 命名空间重组**
   - `app` - 应用核心功能
   - `common` - 通用文本
   - `landing` - 落地页
   - `marketing` - 营销内容
   - `settings` - 设置相关
   - `analytics` - 分析相关

## ✅ 下一步行动

1. 更新 i18n 资源文件（添加缺失的键）
2. 修复 P0 优先级的组件
3. 创建统一的确认对话框组件
4. 测试所有国际化功能
5. 更新文档
