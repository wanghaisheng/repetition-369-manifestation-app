import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { X, CheckCircle, Sparkles, Star, Flame } from 'lucide-react';
import { Wish, Mood } from '@/types';
import { usePoints } from '@/hooks/usePoints';
import { useStreak } from '@/hooks/useStreak';
import { useAchievements } from '@/hooks/useAchievements';
import { useAuth } from '@/contexts/AuthContext';

interface FocusModeProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (entries: string[], mood: Mood) => Promise<void>;
  wish: Wish;
  period: {
    title: string;
    target: number;
    color: string;
  };
}

export const FocusMode = ({ isOpen, onClose, onComplete, wish, period }: FocusModeProps) => {
  const [currentEntry, setCurrentEntry] = useState('');
  const [entries, setEntries] = useState<string[]>([]);
  const [isCompleting, setIsCompleting] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [pointsEarned, setPointsEarned] = useState(0);
  const [streakUpdated, setStreakUpdated] = useState(false);
  
  const { user } = useAuth();
  const { addPoints } = usePoints(user?.id || 'default');
  const { updateStreak } = useStreak(user?.id || 'default');
  const { checkAchievements } = useAchievements(user?.id || 'default');

  useEffect(() => {
    if (isOpen) {
      setEntries([]);
      setCurrentEntry('');
      setShowCelebration(false);
      setPointsEarned(0);
      setStreakUpdated(false);
    }
  }, [isOpen]);

  const handleAddEntry = () => {
    if (currentEntry.trim() && entries.length < period.target) {
      setEntries([...entries, currentEntry.trim()]);
      setCurrentEntry('');
      
      if (entries.length + 1 === period.target) {
        setShowCelebration(true);
      }
    }
  };

  const handleComplete = async () => {
    if (entries.length === period.target) {
      setIsCompleting(true);
      try {
        // Complete the practice first
        await onComplete(entries, 'good');
        
        // Award points for completing writing
        const basePoints = await addPoints('completeWriting', entries.length, `完成${period.title}练习`);
        let totalPoints = basePoints;
        
        // Update streak
        const wasStreakUpdated = await updateStreak();
        if (wasStreakUpdated) {
          setStreakUpdated(true);
        }
        
        // Check for daily goal completion (if all periods done today)
        // This would need to be implemented based on today's total progress
        
        // Check achievements
        await checkAchievements();
        
        setPointsEarned(totalPoints);
        
        // Keep celebration modal open for a moment to show rewards
        setTimeout(() => {
          onClose();
        }, 2000);
        
      } catch (error) {
        console.error('Error completing practice:', error);
        setIsCompleting(false);
      }
    }
  };

  const progress = (entries.length / period.target) * 100;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg bg-white rounded-ios border-0 shadow-ios">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold text-gray-800">
              {period.title}
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="rounded-ios"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* 愿望显示 */}
          <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-ios">
            <h3 className="font-medium text-gray-800 mb-1">您的愿望</h3>
            <p className="text-gray-700">{wish.affirmation}</p>
          </div>

          {/* 进度显示 */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">
                进度: {entries.length}/{period.target}
              </span>
              <span className="text-sm text-gray-500">
                {Math.round(progress)}%
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* 输入区域 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              第 {entries.length + 1} 次书写
            </label>
            <Textarea
              value={currentEntry}
              onChange={(e) => setCurrentEntry(e.target.value)}
              placeholder={`请书写您的愿望肯定句...`}
              className="min-h-24 rounded-ios border-gray-200 focus:ring-2 focus:ring-ios-blue focus:border-transparent"
              disabled={entries.length >= period.target}
            />
            <Button
              onClick={handleAddEntry}
              disabled={!currentEntry.trim() || entries.length >= period.target}
              className="mt-3 bg-gradient-to-r from-manifest-warm-gold to-manifest-lavender text-white rounded-ios"
            >
              添加第 {entries.length + 1} 次
            </Button>
          </div>

          {/* 已完成的条目 */}
          {entries.length > 0 && (
            <div className="max-h-40 overflow-y-auto space-y-2">
              <h4 className="text-sm font-medium text-gray-700">已完成:</h4>
              {entries.map((entry, index) => (
                <div key={index} className="flex items-start space-x-2 p-2 bg-green-50 rounded-ios">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-700 flex-1">{entry}</p>
                </div>
              ))}
            </div>
          )}

          {/* 庆祝动画和奖励显示 */}
          {showCelebration && (
            <div className="text-center p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-ios">
              <Sparkles className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
              <p className="text-lg font-semibold text-gray-800 mb-1">恭喜完成!</p>
              <p className="text-sm text-gray-600 mb-3">您已完成本时段的{period.target}次练习</p>
              
              {/* 奖励预览 */}
              <div className="flex items-center justify-center space-x-4 text-sm">
                <div className="flex items-center space-x-1 text-manifest-gold">
                  <Star className="w-4 h-4" />
                  <span>+{period.target * 10} 点数</span>
                </div>
                {streakUpdated && (
                  <div className="flex items-center space-x-1 text-ios-orange">
                    <Flame className="w-4 h-4" />
                    <span>连击更新</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 完成按钮 */}
          {entries.length === period.target && (
            <Button
              onClick={handleComplete}
              disabled={isCompleting}
              className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-ios"
            >
              {isCompleting ? '保存中...' : '完成练习'}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
