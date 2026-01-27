import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AddWishModal } from '@/components/modals/AddWishModal';
import { useWishes } from '@/hooks/useWishes';
import { Wish, WishCategory } from '@/types';
import { logger } from '@/utils/logger';
import { WishesViewSkeleton } from '@/components/skeletons/AppSkeletons';
import { WishesHeader } from '@/components/wishes/WishesHeader';
import { WishesList } from '@/components/wishes/WishesList';
import { WishesEmptyState } from '@/components/wishes/WishesEmptyState';

export const WishesView = () => {
  const { t } = useTranslation('app');
  const [showAddModal, setShowAddModal] = useState(false);
  const { wishes, loading, createWish, updateWish } = useWishes();

  const handleAddWish = async (wishData: any) => {
    try {
      await createWish({
        title: wishData.title,
        description: wishData.description || '',
        category: wishData.category as WishCategory,
        status: 'active',
        priority: wishData.priority || 'medium',
        affirmation: wishData.affirmation,
        tags: wishData.tags || []
      });
      setShowAddModal(false);
    } catch (error) {
      logger.error('Error creating wish', error);
      throw error;
    }
  };

  const handleToggleStatus = async (wish: Wish) => {
    try {
      const newStatus = wish.status === 'active' ? 'paused' : 'active';
      await updateWish(wish.id, { status: newStatus });
    } catch (error) {
      logger.error('Error updating wish status', error);
    }
  };

  const activeWishes = wishes.filter(wish => wish.status === 'active');

  if (loading) {
    return <WishesViewSkeleton />;
  }

  return (
    <div className="flex-1 bg-secondary/30 px-4 py-5 overflow-y-auto">
      {/* Header with Add Button */}
      <WishesHeader onAddWish={() => setShowAddModal(true)} />

      {/* Content */}
      {activeWishes.length > 0 ? (
        <WishesList 
          wishes={activeWishes} 
          onToggleStatus={handleToggleStatus} 
        />
      ) : (
        <WishesEmptyState onAddWish={() => setShowAddModal(true)} />
      )}

      {/* Add Wish Modal */}
      <AddWishModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddWish}
      />
    </div>
  );
};
