
import { Wish, WishCategory, WishStatus } from '@/types';
import { LocalStorage } from '@/utils/storage';

export class WishService {
  private static generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  static async createWish(wishData: Omit<Wish, 'id' | 'createdAt' | 'updatedAt'>): Promise<Wish> {
    const wish: Wish = {
      ...wishData,
      id: this.generateId(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const wishes = LocalStorage.getWishes();
    wishes.push(wish);
    LocalStorage.setWishes(wishes);

    return wish;
  }

  static async getWishes(userId: string): Promise<Wish[]> {
    const wishes = LocalStorage.getWishes();
    return wishes.filter(wish => wish.userId === userId);
  }

  static async getWish(wishId: string): Promise<Wish | null> {
    const wishes = LocalStorage.getWishes();
    return wishes.find(wish => wish.id === wishId) || null;
  }

  static async updateWish(wishId: string, updates: Partial<Wish>): Promise<Wish> {
    const wishes = LocalStorage.getWishes();
    const index = wishes.findIndex(wish => wish.id === wishId);
    
    if (index === -1) {
      throw new Error('Wish not found');
    }

    const updatedWish = {
      ...wishes[index],
      ...updates,
      updatedAt: new Date()
    };

    wishes[index] = updatedWish;
    LocalStorage.setWishes(wishes);

    return updatedWish;
  }

  static async deleteWish(wishId: string): Promise<void> {
    const wishes = LocalStorage.getWishes();
    const filteredWishes = wishes.filter(wish => wish.id !== wishId);
    LocalStorage.setWishes(filteredWishes);
  }

  static async getWishesByCategory(userId: string, category: WishCategory): Promise<Wish[]> {
    const wishes = await this.getWishes(userId);
    return wishes.filter(wish => wish.category === category);
  }

  static async getWishesByStatus(userId: string, status: WishStatus): Promise<Wish[]> {
    const wishes = await this.getWishes(userId);
    return wishes.filter(wish => wish.status === status);
  }
}
