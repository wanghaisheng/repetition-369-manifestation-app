
import { useState } from 'react';
import { Plus, Heart, Target, Briefcase, Home as HomeIcon, Smile } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AddWishModal } from '@/components/modals/AddWishModal';

export const WishesView = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [wishes, setWishes] = useState([
    {
      id: 1,
      title: '获得理想工作',
      category: 'career',
      affirmation: '我正在吸引一份完美符合我技能和热情的工作，它带给我成就感和丰厚的回报。',
      createdAt: new Date('2024-01-01'),
      isActive: true
    },
    {
      id: 2,
      title: '身体健康',
      category: 'health',
      affirmation: '我的身体充满活力和健康，每一天我都感受到生命的美好和充沛的能量。',
      createdAt: new Date('2024-01-02'),
      isActive: true
    }
  ]);

  const categoryIcons = {
    career: Briefcase,
    health: Heart,
    relationship: Smile,
    wealth: Target,
    home: HomeIcon
  };

  const categoryColors = {
    career: 'bg-ios-blue',
    health: 'bg-ios-green',
    relationship: 'bg-ios-pink',
    wealth: 'bg-manifest-gold',
    home: 'bg-ios-purple'
  };

  const categoryNames = {
    career: '事业',
    health: '健康',
    relationship: '感情',
    wealth: '财富',
    home: '家庭'
  };

  const handleAddWish = (newWish: any) => {
    const wish = {
      ...newWish,
      id: Date.now(),
      createdAt: new Date(),
      isActive: true
    };
    setWishes([...wishes, wish]);
  };

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
        {wishes.filter(wish => wish.isActive).map((wish) => {
          const CategoryIcon = categoryIcons[wish.category as keyof typeof categoryIcons];
          const categoryColor = categoryColors[wish.category as keyof typeof categoryColors];
          const categoryName = categoryNames[wish.category as keyof typeof categoryNames];

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
                      创建于 {wish.createdAt.toLocaleDateString('zh-CN')}
                    </span>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="rounded-ios border-ios-blue text-ios-blue hover:bg-ios-blue hover:text-white"
                    >
                      开始练习
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {wishes.length === 0 && (
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
