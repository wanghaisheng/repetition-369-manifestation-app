import { storage, isErr } from '@/adapters';
import { Wish, WishCategory, WishStatus } from '@/types';
import { logger } from '@/utils/logger';
import {
  WishRowSchema,
  WishInputSchema,
  type WishRow,
} from '@/schemas';
import { validate, validateMany } from '@/schemas/validate';

function rowToWish(row: WishRow): Wish {
  return {
    id: row.id,
    title: row.title,
    description: '',
    category: (row.category as WishCategory) ?? 'other',
    status: row.is_active ? 'active' : ('paused' as WishStatus),
    priority: 'medium',
    affirmation: row.affirmation,
    tags: [],
    userId: row.user_id,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  };
}

export class WishService {
  static async getWishes(_userId?: string): Promise<Wish[]> {
    const result = await storage.data.query<unknown>('wishes', {
      filters: [{ column: 'is_active', operator: 'eq', value: true }],
      order: [{ column: 'created_at', ascending: false }],
    });

    if (isErr(result)) {
      logger.error('WishService.getWishes failed', result.error);
      return [];
    }
    const validRows = validateMany(WishRowSchema, result.value, 'wishes.getWishes');
    return validRows.map(rowToWish);
  }

  static async createWish(wishData: Omit<Wish, 'id' | 'createdAt' | 'updatedAt'>): Promise<Wish> {
    // Validate input before hitting storage
    const inputCheck = validate(
      WishInputSchema,
      {
        title: wishData.title,
        affirmation: wishData.affirmation,
        category: wishData.category,
      },
      'wishes.createWish.input',
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

    const insertResult = await storage.data.insert<unknown>('wishes', {
      user_id: userResult.value.id,
      title: inputCheck.value.title,
      affirmation: inputCheck.value.affirmation,
      category: inputCheck.value.category ?? null,
      color: '#667eea',
      is_active: true,
    });

    if (isErr(insertResult)) {
      logger.error('WishService.createWish failed', insertResult.error);
      throw new Error(insertResult.error.message);
    }
    const rowCheck = validate(WishRowSchema, insertResult.value, 'wishes.createWish.row');
    if (isErr(rowCheck)) {
      throw new Error(rowCheck.error.message);
    }
    return rowToWish(rowCheck.value);
  }

  static async updateWish(wishId: string, updates: Partial<Wish>): Promise<Wish> {
    const result = await storage.data.update<unknown>(
      'wishes',
      {
        title: updates.title,
        affirmation: updates.affirmation,
        category: updates.category,
        is_active: updates.status === 'active',
        updated_at: new Date().toISOString(),
      },
      [{ column: 'id', operator: 'eq', value: wishId }],
    );

    if (isErr(result)) {
      logger.error('WishService.updateWish failed', result.error);
      throw new Error(result.error.message);
    }
    const rowCheck = validate(WishRowSchema, result.value, 'wishes.updateWish.row');
    if (isErr(rowCheck)) {
      throw new Error(rowCheck.error.message);
    }
    return rowToWish(rowCheck.value);
  }

  static async deleteWish(wishId: string): Promise<void> {
    const result = await storage.data.delete('wishes', [
      { column: 'id', operator: 'eq', value: wishId },
    ]);
    if (isErr(result)) {
      logger.error('WishService.deleteWish failed', result.error);
      throw new Error(result.error.message);
    }
  }
}
