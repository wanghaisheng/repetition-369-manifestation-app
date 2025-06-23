
# API设计文档

## 📋 概述

显化369应用采用前端为主的架构，数据主要存储在本地，未来可扩展为云端同步。

## 💾 数据模型

### 用户模型 (User)
```typescript
interface User {
  id: string
  name: string
  avatar?: string
  createdAt: Date
  preferences: UserPreferences
}

interface UserPreferences {
  theme: 'light' | 'dark' | 'auto'
  notifications: NotificationSettings
  reminderTimes: ReminderTime[]
  defaultCategory: WishCategory
}
```

### 愿望模型 (Wish)
```typescript
interface Wish {
  id: string
  userId: string
  title: string
  description: string
  category: WishCategory
  status: WishStatus
  priority: Priority
  affirmation: string
  createdAt: Date
  updatedAt: Date
  targetDate?: Date
  achievedAt?: Date
  tags: string[]
}

type WishCategory = 'career' | 'health' | 'relationship' | 'wealth' | 'personal' | 'other'
type WishStatus = 'active' | 'achieved' | 'paused' | 'archived'
type Priority = 'high' | 'medium' | 'low'
```

### 练习记录模型 (PracticeSession)
```typescript
interface PracticeSession {
  id: string
  userId: string
  wishId: string
  date: Date
  timeSlot: TimeSlot
  completedCount: number
  targetCount: number
  duration: number // 秒
  affirmationText: string
  mood?: Mood
  notes?: string
}

type TimeSlot = 'morning' | 'afternoon' | 'evening'
type Mood = 'excellent' | 'good' | 'neutral' | 'poor'
```

### 进度统计模型 (Progress)
```typescript
interface Progress {
  userId: string
  totalSessions: number
  consecutiveDays: number
  longestStreak: number
  totalWishes: number
  achievedWishes: number
  lastPracticeDate: Date
  weeklyStats: WeeklyStats[]
  monthlyStats: MonthlyStats[]
}

interface WeeklyStats {
  weekStart: Date
  sessionsCompleted: number
  targetSessions: number
  averageMood: number
}
```

## 🔧 本地存储API

### 愿望管理
```typescript
class WishService {
  // 创建愿望
  async createWish(wish: Omit<Wish, 'id' | 'createdAt' | 'updatedAt'>): Promise<Wish>
  
  // 获取所有愿望
  async getWishes(userId: string): Promise<Wish[]>
  
  // 获取单个愿望
  async getWish(wishId: string): Promise<Wish | null>
  
  // 更新愿望
  async updateWish(wishId: string, updates: Partial<Wish>): Promise<Wish>
  
  // 删除愿望
  async deleteWish(wishId: string): Promise<void>
  
  // 按分类获取愿望
  async getWishesByCategory(userId: string, category: WishCategory): Promise<Wish[]>
  
  // 按状态获取愿望
  async getWishesByStatus(userId: string, status: WishStatus): Promise<Wish[]>
}
```

### 练习管理
```typescript
class PracticeService {
  // 记录练习
  async recordPractice(session: Omit<PracticeSession, 'id'>): Promise<PracticeSession>
  
  // 获取今日练习
  async getTodayPractices(userId: string): Promise<PracticeSession[]>
  
  // 获取练习历史
  async getPracticeHistory(userId: string, limit?: number): Promise<PracticeSession[]>
  
  // 获取特定愿望的练习记录
  async getWishPractices(wishId: string): Promise<PracticeSession[]>
  
  // 获取特定日期的练习
  async getPracticesByDate(userId: string, date: Date): Promise<PracticeSession[]>
  
  // 检查今日是否完成
  async isTodayCompleted(userId: string, wishId: string): Promise<boolean>
}
```

### 进度统计
```typescript
class ProgressService {
  // 获取用户进度
  async getUserProgress(userId: string): Promise<Progress>
  
  // 更新进度统计
  async updateProgress(userId: string): Promise<void>
  
  // 获取连续天数
  async getConsecutiveDays(userId: string): Promise<number>
  
  // 获取周统计
  async getWeeklyStats(userId: string, weeks: number): Promise<WeeklyStats[]>
  
  // 获取月统计
  async getMonthlyStats(userId: string, months: number): Promise<MonthlyStats[]>
}
```

## 🔔 通知API

### 提醒管理
```typescript
class NotificationService {
  // 设置练习提醒
  async scheduleReminder(userId: string, time: Date, message: string): Promise<void>
  
  // 取消提醒
  async cancelReminder(reminderId: string): Promise<void>
  
  // 获取用户提醒设置
  async getReminderSettings(userId: string): Promise<ReminderTime[]>
  
  // 更新提醒设置
  async updateReminderSettings(userId: string, settings: ReminderTime[]): Promise<void>
}

interface ReminderTime {
  id: string
  timeSlot: TimeSlot
  time: string // HH:mm格式
  enabled: boolean
  message: string
}
```

## 📱 离线支持

### 同步策略
```typescript
class SyncService {
  // 检查网络状态
  async isOnline(): Promise<boolean>
  
  // 同步到云端
  async syncToCloud(userId: string): Promise<void>
  
  // 从云端同步
  async syncFromCloud(userId: string): Promise<void>
  
  // 获取待同步数据
  async getPendingSync(userId: string): Promise<SyncData[]>
  
  // 标记数据为已同步
  async markAsSynced(dataId: string): Promise<void>
}
```

## 🔐 数据安全

### 加密存储
```typescript
class SecurityService {
  // 加密敏感数据
  async encryptData(data: any): Promise<string>
  
  // 解密数据
  async decryptData(encryptedData: string): Promise<any>
  
  // 生成安全的ID
  generateSecureId(): string
  
  // 数据完整性验证
  async verifyDataIntegrity(data: any): Promise<boolean>
}
```

## 📊 Analytics API

### 使用统计
```typescript
class AnalyticsService {
  // 记录用户行为
  async trackEvent(event: string, properties?: Record<string, any>): Promise<void>
  
  // 记录页面访问
  async trackPageView(page: string): Promise<void>
  
  // 记录练习完成
  async trackPracticeCompleted(session: PracticeSession): Promise<void>
  
  // 记录愿望实现
  async trackWishAchieved(wish: Wish): Promise<void>
}
```

## 🚀 未来扩展

### 云端API规划
- RESTful API设计
- GraphQL查询支持
- 实时数据同步
- 多设备数据一致性
- 社区功能API
- 分享功能API

这套API设计为应用提供了完整的数据管理和功能支持框架。
