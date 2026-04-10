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
import { useTranslation } from 'react-i18next';
import { logger } from '@/utils/logger';

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
  const { t } = useTranslation('app');
  
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
        await onComplete(entries, 'good');
        
        const basePoints = await addPoints('completeWriting', entries.length, t('focusMode.completedPractice', { title: period.title }));
        let totalPoints = basePoints;
        
        const wasStreakUpdated = await updateStreak();
        if (wasStreakUpdated) {
          setStreakUpdated(true);
        }
        
        await checkAchievements();
        
        setPointsEarned(totalPoints);
        
        setTimeout(() => {
          onClose();
        }, 2000);
        
      } catch (error) {
        logger.error('Error completing practice', error);
        setIsCompleting(false);
      }
    }
  };

  const progress = (entries.length / period.target) * 100;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg bg-card rounded-ios border-0 shadow-ios">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold text-foreground">
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
          {/* Wish display */}
          <div className="p-4 bg-gradient-to-r from-primary/5 to-accent/5 rounded-ios">
            <h3 className="font-medium text-foreground mb-1">{t('focusMode.yourWish')}</h3>
            <p className="text-muted-foreground">{wish.affirmation}</p>
          </div>

          {/* Progress */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-muted-foreground">
                {t('focusMode.progressLabel')}: {entries.length}/{period.target}
              </span>
              <span className="text-sm text-muted-foreground">
                {Math.round(progress)}%
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Input area */}
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              {t('focusMode.writeEntry', { count: entries.length + 1 })}
            </label>
            <Textarea
              value={currentEntry}
              onChange={(e) => setCurrentEntry(e.target.value)}
              placeholder={t('focusMode.writePlaceholder')}
              className="min-h-24 rounded-ios border-border focus:ring-2 focus:ring-primary focus:border-transparent"
              disabled={entries.length >= period.target}
            />
            <Button
              onClick={handleAddEntry}
              disabled={!currentEntry.trim() || entries.length >= period.target}
              className="mt-3 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-ios"
            >
              {t('focusMode.addEntry', { count: entries.length + 1 })}
            </Button>
          </div>

          {/* Completed entries */}
          {entries.length > 0 && (
            <div className="max-h-40 overflow-y-auto space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">{t('focusMode.completedEntries')}</h4>
              {entries.map((entry, index) => (
                <div key={index} className="flex items-start space-x-2 p-2 bg-success/10 rounded-ios">
                  <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground flex-1">{entry}</p>
                </div>
              ))}
            </div>
          )}

          {/* Celebration */}
          {showCelebration && (
            <div className="text-center p-4 bg-gradient-to-r from-warning/10 to-accent/10 rounded-ios">
              <Sparkles className="w-8 h-8 text-warning mx-auto mb-2" />
              <p className="text-lg font-semibold text-foreground mb-1">{t('focusMode.congratulations')}</p>
              <p className="text-sm text-muted-foreground mb-3">
                {t('focusMode.completedSession', { target: period.target })}
              </p>
              
              <div className="flex items-center justify-center space-x-4 text-sm">
                <div className="flex items-center space-x-1 text-warning">
                  <Star className="w-4 h-4" />
                  <span>{t('focusMode.pointsEarned', { points: period.target * 10 })}</span>
                </div>
                {streakUpdated && (
                  <div className="flex items-center space-x-1 text-accent">
                    <Flame className="w-4 h-4" />
                    <span>{t('focusMode.streakUpdated')}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Complete button */}
          {entries.length === period.target && (
            <Button
              onClick={handleComplete}
              disabled={isCompleting}
              className="w-full bg-gradient-to-r from-success to-primary text-primary-foreground rounded-ios"
            >
              {isCompleting ? t('focusMode.savingProgress') : t('focusMode.completePractice')}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
