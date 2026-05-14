import { storage } from '@/adapters';
import { Wish, WishCategory, WishStatus } from '@/types';
import { logger } from '@/utils/logger';

interface WishRow {
  id: string;
  title: string;
  affirmation: string;
  category: string | null;
  color: string | null;
  is_active: boolean | null;
  user_id: string;
  created_at: string;
  updated_at: string;
}

function rowToWish(row: WishRow): Wish {
  return {
    id: row.id,
    title: row.title,
    description: '',
    category: row.category as WishCategory,
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
    const result = await storage.data.query<WishRow>('wishes', {
      filters: [{ column: 'is_active', operator: 'eq', value: true }],
      order: [{ column: 'created_at', ascending: false }],
    });

    if (!result.ok) {
      logger.error('WishService.getWishes failed', result.error);
      return [];
    }
    return result.value.map(rowToWish);
  }

  static async createWish(wishData: Omit<Wish, 'id' | 'createdAt' | 'updatedAt'>): Promise<Wish> {
    const userResult = await storage.auth.getUser();
    if (!userResult.ok) {
      throw new Error(userResult.error.message);
    }
    if (!userResult.value) {
      throw new Error('User not authenticated');
    }

    const insertResult = await storage.data.insert<WishRow>('wishes', {
      user_id: userResult.value.id,
      title: wishData.title,
      affirmation: wishData.affirmation,
      category: wishData.category,
      color: '#667eea',
      is_active: true,
    });

    if (!insertResult.ok) {
      logger.error('WishService.createWish failed', insertResult.error);
      throw new Error(insertResult.error.message);
    }
    return rowToWish(insertResult.value);
  }

  static async updateWish(wishId: string, updates: Partial<Wish>): Promise<Wish> {
    const result = await storage.data.update<WishRow>(
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

    if (!result.ok) {
      logger.error('WishService.updateWish failed', result.error);
      throw new Error(result.error.message);
    }
    return rowToWish(result.value);
  }

  static async deleteWish(wishId: string): Promise<void> {
    const result = await storage.data.delete('wishes', [
      { column: 'id', operator: 'eq', value: wishId },
    ]);
    if (!result.ok) {
      logger.error('WishService.deleteWish failed', result.error);
      throw new Error(result.error.message);
    }
  }
}
