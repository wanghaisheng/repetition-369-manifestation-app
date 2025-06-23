
# 显化369 设计系统

## 🎨 设计原则

### 核心原则
1. **极简主义**: 减少视觉噪音，专注核心功能
2. **温暖治愈**: 营造积极正面的使用氛围
3. **直觉操作**: 遵循iOS原生交互习惯
4. **情感连接**: 通过设计传达显化的力量

## 🌈 色彩系统

### 主色调
```css
/* 显化金色 - 主要品牌色 */
--manifestation-gold: #FFD700
--manifestation-gold-light: #FFF4B8
--manifestation-gold-dark: #E6C200

/* iOS系统色 */
--ios-blue: #007AFF
--ios-blue-light: #5AC8FA
--ios-blue-dark: #0056CC

/* 温暖渐变 */
--warm-gradient: linear-gradient(135deg, #FFD700, #FFA500, #FF6B6B)
```

### 中性色
```css
/* iOS灰色系统 */
--ios-gray-light: #F2F2F7
--ios-gray-medium: #C7C7CC
--ios-gray: #8E8E93
--ios-gray-dark: #636366
--ios-black: #1C1C1E
```

### 语义化颜色
```css
/* 成功/进步 */
--success-green: #34C759
--success-light: #B8F5C7

/* 警告/提醒 */
--warning-orange: #FF9500
--warning-light: #FFD60A

/* 错误/重要 */
--error-red: #FF3B30
--error-light: #FFEBEA
```

## 📐 空间系统

### 间距标准
```css
/* 基础间距 */
--space-xs: 4px
--space-sm: 8px
--space-md: 16px
--space-lg: 24px
--space-xl: 32px
--space-2xl: 48px

/* 组件间距 */
--component-padding: 16px
--section-margin: 24px
--card-padding: 20px
```

### 安全区域
```css
/* iOS安全区域 */
--safe-top: env(safe-area-inset-top)
--safe-bottom: env(safe-area-inset-bottom)
--safe-left: env(safe-area-inset-left)
--safe-right: env(safe-area-inset-right)
```

## 🔤 字体系统

### 字体家族
```css
/* iOS系统字体 */
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
```

### 字体大小
```css
/* 标题层级 */
--text-xs: 12px
--text-sm: 14px
--text-base: 16px
--text-lg: 18px
--text-xl: 20px
--text-2xl: 24px
--text-3xl: 30px
--text-4xl: 36px

/* 行高 */
--leading-tight: 1.25
--leading-normal: 1.5
--leading-relaxed: 1.75
```

## 🎯 组件规范

### 按钮系统
```typescript
// 主要按钮
interface PrimaryButton {
  background: 'ios-blue' | 'manifestation-gold'
  height: 44px // iOS标准触摸目标
  borderRadius: 8px
  fontSize: 16px
  fontWeight: 600
}

// 次要按钮
interface SecondaryButton {
  background: 'transparent'
  border: '1px solid ios-gray-medium'
  height: 44px
  borderRadius: 8px
}
```

### 卡片系统
```typescript
interface Card {
  background: 'white'
  borderRadius: 12px
  padding: 20px
  shadow: '0 2px 10px rgba(0,0,0,0.1)'
  border: 'none'
}
```

### 输入框系统
```typescript
interface Input {
  height: 44px
  borderRadius: 8px
  border: '1px solid ios-gray-medium'
  padding: '12px 16px'
  fontSize: 16px
  background: 'white'
}
```

## 🎭 动画系统

### 缓动函数
```css
/* iOS原生缓动 */
--ease-ios: cubic-bezier(0.25, 0.46, 0.45, 0.94)
--ease-in-ios: cubic-bezier(0.42, 0, 1, 1)
--ease-out-ios: cubic-bezier(0, 0, 0.58, 1)

/* 自定义缓动 */
--ease-manifestation: cubic-bezier(0.34, 1.56, 0.64, 1)
```

### 动画时长
```css
--duration-fast: 150ms
--duration-normal: 250ms
--duration-slow: 350ms
--duration-page: 500ms
```

## 🔊 音效系统

### 系统反馈音
- 成功完成: iOS Success Sound
- 按钮点击: iOS Click Sound
- 错误提示: iOS Error Sound
- 新消息: iOS Message Sound

## 📱 响应式断点

```css
/* 移动设备优先 */
--mobile: 320px
--mobile-lg: 375px
--tablet: 768px
--desktop: 1024px
```

## ♿ 无障碍设计

### 对比度要求
- 普通文本: 至少4.5:1
- 大文本: 至少3:1
- UI组件: 至少3:1

### 触摸目标
- 最小尺寸: 44x44px (iOS标准)
- 推荐间距: 8px

### 语义化HTML
- 使用正确的HTML标签
- 提供alt文本
- 支持键盘导航
- 屏幕阅读器友好

## 🌟 显化主题特色

### 视觉隐喻
- 金色光芒效果
- 渐变光晕
- 粒子动画
- 呼吸式动画

### 情感化设计
- 温暖的配色
- 柔和的阴影
- 流畅的过渡
- 正能量的图标

这个设计系统确保了应用的一致性和iOS原生体验感。
