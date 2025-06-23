
import { PracticeSession } from '@/types';
import { LocalStorage } from '@/utils/storage';

export class PracticeService {
  private static generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  static async recordPractice(sessionData: Omit<PracticeSession, 'id'>): Promise<PracticeSession> {
    const session: PracticeSession = {
      ...sessionData,
      id: this.generateId()
    };

    const sessions = LocalStorage.getPracticeSessions();
    sessions.push(session);
    LocalStorage.setPracticeSessions(sessions);

    return session;
  }

  static async getTodayPractices(userId: string): Promise<PracticeSession[]> {
    const sessions = LocalStorage.getPracticeSessions();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return sessions.filter(session => {
      const sessionDate = new Date(session.date);
      sessionDate.setHours(0, 0, 0, 0);
      return session.userId === userId && sessionDate.getTime() === today.getTime();
    });
  }

  static async getPracticeHistory(userId: string, limit?: number): Promise<PracticeSession[]> {
    const sessions = LocalStorage.getPracticeSessions();
    const userSessions = sessions
      .filter(session => session.userId === userId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    return limit ? userSessions.slice(0, limit) : userSessions;
  }

  static async getWishPractices(wishId: string): Promise<PracticeSession[]> {
    const sessions = LocalStorage.getPracticeSessions();
    return sessions.filter(session => session.wishId === wishId);
  }

  static async getPracticesByDate(userId: string, date: Date): Promise<PracticeSession[]> {
    const sessions = LocalStorage.getPracticeSessions();
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);
    
    return sessions.filter(session => {
      const sessionDate = new Date(session.date);
      sessionDate.setHours(0, 0, 0, 0);
      return session.userId === userId && sessionDate.getTime() === targetDate.getTime();
    });
  }

  static async isTodayCompleted(userId: string, wishId: string): Promise<boolean> {
    const todayPractices = await this.getTodayPractices(userId);
    const wishPractices = todayPractices.filter(practice => practice.wishId === wishId);
    
    // 検查是否完成了3次练习（早上3次、下午6次、晚上9次）
    const morningCount = wishPractices.filter(p => p.timeSlot === 'morning').reduce((sum, p) => sum + p.completedCount, 0);
    const afternoonCount = wishPractices.filter(p => p.timeSlot === 'afternoon').reduce((sum, p) => sum + p.completedCount, 0);
    const eveningCount = wishPractices.filter(p => p.timeSlot === 'evening').reduce((sum, p) => sum + p.completedCount, 0);
    
    return morningCount >= 3 && afternoonCount >= 6 && eveningCount >= 9;
  }
}
