
import { useState, useEffect } from 'react';
import { StreakMilestone } from '@/services/StreakService';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Flame, Star } from 'lucide-react';

interface MilestoneNotificationProps {
  milestones: StreakMilestone[];
  onClose: () => void;
}

export const MilestoneNotification = ({ 
  milestones, 
  onClose 
}: MilestoneNotificationProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (milestones.length > 0) {
      setIsVisible(true);
      setIsAnimating(true);
      setCurrentIndex(0);
      
      // Auto close after showing all milestones
      const timer = setTimeout(() => {
        handleClose();
      }, 4000 + (milestones.length * 1000));

      return () => clearTimeout(timer);
    }
  }, [milestones]);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, 300);
  };

  const handleNext = () => {
    if (currentIndex < milestones.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      handleClose();
    }
  };

  if (!isVisible || milestones.length === 0) return null;

  const currentMilestone = milestones[currentIndex];

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
            <div className="w-16 h-16 bg-gradient-to-br from-ios-orange to-red-500 rounded-full flex items-center justify-center mx-auto mb-3 animate-bounce">
              <Flame className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-1">
              🔥 连击里程碑！
            </h3>
            <p className="text-sm text-gray-600">
              恭喜达成连击成就
            </p>
          </div>

          {/* 里程碑详情 */}
          <div className="mb-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-ios-orange mb-2">
                {currentMilestone.days}
              </div>
              <div className="text-lg font-semibold text-gray-800 mb-1">
                {currentMilestone.reward.title}
              </div>
              <div className="text-sm text-gray-600">
                连续练习 {currentMilestone.days} 天
              </div>
            </div>
          </div>

          {/* 奖励信息 */}
          <div className="mb-4 p-3 bg-manifest-gold/10 rounded-ios">
            <div className="flex items-center justify-center space-x-2 text-manifest-gold font-semibold text-lg">
              <Star className="w-5 h-5" />
              <span>+{currentMilestone.reward.points} 点数奖励</span>
            </div>
          </div>

          {/* 进度指示器 */}
          {milestones.length > 1 && (
            <div className="flex justify-center space-x-2 mb-4">
              {milestones.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    index === currentIndex ? 'bg-ios-orange' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          )}

          {/* 确认按钮 */}
          <Button
            onClick={handleNext}
            className="w-full bg-gradient-to-r from-ios-orange to-red-500 hover:opacity-90 rounded-ios py-3"
          >
            {currentIndex < milestones.length - 1 ? '下一个' : '太棒了！'}
          </Button>
        </div>
      </Card>
    </div>
  );
};
