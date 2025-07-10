
import { useState, useEffect } from 'react';
import { Wish, WishCategory, WishStatus } from '@/types';
import { WishService } from '@/services/WishService';
import { useAuth } from '@/contexts/AuthContext';

export const useWishes = () => {
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, isAuthenticated } = useAuth();

  const loadWishes = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!isAuthenticated || !user) {
        setWishes([]);
        return;
      }

      const wishesData = await WishService.getWishes(user.id);
      setWishes(wishesData || []);
    } catch (error) {
      console.error('Error loading wishes:', error);
      setError('Failed to load wishes');
      setWishes([]);
    } finally {
      setLoading(false);
    }
  };

  const createWish = async (wishData: Omit<Wish, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const newWish = await WishService.createWish({
        ...wishData,
        userId: user.id
      });
      setWishes(prev => [...prev, newWish]);
      return newWish;
    } catch (error) {
      console.error('Error creating wish:', error);
      throw error;
    }
  };

  const updateWish = async (wishId: string, updates: Partial<Wish>) => {
    try {
      const updatedWish = await WishService.updateWish(wishId, updates);
      setWishes(prev => prev.map(wish => wish.id === wishId ? updatedWish : wish));
      return updatedWish;
    } catch (error) {
      console.error('Error updating wish:', error);
      throw error;
    }
  };

  const deleteWish = async (wishId: string) => {
    try {
      await WishService.deleteWish(wishId);
      setWishes(prev => prev.filter(wish => wish.id !== wishId));
    } catch (error) {
      console.error('Error deleting wish:', error);
      throw error;
    }
  };

  const getWishesByCategory = (category: WishCategory) => {
    return wishes.filter(wish => wish.category === category);
  };

  const getWishesByStatus = (status: WishStatus) => {
    return wishes.filter(wish => wish.status === status);
  };

  useEffect(() => {
    loadWishes();
  }, [user, isAuthenticated]);

  return {
    wishes,
    loading,
    error,
    createWish,
    updateWish,
    deleteWish,
    getWishesByCategory,
    getWishesByStatus,
    refetch: loadWishes
  };
};
