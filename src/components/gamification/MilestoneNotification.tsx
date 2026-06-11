import { m } from '@/paraglide/messages';

import { useState, useEffect } from 'react';
import { StreakMilestone } from '@/services/StreakService';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Flame, Star } from 'lucide-react';

interface MilestoneNotificationProps {
  milestones: StreakMilestone[];
  onClose: () => void;
}

export const MilestoneNotification = ({ milestones, onClose }: MilestoneNotificationProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (milestones.length > 0) {
      setIsVisible(true); setIsAnimating(true); setCurrentIndex(0);
      const timer = setTimeout(() => handleClose(), 4000 + (milestones.length * 1000));
      return () => clearTimeout(timer);
    }
  }, [milestones]);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => { setIsVisible(false); onClose(); }, 300);
  };

  const handleNext = () => {
    if (currentIndex < milestones.length - 1) setCurrentIndex(currentIndex + 1);
    else handleClose();
  };

  if (!isVisible || milestones.length === 0) return null;
  const currentMilestone = milestones[currentIndex];

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
            <div className="w-16 h-16 bg-gradient-to-br from-storybook-coral to-storybook-honey rounded-full flex items-center justify-center mx-auto mb-3 animate-bounce">
              <Flame className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-storybook font-bold text-foreground mb-1">
              🔥 {m.app_milestone_title()}
            </h3>
            <p className="text-sm text-muted-foreground">{m.app_milestone_subtitle()}</p>
          </div>

          <div className="mb-6">
            <div className="text-4xl font-storybook font-bold text-storybook-coral mb-2">{currentMilestone.days}</div>
            <div className="text-lg font-storybook font-semibold text-foreground mb-1">{currentMilestone.reward.title}</div>
            <div className="text-sm text-muted-foreground">{m.app_milestone_consecutiveDays({ days: currentMilestone.days })}</div>
          </div>

          <div className="mb-4 p-3 bg-storybook-honey/10 rounded-storybook">
            <div className="flex items-center justify-center space-x-2 text-storybook-honey font-semibold text-lg">
              <Star className="w-5 h-5" />
              <span>+{currentMilestone.reward.points} {m.app_milestone_pointsReward()}</span>
            </div>
          </div>

          {milestones.length > 1 && (
            <div className="flex justify-center space-x-2 mb-4">
              {milestones.map((_, index) => (
                <div key={index} className={`w-2 h-2 rounded-full ${index === currentIndex ? 'bg-storybook-coral' : 'bg-muted'}`} />
              ))}
            </div>
          )}

          <Button onClick={handleNext}
            className="w-full bg-gradient-to-r from-storybook-coral to-storybook-honey text-white hover:opacity-90 rounded-storybook py-3">
            {currentIndex < milestones.length - 1 ? m.app_milestone_next() : m.app_milestone_awesome()}
          </Button>
        </div>
      </Card>
    </div>
  );
};
