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
import { logger } from '@/utils/logger';
import { m } from '@/paraglide/messages';

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
      setEntries([]); setCurrentEntry(''); setShowCelebration(false); setPointsEarned(0); setStreakUpdated(false);
    }
  }, [isOpen]);

  const handleAddEntry = () => {
    if (currentEntry.trim() && entries.length < period.target) {
      setEntries([...entries, currentEntry.trim()]);
      setCurrentEntry('');
      if (entries.length + 1 === period.target) setShowCelebration(true);
    }
  };

  const handleComplete = async () => {
    if (entries.length === period.target) {
      setIsCompleting(true);
      try {
        await onComplete(entries, 'good');
        const basePoints = await addPoints('completeWriting', entries.length, m.app_focusMode_completedPractice({ title: period.title }));
        let totalPoints = basePoints;
        const wasStreakUpdated = await updateStreak();
        if (wasStreakUpdated) setStreakUpdated(true);
        await checkAchievements();
        setPointsEarned(totalPoints);
        setTimeout(() => onClose(), 2000);
      } catch (error) {
        logger.error('Error completing practice', error);
        setIsCompleting(false);
      }
    }
  };

  const progress = (entries.length / period.target) * 100;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg bg-card rounded-storybook-lg border-0 shadow-storybook-hover">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-storybook font-semibold text-foreground">{period.title}</DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose} className="rounded-storybook">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          <div className="p-4 bg-gradient-to-r from-storybook-honey/5 to-storybook-coral/5 rounded-storybook">
            <h3 className="font-medium text-foreground mb-1">{m.app_focusMode_yourWish()}</h3>
            <p className="text-muted-foreground">{wish.affirmation}</p>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-muted-foreground">{m.app_focusMode_progressLabel()}: {entries.length}/{period.target}</span>
              <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              {m.app_focusMode_writeEntry({ count: entries.length + 1 })}
            </label>
            <Textarea value={currentEntry} onChange={(e) => setCurrentEntry(e.target.value)}
              placeholder={m.app_focusMode_writePlaceholder()}
              className="min-h-24 rounded-storybook border-border focus:ring-2 focus:ring-storybook-honey focus:border-transparent"
              disabled={entries.length >= period.target} />
            <Button onClick={handleAddEntry} disabled={!currentEntry.trim() || entries.length >= period.target}
              className="mt-3 bg-gradient-to-r from-storybook-honey to-storybook-coral text-white rounded-storybook">
              {m.app_focusMode_addEntry({ count: entries.length + 1 })}
            </Button>
          </div>

          {entries.length > 0 && (
            <div className="max-h-40 overflow-y-auto space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">{m.app_focusMode_completedEntries()}</h4>
              {entries.map((entry, index) => (
                <div key={index} className="flex items-start space-x-2 p-2 bg-storybook-sage/10 rounded-storybook">
                  <CheckCircle className="w-4 h-4 text-storybook-sage mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground flex-1">{entry}</p>
                </div>
              ))}
            </div>
          )}

          {showCelebration && (
            <div className="text-center p-4 bg-gradient-to-r from-storybook-honey/10 to-storybook-coral/10 rounded-storybook">
              <Sparkles className="w-8 h-8 text-storybook-honey mx-auto mb-2" />
              <p className="text-lg font-storybook font-semibold text-foreground mb-1">{m.app_focusMode_congratulations()}</p>
              <p className="text-sm text-muted-foreground mb-3">{m.app_focusMode_completedSession({ target: period.target })}</p>
              <div className="flex items-center justify-center space-x-4 text-sm">
                <div className="flex items-center space-x-1 text-storybook-honey">
                  <Star className="w-4 h-4" />
                  <span>{m.app_focusMode_pointsEarned({ points: period.target * 10 })}</span>
                </div>
                {streakUpdated && (
                  <div className="flex items-center space-x-1 text-storybook-coral">
                    <Flame className="w-4 h-4" />
                    <span>{m.app_focusMode_streakUpdated()}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {entries.length === period.target && (
            <Button onClick={handleComplete} disabled={isCompleting}
              className="w-full bg-gradient-to-r from-storybook-sage to-storybook-honey text-white rounded-storybook">
              {isCompleting ? m.app_focusMode_savingProgress() : m.app_focusMode_completePractice()}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
