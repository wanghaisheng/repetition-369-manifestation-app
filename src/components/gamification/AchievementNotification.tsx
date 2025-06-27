
import { useState, useEffect } from 'react';
import { Achievement } from '@/services/AchievementService';
import { AchievementBadge } from './AchievementBadge';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Trophy } from 'lucide-react';

interface AchievementNotificationProps {
  achievement: Achievement | null;
  onClose: () => void;
}

export const AchievementNotification = ({ 
  achievement, 
  onClose 
}: AchievementNotificationProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (achievement) {
      setIsVisible(true);
      setIsAnimating(true);
      
      // 自动关闭
      const timer = setTimeout(() => {
        handleClose();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [achievement]);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, 300);
  };

  if (!achievement || !isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <Card className={`max-w-sm w-full p-6 bg-white border-0 shadow-2xl rounded-ios transform transition-all duration-300 ${
        isAnimating ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
      }`}>
        <div className="text-center">
          {/* 关闭按钮 */}
          <Button
            onClick={handleClose}
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2 w-8 h-8 p-0 text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </Button>

          {/* 庆祝标题 */}
          <div className="mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-manifest-gold to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-3 animate-bounce">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-1">
              🎉 成就解锁！
            </h3>
            <p className="text-sm text-gray-600">
              恭喜您获得新成就
            </p>
          </div>

          {/* 成就详情 */}
          <div className="mb-6">
            <AchievementBadge 
              achievement={achievement} 
              size="large" 
              showDetails={true}
            />
          </div>

          {/* 奖励信息 */}
          {achievement.reward.points > 0 && (
            <div className="mb-4 p-3 bg-manifest-gold/10 rounded-ios">
              <div className="text-manifest-gold font-semibold text-lg">
                +{achievement.reward.points} 点数奖励
              </div>
              {achievement.reward.unlocks && achievement.reward.unlocks.length > 0 && (
                <div className="text-sm text-gray-600 mt-1">
                  解锁功能: {achievement.reward.unlocks.join(', ')}
                </div>
              )}
            </div>
          )}

          {/* 确认按钮 */}
          <Button
            onClick={handleClose}
            className="w-full bg-gradient-to-r from-manifest-warm-gold to-manifest-gold hover:opacity-90 rounded-ios py-3"
          >
            太棒了！
          </Button>
        </div>
      </Card>
    </div>
  );
};
