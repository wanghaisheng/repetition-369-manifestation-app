
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Achievement } from '@/services/AchievementService';
import { AchievementBadge } from './AchievementBadge';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Trophy } from 'lucide-react';

interface AchievementNotificationProps {
  achievement: Achievement | null;
  onClose: () => void;
}

export const AchievementNotification = ({ achievement, onClose }: AchievementNotificationProps) => {
  const { t } = useTranslation('app');
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (achievement) {
      setIsVisible(true); setIsAnimating(true);
      const timer = setTimeout(() => handleClose(), 5000);
      return () => clearTimeout(timer);
    }
  }, [achievement]);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => { setIsVisible(false); onClose(); }, 300);
  };

  if (!achievement || !isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <Card className={`max-w-sm w-full p-6 bg-card border-0 shadow-storybook-hover rounded-storybook-lg transform transition-all duration-300 ${
        isAnimating ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
      }`}>
        <div className="text-center">
          <Button onClick={handleClose} variant="ghost" size="sm"
            className="absolute top-2 right-2 w-8 h-8 p-0 text-muted-foreground hover:text-foreground">
            <X className="w-4 h-4" />
          </Button>

          <div className="mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-storybook-honey to-storybook-coral rounded-full flex items-center justify-center mx-auto mb-3 animate-bounce">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-storybook font-bold text-foreground mb-1">🎉 {t('achievement.unlocked')}</h3>
            <p className="text-sm text-muted-foreground">{t('achievement.newAchievement')}</p>
          </div>

          <div className="mb-6">
            <AchievementBadge achievement={achievement} size="large" showDetails={true} />
          </div>

          {achievement.reward.points > 0 && (
            <div className="mb-4 p-3 bg-storybook-honey/10 rounded-storybook">
              <div className="text-storybook-honey font-semibold text-lg">
                +{achievement.reward.points} {t('achievement.pointsReward')}
              </div>
              {achievement.reward.unlocks && achievement.reward.unlocks.length > 0 && (
                <div className="text-sm text-muted-foreground mt-1">
                  {t('achievement.unlockFeatures')}: {achievement.reward.unlocks.join(', ')}
                </div>
              )}
            </div>
          )}

          <Button onClick={handleClose}
            className="w-full bg-gradient-to-r from-storybook-honey to-storybook-coral text-white hover:opacity-90 rounded-storybook py-3">
            {t('achievement.awesome')}
          </Button>
        </div>
      </Card>
    </div>
  );
};
