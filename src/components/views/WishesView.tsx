
import { useState, useEffect } from 'react';
import { Plus, Heart, Target, Briefcase, Home as HomeIcon, Smile, User, DollarSign } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AddWishModal } from '@/components/modals/AddWishModal';
import { useWishes } from '@/hooks/useWishes';
import { Wish, WishCategory } from '@/types';

export const WishesView = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const { wishes, loading, createWish, updateWish, deleteWish } = useWishes();

  const categoryIcons = {
    career: Briefcase,
    health: Heart,
    relationship: Smile,
    wealth: DollarSign,
    personal: User,
    other: Target
  };

  const categoryColors = {
    career: 'bg-ios-blue',
    health: 'bg-ios-green',
    relationship: 'bg-ios-pink',
    wealth: 'bg-manifest-gold',
    personal: 'bg-ios-purple',
    other: 'bg-gray-500'
  };

  const categoryNames = {
    career: '事业',
    health: '健康',
    relationship: '感情',
    wealth: '财富',
    personal: '个人成长',
    other: '其他'
  };

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
      console.error('Error creating wish:', error);
      throw error;
    }
  };

  const handleToggleStatus = async (wish: Wish) => {
    try {
      const newStatus = wish.status === 'active' ? 'paused' : 'active';
      await updateWish(wish.id, { status: newStatus });
    } catch (error) {
      console.error('Error updating wish status:', error);
    }
  };

  const activeWishes = wishes.filter(wish => wish.status === 'active');

  if (loading) {
    return (
      <div className="flex-1 bg-ios-secondary-background px-4 py-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ios-blue mx-auto mb-4"></div>
          <p className="text-gray-600">加载愿望中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-ios-secondary-background px-4 py-6 overflow-y-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">我的愿望</h1>
          <p className="text-gray-600">管理您的显化目标</p>
        </div>
        <Button
          onClick={() => setShowAddModal(true)}
          className="bg-ios-blue hover:bg-blue-600 rounded-ios px-4 py-2 shadow-ios"
        >
          <Plus className="w-5 h-5 mr-2" />
          添加愿望
        </Button>
      </div>

      {/* Active Wishes */}
      <div className="space-y-4">
        {activeWishes.map((wish) => {
          const CategoryIcon = categoryIcons[wish.category] || Target;
          const categoryColor = categoryColors[wish.category] || 'bg-gray-500';
          const categoryName = categoryNames[wish.category] || '其他';

          return (
            <Card key={wish.id} className="p-6 bg-white border-0 shadow-ios rounded-ios">
              <div className="flex items-start space-x-4">
                <div className={`w-12 h-12 rounded-ios flex items-center justify-center ${categoryColor}`}>
                  <CategoryIcon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="font-semibold text-gray-800">{wish.title}</h3>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                      {categoryName}
                    </span>
                  </div>
                  <p className="text-gray-700 leading-relaxed mb-3">
                    {wish.affirmation}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      创建于 {new Date(wish.createdAt).toLocaleDateString('zh-CN')}
                    </span>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="rounded-ios border-ios-blue text-ios-blue hover:bg-ios-blue hover:text-white"
                      >
                        开始练习
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleStatus(wish)}
                        className="rounded-ios"
                      >
                        {wish.status === 'active' ? '暂停' : '激活'}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {activeWishes.length === 0 && (
        <div className="text-center py-16">
          <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">还没有愿望</h3>
          <p className="text-gray-500 mb-6">创建您的第一个显化目标</p>
          <Button
            onClick={() => setShowAddModal(true)}
            className="bg-ios-blue hover:bg-blue-600 rounded-ios px-6 py-3 shadow-ios"
          >
            <Plus className="w-5 h-5 mr-2" />
            添加愿望
          </Button>
        </div>
      )}

      <AddWishModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddWish}
      />
    </div>
  );
};
