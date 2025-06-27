
import { supabase } from '@/integrations/supabase/client';
import { Wish, WishCategory, WishStatus } from '@/types';

export class WishService {
  static async getWishes(userId?: string): Promise<Wish[]> {
    try {
      const { data, error } = await supabase
        .from('wishes')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data?.map(wish => ({
        id: wish.id,
        title: wish.title,
        description: '',
        category: wish.category as WishCategory,
        status: 'active' as WishStatus,
        priority: 'medium',
        affirmation: wish.affirmation,
        tags: [],
        userId: wish.user_id,
        createdAt: new Date(wish.created_at),
        updatedAt: new Date(wish.updated_at)
      })) || [];
    } catch (error) {
      console.error('Error fetching wishes:', error);
      return [];
    }
  }

  static async createWish(wishData: Omit<Wish, 'id' | 'createdAt' | 'updatedAt'>): Promise<Wish> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('wishes')
        .insert({
          user_id: user.id,
          title: wishData.title,
          affirmation: wishData.affirmation,
          category: wishData.category,
          color: '#667eea',
          is_active: true
        })
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        title: data.title,
        description: '',
        category: data.category as WishCategory,
        status: 'active' as WishStatus,
        priority: 'medium',
        affirmation: data.affirmation,
        tags: [],
        userId: data.user_id,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at)
      };
    } catch (error) {
      console.error('Error creating wish:', error);
      throw error;
    }
  }

  static async updateWish(wishId: string, updates: Partial<Wish>): Promise<Wish> {
    try {
      const { data, error } = await supabase
        .from('wishes')
        .update({
          title: updates.title,
          affirmation: updates.affirmation,
          category: updates.category,
          is_active: updates.status === 'active',
          updated_at: new Date().toISOString()
        })
        .eq('id', wishId)
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        title: data.title,
        description: '',
        category: data.category as WishCategory,
        status: data.is_active ? 'active' : 'paused' as WishStatus,
        priority: 'medium',
        affirmation: data.affirmation,
        tags: [],
        userId: data.user_id,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at)
      };
    } catch (error) {
      console.error('Error updating wish:', error);
      throw error;
    }
  }

  static async deleteWish(wishId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('wishes')
        .delete()
        .eq('id', wishId);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting wish:', error);
      throw error;
    }
  }
}
