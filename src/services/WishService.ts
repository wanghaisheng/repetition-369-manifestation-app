
import { storage } from '@/adapters';
import { Wish, WishCategory, WishStatus } from '@/types';

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
    try {
      const { data, error } = await storage.data.query<WishRow>('wishes', {
        filters: [{ column: 'is_active', operator: 'eq', value: true }],
        order: [{ column: 'created_at', ascending: false }],
      });

      if (error) throw new Error(error.message);
      return data?.map(rowToWish) || [];
    } catch (error) {
      console.error('Error fetching wishes:', error);
      return [];
    }
  }

  static async createWish(wishData: Omit<Wish, 'id' | 'createdAt' | 'updatedAt'>): Promise<Wish> {
    try {
      const { data: authUser } = await storage.auth.getUser();
      if (!authUser) throw new Error('User not authenticated');

      const { data, error } = await storage.data.insert<WishRow>('wishes', {
        user_id: authUser.id,
        title: wishData.title,
        affirmation: wishData.affirmation,
        category: wishData.category,
        color: '#667eea',
        is_active: true,
      });

      if (error || !data) throw new Error(error?.message || 'Insert failed');
      return rowToWish(data);
    } catch (error) {
      console.error('Error creating wish:', error);
      throw error;
    }
  }

  static async updateWish(wishId: string, updates: Partial<Wish>): Promise<Wish> {
    try {
      const { data, error } = await storage.data.update<WishRow>(
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

      if (error || !data) throw new Error(error?.message || 'Update failed');
      return rowToWish(data);
    } catch (error) {
      console.error('Error updating wish:', error);
      throw error;
    }
  }

  static async deleteWish(wishId: string): Promise<void> {
    try {
      const { error } = await storage.data.delete('wishes', [
        { column: 'id', operator: 'eq', value: wishId },
      ]);
      if (error) throw new Error(error.message);
    } catch (error) {
      console.error('Error deleting wish:', error);
      throw error;
    }
  }
}
