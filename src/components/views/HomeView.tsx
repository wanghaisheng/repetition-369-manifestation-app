
import { useState, useEffect } from 'react';
import { Target, TrendingUp, Calendar, Heart, Zap, Award, Plus } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useWishes } from '@/hooks/useWishes';
import { usePractice } from '@/hooks/usePractice';
import { useProgress } from '@/hooks/useProgress';
import { AddWishModal } from '@/components/modals/AddWishModal';
import { useToast } from '@/hooks/use-toast';

export const HomeView = () => {
  const { wishes, loading: wishesLoading, error: wishesError, createWish, refetch } = useWishes();
  const { todayPractices, loading: practiceLoading, error: practiceError } = usePractice();
  const { progress, loading: progressLoading, error: progressError, getTodayStats, getWeeklyStats } = useProgress();
  const { toast } = useToast();
  const [isAddWishModalOpen, setIsAddWishModalOpen] = useState(false);

  const activeWishes = wishes.filter(wish => wish.status === 'active');
  const todayStats = getTodayStats();
  const weeklyStats = getWeeklyStats();

  // Calculate today's progress
  const todayProgress = todayPractices.length > 0 && activeWishes.length > 0 ? 
    Math.min((todayPractices.reduce((sum, p) => sum + p.completedCount, 0) / (activeWishes.length * 18)) * 100, 100) : 0;

  // Show loading only if all hooks are still loading
  const isLoading = wishesLoading && practiceLoading && progressLoading;

  // Check for errors but don't block the UI
  const hasErrors = wishesError || practiceError || progressError;

  // Handle creating a new wish
  const handleAddWish = async (wishData: any) => {
    try {
      await createWish(wishData);
      toast({
        title: "愿望创建成功",
        description: "您的愿望已添加，可以开始练习了！",
      });
      setIsAddWishModalOpen(false);
      refetch(); // Refresh wishes data
    } catch (error) {
      toast({
        title: "创建失败",
        description: "创建愿望时出现错误，请重试",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 bg-ios-secondary-background px-4 py-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ios-blue mx-auto mb-4"></div>
          <p className="text-gray-600">加载数据中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-ios-secondary-background px-4 py-4 overflow-y-auto">
      {/* Error Alert */}
      {hasErrors && (
        <Card className="p-4 bg-red-50 border-red-200 mb-6">
          <p className="text-red-700 text-sm">数据加载时遇到问题，但您仍可以正常使用应用</p>
        </Card>
      )}

      {/* New User Welcome */}
      {activeWishes.length === 0 && (
        <Card className="p-8 bg-gradient-to-br from-blue-50 to-purple-50 border-0 shadow-ios rounded-ios mb-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-manifest-warm-gold to-manifest-lavender rounded-ios flex items-center justify-center mx-auto mb-4">
              <Target className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">开始您的显化之旅</h2>
            <p className="text-gray-600 mb-6">使用369显化法，将您的愿望变为现实。创建您的第一个愿望，开始每日练习。</p>
            <Button 
              onClick={() => setIsAddWishModalOpen(true)}
              className="bg-gradient-to-r from-manifest-warm-gold to-manifest-lavender text-white rounded-ios px-6 py-3 shadow-ios"
            >
              <Plus className="w-5 h-5 mr-2" />
              创建第一个愿望
            </Button>
          </div>
        </Card>
      )}

      {/* Today's Progress - Only show if user has wishes */}
      {activeWishes.length > 0 && (
        <Card className="p-6 bg-white border-0 shadow-ios rounded-ios mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-0">今日进度</h2>
            <div className="bg-ios-blue/10 rounded-full p-2">
              <Target className="w-5 h-5 text-ios-blue" />
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">完成进度</span>
                <span className="text-sm font-medium text-gray-800">{Math.round(todayProgress)}%</span>
              </div>
              <Progress value={todayProgress} className="h-2" />
            </div>
            
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
              <div className="text-center">
                <div className="text-lg font-bold text-ios-blue">{activeWishes.length}</div>
                <div className="text-xs text-gray-600">活跃愿望</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-manifest-gold">{todayPractices.length}</div>
                <div className="text-xs text-gray-600">今日练习</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-ios-green">{todayStats?.consecutiveDays || 0}</div>
                <div className="text-xs text-gray-600">连续天数</div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Card className="p-4 bg-white border-0 shadow-ios rounded-ios">
          <div className="flex items-center space-x-3">
            <div className="bg-ios-green/10 rounded-full p-2">
              <TrendingUp className="w-5 h-5 text-ios-green" />
            </div>
            <div>
              <div className="text-lg font-bold text-gray-800">
                {weeklyStats?.sessionsCompleted || 0}
              </div>
              <div className="text-sm text-gray-600">本周练习</div>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-white border-0 shadow-ios rounded-ios">
          <div className="flex items-center space-x-3">
            <div className="bg-manifest-gold/10 rounded-full p-2">
              <Award className="w-5 h-5 text-manifest-gold" />
            </div>
            <div>
              <div className="text-lg font-bold text-gray-800">
                {progress?.totalSessions || 0}
              </div>
              <div className="text-sm text-gray-600">总练习数</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className={`p-6 bg-white border-0 shadow-ios rounded-ios ${todayPractices.length > 0 ? 'mb-6' : ''}`}>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">快速操作</h2>
        <div className="space-y-3">
          {activeWishes.length > 0 ? (
            <Button className="w-full bg-ios-blue hover:bg-blue-600 text-white rounded-ios shadow-ios">
              <Zap className="w-5 h-5 mr-2" />
              开始369练习
            </Button>
          ) : (
            <Button 
              onClick={() => setIsAddWishModalOpen(true)}
              className="w-full bg-gradient-to-r from-manifest-warm-gold to-manifest-lavender text-white rounded-ios shadow-ios"
            >
              <Plus className="w-5 h-5 mr-2" />
              创建第一个愿望
            </Button>
          )}
          <Button 
            variant="outline" 
            className="w-full border-ios-blue text-ios-blue hover:bg-ios-blue hover:text-white rounded-ios"
          >
            <Target className="w-5 h-5 mr-2" />
            查看所有愿望
          </Button>
        </div>
      </Card>

      {/* Recent Activity - Only show if user has practices */}
      {todayPractices.length > 0 && (
        <Card className="p-6 bg-white border-0 shadow-ios rounded-ios">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">今日活动</h2>
          <div className="space-y-3">
            {todayPractices.slice(0, 3).map((practice) => {
              const wish = wishes.find(w => w.id === practice.wishId);
              return (
                <div key={practice.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-ios">
                  <div className="bg-ios-blue/10 rounded-full p-2">
                    <Heart className="w-4 h-4 text-ios-blue" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-800">{wish?.title || '未知愿望'}</div>
                    <div className="text-sm text-gray-600">
                      {practice.timeSlot === 'morning' ? '早上' : 
                       practice.timeSlot === 'afternoon' ? '下午' : '晚上'} · 
                      完成 {practice.completedCount} 次
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(practice.date).toLocaleTimeString('zh-CN', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Add Wish Modal */}
      <AddWishModal
        isOpen={isAddWishModalOpen}
        onClose={() => setIsAddWishModalOpen(false)}
        onAdd={handleAddWish}
      />
    </div>
  );
};
