
import { supabase } from '@/integrations/supabase/client';
import { PracticeSession } from '@/types';

export class PracticeService {
  static async getTodayPractices(userId?: string): Promise<PracticeSession[]> {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const { data, error } = await supabase
        .from('practice_sessions')
        .select('*')
        .gte('date', today.toISOString())
        .lt('date', tomorrow.toISOString())
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data?.map(session => ({
        id: session.id,
        wishId: session.wish_id,
        date: new Date(session.date),
        timeSlot: session.time_slot as 'morning' | 'afternoon' | 'evening',
        completedCount: session.completed_count,
        targetCount: session.target_count,
        duration: session.duration || 0,
        affirmationText: session.affirmation_text || '',
        mood: session.mood as any,
        userId: session.user_id
      })) || [];
    } catch (error) {
      console.error('Error fetching today practices:', error);
      return [];
    }
  }

  static async getPracticeHistory(userId?: string, limit?: number): Promise<PracticeSession[]> {
    try {
      let query = supabase
        .from('practice_sessions')
        .select('*')
        .order('created_at', { ascending: false });

      if (limit) {
        query = query.limit(limit);
      }

      const { data, error } = await query;

      if (error) throw error;

      return data?.map(session => ({
        id: session.id,
        wishId: session.wish_id,
        date: new Date(session.date),
        timeSlot: session.time_slot as 'morning' | 'afternoon' | 'evening',
        completedCount: session.completed_count,
        targetCount: session.target_count,
        duration: session.duration || 0,
        affirmationText: session.affirmation_text || '',
        mood: session.mood as any,
        userId: session.user_id
      })) || [];
    } catch (error) {
      console.error('Error fetching practice history:', error);
      return [];
    }
  }

  static async recordPractice(sessionData: Omit<PracticeSession, 'id'>): Promise<PracticeSession> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('practice_sessions')
        .insert({
          user_id: user.id,
          wish_id: sessionData.wishId,
          date: sessionData.date.toISOString(),
          time_slot: sessionData.timeSlot,
          completed_count: sessionData.completedCount,
          target_count: sessionData.targetCount,
          duration: sessionData.duration,
          affirmation_text: sessionData.affirmationText,
          mood: sessionData.mood
        })
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        wishId: data.wish_id,
        date: new Date(data.date),
        timeSlot: data.time_slot as 'morning' | 'afternoon' | 'evening',
        completedCount: data.completed_count,
        targetCount: data.target_count,
        duration: data.duration || 0,
        affirmationText: data.affirmation_text || '',
        mood: data.mood as any,
        userId: data.user_id
      };
    } catch (error) {
      console.error('Error recording practice:', error);
      throw error;
    }
  }

  static async isTodayCompleted(userId: string, wishId: string): Promise<boolean> {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const { data, error } = await supabase
        .from('practice_sessions')
        .select('completed_count')
        .eq('wish_id', wishId)
        .gte('date', today.toISOString())
        .lt('date', tomorrow.toISOString());

      if (error) throw error;

      const totalCompleted = data?.reduce((sum, session) => sum + session.completed_count, 0) || 0;
      return totalCompleted >= 18; // 3 + 6 + 9 = 18
    } catch (error) {
      console.error('Error checking today completion:', error);
      return false;
    }
  }
}
