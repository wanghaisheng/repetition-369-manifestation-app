import { useState, useEffect, useCallback } from 'react';
import { X, CheckCircle, Sparkles, Heart, ChevronRight, Wind } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Wish, Mood, TimeSlot } from '@/types';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

interface ImmersiveFocusModeProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (entries: string[], mood: Mood) => Promise<void>;
  wish: Wish;
  timeSlot: TimeSlot;
  target: number;
}

export const ImmersiveFocusMode = ({
  isOpen,
  onClose,
  onComplete,
  wish,
  timeSlot,
  target
}: ImmersiveFocusModeProps) => {
  const { t } = useTranslation('app');
  const [currentEntry, setCurrentEntry] = useState('');
  const [entries, setEntries] = useState<string[]>([]);
  const [isCompleting, setIsCompleting] = useState(false);
  const [showBreathingGuide, setShowBreathingGuide] = useState(true);
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [showCelebration, setShowCelebration] = useState(false);

  const progress = (entries.length / target) * 100;
  const isLastEntry = entries.length === target - 1;

  // Breathing animation cycle
  useEffect(() => {
    if (!showBreathingGuide || !isOpen) return;
    
    const phases = ['inhale', 'hold', 'exhale'] as const;
    let currentPhaseIndex = 0;
    
    const interval = setInterval(() => {
      currentPhaseIndex = (currentPhaseIndex + 1) % phases.length;
      setBreathPhase(phases[currentPhaseIndex]);
    }, 2000);

    // Auto-hide breathing guide after 6 seconds
    const timeout = setTimeout(() => {
      setShowBreathingGuide(false);
    }, 6000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [showBreathingGuide, isOpen]);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setEntries([]);
      setCurrentEntry('');
      setShowCelebration(false);
      setShowBreathingGuide(true);
    }
  }, [isOpen]);

  const handleAddEntry = useCallback(() => {
    if (!currentEntry.trim() || entries.length >= target) return;
    
    const newEntries = [...entries, currentEntry.trim()];
    setEntries(newEntries);
    setCurrentEntry('');
    
    if (newEntries.length === target) {
      setShowCelebration(true);
    }
  }, [currentEntry, entries, target]);

  const handleComplete = async () => {
    if (entries.length !== target) return;
    
    setIsCompleting(true);
    try {
      await onComplete(entries, 'good');
    } catch (error) {
      console.error('Error completing practice:', error);
    } finally {
      setIsCompleting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAddEntry();
    }
  };

  if (!isOpen) return null;

  const breathingTexts = {
    inhale: t('practice.breatheIn', '吸气'),
    hold: t('practice.hold', '屏息'),
    exhale: t('practice.breatheOut', '呼气')
  };

  const slotGradients = {
    morning: 'from-amber-500 via-orange-500 to-rose-500',
    afternoon: 'from-rose-500 via-purple-500 to-indigo-500',
    evening: 'from-indigo-500 via-purple-500 to-violet-600'
  };

  return (
    <div className="fixed inset-0 z-50 bg-background">
      {/* Animated gradient background */}
      <div className={cn(
        "absolute inset-0 bg-gradient-to-br opacity-10",
        slotGradients[timeSlot]
      )} />
      
      {/* Floating orbs for ambiance */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-accent/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      
      {/* Header */}
      <div className="relative flex items-center justify-between p-4 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center",
            `bg-gradient-to-br ${slotGradients[timeSlot]}`
          )}>
            <Heart className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-foreground">
              {t('practice.focusMode', '专注模式')}
            </h2>
            <p className="text-xs text-muted-foreground">
              {entries.length}/{target} {t('practice.affirmationsWritten', '条已书写')}
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="rounded-xl"
        >
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* Progress indicator */}
      <div className="px-4 py-2">
        <Progress value={progress} className="h-1.5" />
      </div>

      {/* Main content */}
      <div className="relative flex-1 overflow-y-auto p-4 space-y-6" style={{ height: 'calc(100vh - 140px)' }}>
        {/* Breathing guide overlay */}
        {showBreathingGuide && (
          <div className="fixed inset-0 z-60 bg-background/95 flex items-center justify-center">
            <div className="text-center space-y-8">
              <div className={cn(
                "w-32 h-32 mx-auto rounded-full flex items-center justify-center transition-all duration-1000",
                `bg-gradient-to-br ${slotGradients[timeSlot]}`,
                breathPhase === 'inhale' && "scale-125",
                breathPhase === 'hold' && "scale-125",
                breathPhase === 'exhale' && "scale-100"
              )}>
                <Wind className="w-12 h-12 text-white" />
              </div>
              <div className="space-y-2">
                <p className="text-2xl font-light text-foreground animate-fade-in">
                  {breathingTexts[breathPhase]}
                </p>
                <p className="text-sm text-muted-foreground">
                  {t('practice.prepareYourMind', '让心灵沉静下来...')}
                </p>
              </div>
              <Button
                variant="ghost"
                onClick={() => setShowBreathingGuide(false)}
                className="text-muted-foreground"
              >
                {t('practice.skipBreathing', '跳过')}
              </Button>
            </div>
          </div>
        )}

        {/* Affirmation display */}
        <div className={cn(
          "relative p-6 rounded-2xl text-center",
          `bg-gradient-to-br ${slotGradients[timeSlot]}`
        )}>
          <Sparkles className="w-6 h-6 text-white/80 mx-auto mb-3" />
          <p className="text-lg font-medium text-white leading-relaxed">
            {wish.affirmation}
          </p>
        </div>

        {/* Writing interface */}
        {!showCelebration && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-foreground">
                {t('practice.writeAffirmation', '书写肯定句')} #{entries.length + 1}
              </label>
              {isLastEntry && (
                <span className="text-xs text-primary animate-pulse">
                  {t('practice.lastOne', '最后一条了!')}
                </span>
              )}
            </div>
            
            <Textarea
              value={currentEntry}
              onChange={(e) => setCurrentEntry(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t('practice.writingPlaceholder', '在这里书写你的肯定句...')}
              className="min-h-[120px] text-base leading-relaxed resize-none border-2 focus:border-primary rounded-xl"
              disabled={entries.length >= target}
              autoFocus={!showBreathingGuide}
            />
            
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                {currentEntry.length} {t('practice.characters', '字符')}
              </span>
              <Button
                onClick={handleAddEntry}
                disabled={!currentEntry.trim() || entries.length >= target}
                className={cn(
                  "rounded-xl",
                  `bg-gradient-to-r ${slotGradients[timeSlot]} hover:opacity-90`
                )}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                {t('practice.confirmEntry', '确认')}
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        )}

        {/* Completed entries timeline */}
        {entries.length > 0 && !showCelebration && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground">
              {t('practice.writtenEntries', '已书写')}
            </h4>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {entries.map((entry, index) => (
                <div 
                  key={index}
                  className="flex items-start gap-3 p-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl animate-fade-in"
                >
                  <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-sm text-foreground line-clamp-2">{entry}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Celebration screen */}
        {showCelebration && (
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="text-center space-y-6 animate-scale-in">
              <div className={cn(
                "w-24 h-24 mx-auto rounded-full flex items-center justify-center",
                `bg-gradient-to-br ${slotGradients[timeSlot]}`,
                "animate-pulse"
              )}>
                <Sparkles className="w-12 h-12 text-white" />
              </div>
              
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-foreground">
                  {t('practice.congratulations', '太棒了!')}
                </h2>
                <p className="text-muted-foreground">
                  {t('practice.completedSession', '你已完成本时段的所有练习')}
                </p>
              </div>
              
              <div className="flex items-center justify-center gap-4 text-sm">
                <div className="px-4 py-2 bg-amber-100 dark:bg-amber-900/30 rounded-full">
                  <span className="text-amber-600 dark:text-amber-400 font-medium">
                    +{target * 10} {t('practice.points', '积分')}
                  </span>
                </div>
              </div>
              
              <Button
                onClick={handleComplete}
                disabled={isCompleting}
                size="lg"
                className={cn(
                  "rounded-2xl px-8",
                  `bg-gradient-to-r ${slotGradients[timeSlot]} hover:opacity-90`
                )}
              >
                {isCompleting 
                  ? t('practice.saving', '保存中...') 
                  : t('practice.finishSession', '完成修行')
                }
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
