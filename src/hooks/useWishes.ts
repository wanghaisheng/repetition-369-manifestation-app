
import { useState, useEffect } from 'react';
import { Wish, WishCategory, WishStatus } from '@/types';
import { WishService } from '@/services/WishService';

export const useWishes = (userId: string = 'default') => {
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [loading, setLoading] = useState(true);

  const loadWishes = async () => {
    try {
      setLoading(true);
      const wishesData = await WishService.getWishes(userId);
      setWishes(wishesData);
    } catch (error) {
      console.error('Error loading wishes:', error);
    } finally {
      setLoading(false);
    }
  };

  const createWish = async (wishData: Omit<Wish, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newWish = await WishService.createWish({
        ...wishData,
        userId
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
  }, [userId]);

  return {
    wishes,
    loading,
    createWish,
    updateWish,
    deleteWish,
    getWishesByCategory,
    getWishesByStatus,
    refetch: loadWishes
  };
};
