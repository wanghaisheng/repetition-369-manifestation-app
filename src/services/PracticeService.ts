import { storage, isErr } from '@/adapters';
import { PracticeSession } from '@/types';
import { logger } from '@/utils/logger';
import {
  PracticeRowSchema,
  PracticeInputSchema,
  type PracticeRow,
} from '@/schemas';
import { validate, validateMany } from '@/schemas/validate';

function rowToSession(row: PracticeRow): PracticeSession {
  return {
    id: row.id,
    wishId: row.wish_id,
    date: new Date(row.date),
    timeSlot: row.time_slot,
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

    const result = await storage.data.query<unknown>('practice_sessions', {
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
    const validRows = validateMany(PracticeRowSchema, result.value, 'practice.getToday');
    return validRows.map(rowToSession);
  }

  static async getPracticeHistory(_userId?: string, limit?: number): Promise<PracticeSession[]> {
    const result = await storage.data.query<unknown>('practice_sessions', {
      order: [{ column: 'created_at', ascending: false }],
      limit,
    });

    if (isErr(result)) {
      logger.error('PracticeService.getPracticeHistory failed', result.error);
      return [];
    }
    const validRows = validateMany(PracticeRowSchema, result.value, 'practice.getHistory');
    return validRows.map(rowToSession);
  }

  static async recordPractice(sessionData: Omit<PracticeSession, 'id'>): Promise<PracticeSession> {
    // Validate input before hitting storage
    const inputCheck = validate(
      PracticeInputSchema,
      {
        wishId: sessionData.wishId,
        timeSlot: sessionData.timeSlot,
        completedCount: sessionData.completedCount,
        targetCount: sessionData.targetCount,
        duration: sessionData.duration,
        affirmationText: sessionData.affirmationText,
        mood: sessionData.mood,
      },
      'practice.record.input',
    );
    if (isErr(inputCheck)) {
      throw new Error(inputCheck.error.message);
    }

    const userResult = await storage.auth.getUser();
    if (isErr(userResult)) {
      throw new Error(userResult.error.message);
    }
    if (!userResult.value) {
      throw new Error('User not authenticated');
    }

    const insertResult = await storage.data.insert<unknown>('practice_sessions', {
      user_id: userResult.value.id,
      wish_id: inputCheck.value.wishId,
      date: sessionData.date.toISOString(),
      time_slot: inputCheck.value.timeSlot,
      completed_count: inputCheck.value.completedCount,
      target_count: inputCheck.value.targetCount,
      duration: inputCheck.value.duration,
      affirmation_text: inputCheck.value.affirmationText,
      mood: inputCheck.value.mood,
    });

    if (isErr(insertResult)) {
      logger.error('PracticeService.recordPractice failed', insertResult.error);
      throw new Error(insertResult.error.message);
    }
    const rowCheck = validate(PracticeRowSchema, insertResult.value, 'practice.record.row');
    if (isErr(rowCheck)) {
      throw new Error(rowCheck.error.message);
    }
    return rowToSession(rowCheck.value);
  }

  static async isTodayCompleted(_userId: string, wishId: string): Promise<boolean> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const result = await storage.data.query<{ completed_count: number }>('practice_sessions', {
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
    const totalCompleted = result.value.reduce(
      (sum, s) => sum + (typeof s.completed_count === 'number' ? s.completed_count : 0),
      0,
    );
    return totalCompleted >= 18; // 3 + 6 + 9 = 18
  }
}
