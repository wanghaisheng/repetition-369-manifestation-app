
import { PracticeSession, Wish } from '@/types';
import { PracticeService } from './PracticeService';
import { WishService } from './WishService';

export interface AnalyticsData {
  practiceFrequency: {
    daily: number[];
    weekly: number[];
    monthly: number[];
  };
  timePatterns: {
    morning: number;
    afternoon: number;
    evening: number;
  };
  moodTrends: {
    excellent: number;
    good: number;
    neutral: number;
    poor: number;
  };
  wishProgress: {
    wishId: string;
    title: string;
    completionRate: number;
    totalSessions: number;
    averageDaily: number;
  }[];
  streakAnalysis: {
    current: number;
    longest: number;
    consistency: number;
  };
  productivityScore: number;
}

export interface PracticeInsight {
  type: 'success' | 'warning' | 'info';
  title: string;
  description: string;
  actionable: boolean;
  recommendation?: string;
}

export class AnalyticsService {
  static async getAnalytics(userId: string, days: number = 30): Promise<AnalyticsData> {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const practices = await PracticeService.getPracticeHistory(userId);
    const wishes = await WishService.getWishes(userId);
    
    const filteredPractices = practices.filter(p => 
      new Date(p.date) >= startDate && new Date(p.date) <= endDate
    );

    return {
      practiceFrequency: this.calculateFrequency(filteredPractices, days),
      timePatterns: this.analyzeTimePatterns(filteredPractices),
      moodTrends: this.analyzeMoodTrends(filteredPractices),
      wishProgress: this.analyzeWishProgress(filteredPractices, wishes),
      streakAnalysis: this.analyzeStreaks(practices),
      productivityScore: this.calculateProductivityScore(filteredPractices, days)
    };
  }

  static async generateInsights(userId: string): Promise<PracticeInsight[]> {
    const analytics = await this.getAnalytics(userId, 30);
    const insights: PracticeInsight[] = [];

    // Consistency insights
    if (analytics.streakAnalysis.consistency < 0.7) {
      insights.push({
        type: 'warning',
        title: '练习一致性有待提升',
        description: `您的练习一致性为 ${Math.round(analytics.streakAnalysis.consistency * 100)}%`,
        actionable: true,
        recommendation: '尝试设置固定的练习时间，建立稳定的习惯'
      });
    }

    // Time pattern insights
    const { morning, afternoon, evening } = analytics.timePatterns;
    const totalSessions = morning + afternoon + evening;
    
    if (totalSessions > 0) {
      const dominantTime = morning > afternoon && morning > evening ? 'morning' :
                          afternoon > evening ? 'afternoon' : 'evening';
      
      const timeNames = { morning: '早上', afternoon: '下午', evening: '晚上' };
      
      insights.push({
        type: 'info',
        title: '最佳练习时段',
        description: `您在${timeNames[dominantTime]}的练习效果最好`,
        actionable: true,
        recommendation: `考虑在${timeNames[dominantTime]}安排更多练习时间`
      });
    }

    // Mood insights
    const moodTotal = Object.values(analytics.moodTrends).reduce((sum, count) => sum + count, 0);
    if (moodTotal > 0) {
      const positiveRatio = (analytics.moodTrends.excellent + analytics.moodTrends.good) / moodTotal;
      
      if (positiveRatio > 0.8) {
        insights.push({
          type: 'success',
          title: '情绪状态良好',
          description: `${Math.round(positiveRatio * 100)}% 的练习时您处于积极状态`,
          actionable: false
        });
      }
    }

    // Productivity insights
    if (analytics.productivityScore > 80) {
      insights.push({
        type: 'success',
        title: '练习效率优秀',
        description: `您的练习效率得分为 ${Math.round(analytics.productivityScore)}`,
        actionable: false
      });
    } else if (analytics.productivityScore < 60) {
      insights.push({
        type: 'warning',
        title: '练习效率有待提升',
        description: `您的练习效率得分为 ${Math.round(analytics.productivityScore)}`,
        actionable: true,
        recommendation: '尝试在精力充沛时进行练习，并减少干扰'
      });
    }

    return insights;
  }

  private static calculateFrequency(practices: PracticeSession[], days: number) {
    const daily = new Array(days).fill(0);
    const weekly = new Array(Math.ceil(days / 7)).fill(0);
    const monthly = new Array(Math.ceil(days / 30)).fill(0);

    practices.forEach(practice => {
      const date = new Date(practice.date);
      const dayIndex = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24));
      const weekIndex = Math.floor(dayIndex / 7);
      const monthIndex = Math.floor(dayIndex / 30);

      if (dayIndex < days) daily[dayIndex]++;
      if (weekIndex < weekly.length) weekly[weekIndex]++;
      if (monthIndex < monthly.length) monthly[monthIndex]++;
    });

    return { daily: daily.reverse(), weekly: weekly.reverse(), monthly: monthly.reverse() };
  }

  private static analyzeTimePatterns(practices: PracticeSession[]) {
    return practices.reduce((acc, practice) => {
      acc[practice.timeSlot]++;
      return acc;
    }, { morning: 0, afternoon: 0, evening: 0 });
  }

  private static analyzeMoodTrends(practices: PracticeSession[]) {
    return practices.reduce((acc, practice) => {
      if (practice.mood) {
        acc[practice.mood]++;
      }
      return acc;
    }, { excellent: 0, good: 0, neutral: 0, poor: 0 });
  }

  private static analyzeWishProgress(practices: PracticeSession[], wishes: Wish[]) {
    const wishStats = wishes.map(wish => {
      const wishPractices = practices.filter(p => p.wishId === wish.id);
      const totalSessions = wishPractices.length;
      const completedCount = wishPractices.reduce((sum, p) => sum + p.completedCount, 0);
      const targetCount = wishPractices.reduce((sum, p) => sum + p.targetCount, 0);
      
      return {
        wishId: wish.id,
        title: wish.title,
        completionRate: targetCount > 0 ? (completedCount / targetCount) * 100 : 0,
        totalSessions,
        averageDaily: totalSessions / 30
      };
    });

    return wishStats.sort((a, b) => b.completionRate - a.completionRate);
  }

  private static analyzeStreaks(practices: PracticeSession[]) {
    const dates = [...new Set(practices.map(p => 
      new Date(p.date).toDateString()
    ))].sort();

    let currentStreak = 0;
    let longestStreak = 0;
    let consecutiveDays = 0;

    for (let i = dates.length - 1; i >= 0; i--) {
      const currentDate = new Date(dates[i]);
      const expectedDate = new Date();
      expectedDate.setDate(expectedDate.getDate() - consecutiveDays);

      if (currentDate.toDateString() === expectedDate.toDateString()) {
        currentStreak++;
        consecutiveDays++;
      } else {
        break;
      }
    }

    // Calculate longest streak
    let tempStreak = 0;
    for (let i = 1; i < dates.length; i++) {
      const prevDate = new Date(dates[i - 1]);
      const currDate = new Date(dates[i]);
      const dayDiff = (currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24);

      if (dayDiff === 1) {
        tempStreak++;
        longestStreak = Math.max(longestStreak, tempStreak);
      } else {
        tempStreak = 0;
      }
    }

    const consistency = dates.length / 30; // Simplified consistency calculation

    return {
      current: currentStreak,
      longest: longestStreak,
      consistency: Math.min(consistency, 1)
    };
  }

  private static calculateProductivityScore(practices: PracticeSession[], days: number): number {
    if (practices.length === 0) return 0;

    const totalExpected = days * 3; // 3 sessions per day expected
    const totalCompleted = practices.reduce((sum, p) => sum + p.completedCount, 0);
    const completionRate = (totalCompleted / totalExpected) * 100;

    // Factor in consistency
    const practiceDays = new Set(practices.map(p => 
      new Date(p.date).toDateString()
    )).size;
    const consistencyRate = (practiceDays / days) * 100;

    // Factor in mood (if available)
    let moodScore = 70; // Default neutral score
    const moodPractices = practices.filter(p => p.mood);
    if (moodPractices.length > 0) {
      const moodValues = { excellent: 100, good: 80, neutral: 60, poor: 40 };
      moodScore = moodPractices.reduce((sum, p) => 
        sum + (moodValues[p.mood!] || 60), 0
      ) / moodPractices.length;
    }

    // Weighted average
    return Math.min(
      (completionRate * 0.5) + (consistencyRate * 0.3) + (moodScore * 0.2),
      100
    );
  }
}
