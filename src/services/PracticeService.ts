
import { storage } from '@/adapters';
import { PracticeSession } from '@/types';

interface PracticeRow {
  id: string;
  wish_id: string;
  user_id: string;
  date: string;
  time_slot: string;
  completed_count: number;
  target_count: number;
  duration: number | null;
  affirmation_text: string | null;
  mood: string | null;
  created_at: string;
}

function rowToSession(row: PracticeRow): PracticeSession {
  return {
    id: row.id,
    wishId: row.wish_id,
    date: new Date(row.date),
    timeSlot: row.time_slot as 'morning' | 'afternoon' | 'evening',
    completedCount: row.completed_count,
    targetCount: row.target_count,
    duration: row.duration || 0,
    affirmationText: row.affirmation_text || '',
    mood: row.mood as any,
    userId: row.user_id,
  };
}

export class PracticeService {
  static async getTodayPractices(_userId?: string): Promise<PracticeSession[]> {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const { data, error } = await storage.data.query<PracticeRow>('practice_sessions', {
        filters: [
          { column: 'date', operator: 'gte', value: today.toISOString() },
          { column: 'date', operator: 'lt', value: tomorrow.toISOString() },
        ],
        order: [{ column: 'created_at', ascending: false }],
      });

      if (error) throw new Error(error.message);
      return data?.map(rowToSession) || [];
    } catch (error) {
      console.error('Error fetching today practices:', error);
      return [];
    }
  }

  static async getPracticeHistory(_userId?: string, limit?: number): Promise<PracticeSession[]> {
    try {
      const { data, error } = await storage.data.query<PracticeRow>('practice_sessions', {
        order: [{ column: 'created_at', ascending: false }],
        limit,
      });

      if (error) throw new Error(error.message);
      return data?.map(rowToSession) || [];
    } catch (error) {
      console.error('Error fetching practice history:', error);
      return [];
    }
  }

  static async recordPractice(sessionData: Omit<PracticeSession, 'id'>): Promise<PracticeSession> {
    try {
      const { data: authUser } = await storage.auth.getUser();
      if (!authUser) throw new Error('User not authenticated');

      const { data, error } = await storage.data.insert<PracticeRow>('practice_sessions', {
        user_id: authUser.id,
        wish_id: sessionData.wishId,
        date: sessionData.date.toISOString(),
        time_slot: sessionData.timeSlot,
        completed_count: sessionData.completedCount,
        target_count: sessionData.targetCount,
        duration: sessionData.duration,
        affirmation_text: sessionData.affirmationText,
        mood: sessionData.mood,
      });

      if (error || !data) throw new Error(error?.message || 'Insert failed');
      return rowToSession(data);
    } catch (error) {
      console.error('Error recording practice:', error);
      throw error;
    }
  }

  static async isTodayCompleted(_userId: string, wishId: string): Promise<boolean> {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const { data, error } = await storage.data.query<PracticeRow>('practice_sessions', {
        select: 'completed_count',
        filters: [
          { column: 'wish_id', operator: 'eq', value: wishId },
          { column: 'date', operator: 'gte', value: today.toISOString() },
          { column: 'date', operator: 'lt', value: tomorrow.toISOString() },
        ],
      });

      if (error) throw new Error(error.message);
      const totalCompleted = data?.reduce((sum, s) => sum + s.completed_count, 0) || 0;
      return totalCompleted >= 18; // 3 + 6 + 9 = 18
    } catch (error) {
      console.error('Error checking today completion:', error);
      return false;
    }
  }
}
