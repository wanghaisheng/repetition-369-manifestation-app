
export type WishCategory = 'career' | 'health' | 'relationship' | 'wealth' | 'personal' | 'other';
export type WishStatus = 'active' | 'achieved' | 'paused' | 'archived';
export type Priority = 'high' | 'medium' | 'low';
export type TimeSlot = 'morning' | 'afternoon' | 'evening';
export type Mood = 'excellent' | 'good' | 'neutral' | 'poor';

export interface Wish {
  id: string;
  userId: string;
  title: string;
  description: string;
  category: WishCategory;
  status: WishStatus;
  priority: Priority;
  affirmation: string;
  createdAt: Date;
  updatedAt: Date;
  targetDate?: Date;
  achievedAt?: Date;
  tags: string[];
}

export interface PracticeSession {
  id: string;
  userId: string;
  wishId: string;
  date: Date;
  timeSlot: TimeSlot;
  completedCount: number;
  targetCount: number;
  duration: number; // 秒
  affirmationText: string;
  mood?: Mood;
  notes?: string;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: NotificationSettings;
  reminderTimes: ReminderTime[];
  defaultCategory: WishCategory;
}

export interface NotificationSettings {
  enabled: boolean;
  morningReminder: boolean;
  afternoonReminder: boolean;
  eveningReminder: boolean;
}

export interface ReminderTime {
  id: string;
  timeSlot: TimeSlot;
  time: string; // HH:mm格式
  enabled: boolean;
  message: string;
}

export interface User {
  id: string;
  name: string;
  avatar?: string;
  createdAt: Date;
  preferences: UserPreferences;
}

export interface WeeklyStats {
  weekStart: Date;
  sessionsCompleted: number;
  targetSessions: number;
  averageMood: number;
}

export interface MonthlyStats {
  month: string;
  practices: number;
  completed: number;
}

export interface Progress {
  userId: string;
  totalSessions: number;
  consecutiveDays: number;
  longestStreak: number;
  totalWishes: number;
  achievedWishes: number;
  lastPracticeDate: Date;
  weeklyStats: WeeklyStats[];
  monthlyStats: MonthlyStats[];
}
