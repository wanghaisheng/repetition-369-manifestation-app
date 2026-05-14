import { storage, isErr } from '@/adapters';
import { PracticeSession } from '@/types';
import { logger } from '@/utils/logger';

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
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const result = await storage.data.query<PracticeRow>('practice_sessions', {
      filters: [
        { column: 'date', operator: 'gte', value: today.toISOString() },
        { column: 'date', operator: 'lt', value: tomorrow.toISOString() },
      ],
      order: [{ column: 'created_at', ascending: false }],
    });

    if (isErr(result)) {
      logger.error('PracticeService.getTodayPractices failed', result.error);
      return [];
    }
    return result.value.map(rowToSession);
  }

  static async getPracticeHistory(_userId?: string, limit?: number): Promise<PracticeSession[]> {
    const result = await storage.data.query<PracticeRow>('practice_sessions', {
      order: [{ column: 'created_at', ascending: false }],
      limit,
    });

    if (isErr(result)) {
      logger.error('PracticeService.getPracticeHistory failed', result.error);
      return [];
    }
    return result.value.map(rowToSession);
  }

  static async recordPractice(sessionData: Omit<PracticeSession, 'id'>): Promise<PracticeSession> {
    const userResult = await storage.auth.getUser();
    if (isErr(userResult)) {
      throw new Error(userResult.error.message);
    }
    if (!userResult.value) {
      throw new Error('User not authenticated');
    }

    const insertResult = await storage.data.insert<PracticeRow>('practice_sessions', {
      user_id: userResult.value.id,
      wish_id: sessionData.wishId,
      date: sessionData.date.toISOString(),
      time_slot: sessionData.timeSlot,
      completed_count: sessionData.completedCount,
      target_count: sessionData.targetCount,
      duration: sessionData.duration,
      affirmation_text: sessionData.affirmationText,
      mood: sessionData.mood,
    });

    if (isErr(insertResult)) {
      logger.error('PracticeService.recordPractice failed', insertResult.error);
      throw new Error(insertResult.error.message);
    }
    return rowToSession(insertResult.value);
  }

  static async isTodayCompleted(_userId: string, wishId: string): Promise<boolean> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const result = await storage.data.query<PracticeRow>('practice_sessions', {
      select: 'completed_count',
      filters: [
        { column: 'wish_id', operator: 'eq', value: wishId },
        { column: 'date', operator: 'gte', value: today.toISOString() },
        { column: 'date', operator: 'lt', value: tomorrow.toISOString() },
      ],
    });

    if (isErr(result)) {
      logger.error('PracticeService.isTodayCompleted failed', result.error);
      return false;
    }
    const totalCompleted = result.value.reduce((sum, s) => sum + s.completed_count, 0);
    return totalCompleted >= 18; // 3 + 6 + 9 = 18
  }
}
