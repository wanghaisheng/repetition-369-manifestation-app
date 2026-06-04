import { useState, useEffect, useCallback, useRef } from 'react';
import { X, CheckCircle, Sparkles, Heart, ChevronRight, Wind, Sun, Sunset, Moon, Repeat } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Wish, Mood, TimeSlot } from '@/types';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { logger } from '@/utils/logger';

export interface FocusSlotOption {
  slot: TimeSlot;
  target: number;
  completed: number;
}

interface ImmersiveFocusModeProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (entries: string[], mood: Mood) => Promise<void>;
  wish: Wish;
  timeSlot: TimeSlot;
  target: number;
  alreadyCompleted?: number;
  initialEntries?: string[];
  initialDraft?: string;
  onProgress?: (entries: string[], currentEntry: string) => void;
  slotOptions?: FocusSlotOption[];
  onSwitchSlot?: (slot: TimeSlot) => void;
}

const slotGradients = {
  morning: 'from-storybook-honey via-storybook-coral to-storybook-coral',
  afternoon: 'from-storybook-coral via-storybook-coral to-storybook-honey',
  evening: 'from-storybook-sage via-storybook-sage to-storybook-bark/70'
};

export const ImmersiveFocusMode = ({
  isOpen,
  onClose,
  onComplete,
  wish,
  timeSlot,
  target,
  alreadyCompleted = 0,
  initialEntries,
  initialDraft,
  onProgress,
  slotOptions,
  onSwitchSlot,
}: ImmersiveFocusModeProps) => {
  const { t } = useTranslation('app');
  const [currentEntry, setCurrentEntry] = useState(initialDraft ?? '');
  const [entries, setEntries] = useState<string[]>(initialEntries ?? []);
  const [isCompleting, setIsCompleting] = useState(false);
  const [showBreathingGuide, setShowBreathingGuide] = useState(
    !(initialEntries?.length || initialDraft)
  );
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [showCelebration, setShowCelebration] = useState(
    (initialEntries?.length ?? 0) >= target
  );
  const [pendingSwitch, setPendingSwitch] = useState<TimeSlot | null>(null);
  const [celebrateSlot, setCelebrateSlot] = useState<TimeSlot | null>(null);
  const [reflectionText, setReflectionText] = useState('');

  const slotIcon: Record<TimeSlot, typeof Sun> = {
    morning: Sun,
    afternoon: Sunset,
    evening: Moon,
  };

  const slotOrder: TimeSlot[] = ['morning', 'afternoon', 'evening'];

  const reflectionKey = (slot: TimeSlot) =>
    `slot-reflection:${wish.id}:${slot}:${new Date().toISOString().slice(0, 10)}`;

  const findNextIncompleteSlot = (from: TimeSlot): TimeSlot | null => {
    if (!slotOptions) return null;
    const idx = slotOrder.indexOf(from);
    for (let i = 1; i <= slotOrder.length; i++) {
      const s = slotOrder[(idx + i) % slotOrder.length];
      const opt = slotOptions.find(o => o.slot === s);
      if (opt && opt.completed < opt.target) return s;
    }
    return null;
  };

  const requestSwitchSlot = (slot: TimeSlot) => {
    if (slot === timeSlot || !onSwitchSlot) return;
    const opt = slotOptions?.find(o => o.slot === slot);
    if (opt && opt.completed >= opt.target) {
      try { setReflectionText(localStorage.getItem(reflectionKey(slot)) ?? ''); } catch { /* ignore */ }
      setCelebrateSlot(slot);
      return;
    }
    const trimmed = currentEntry.trim();
    const isJustAutoDraft = trimmed.length > 0 && trimmed === (wish.affirmation ?? '').trim();
    const hasUnsaved = entries.length > 0 || (trimmed.length > 0 && !isJustAutoDraft);
    if (hasUnsaved) {
      setPendingSwitch(slot);
    } else {
      onSwitchSlot(slot);
    }
  };

  const switchByOffset = (offset: number) => {
    if (!slotOptions || slotOptions.length === 0 || !onSwitchSlot) return;
    const available = slotOrder.filter(s => slotOptions.some(o => o.slot === s));
    const idx = available.indexOf(timeSlot);
    if (idx === -1) return;
    const next = available[(idx + offset + available.length) % available.length];
    requestSwitchSlot(next);
  };

  const confirmSwitch = () => {
    if (pendingSwitch && onSwitchSlot) onSwitchSlot(pendingSwitch);
    setPendingSwitch(null);
  };

  const saveReflection = (slot: TimeSlot) => {
    try {
      const v = reflectionText.trim();
      if (v) localStorage.setItem(reflectionKey(slot), v);
      else localStorage.removeItem(reflectionKey(slot));
    } catch { /* ignore */ }
  };

  const handleCelebrateNextRound = () => {
    if (!celebrateSlot || !onSwitchSlot) { setCelebrateSlot(null); return; }
    saveReflection(celebrateSlot);
    const next = findNextIncompleteSlot(celebrateSlot);
    setCelebrateSlot(null);
    if (!next || next === timeSlot) return;
    const trimmed = currentEntry.trim();
    const isJustAutoDraft = trimmed.length > 0 && trimmed === (wish.affirmation ?? '').trim();
    const hasUnsaved = entries.length > 0 || (trimmed.length > 0 && !isJustAutoDraft);
    if (hasUnsaved) setPendingSwitch(next);
    else onSwitchSlot(next);
  };

  const handleCelebrateClose = () => {
    if (celebrateSlot) saveReflection(celebrateSlot);
    setCelebrateSlot(null);
  };

  // Keyboard shortcuts: Alt+1/2/3 jump to slot; Alt+ArrowLeft/Right cycle prev/next
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (!e.altKey || e.ctrlKey || e.metaKey) return;
      const map: Record<string, TimeSlot> = { '1': 'morning', '2': 'afternoon', '3': 'evening' };
      if (map[e.key]) { e.preventDefault(); requestSwitchSlot(map[e.key]); return; }
      if (e.key === 'ArrowRight') { e.preventDefault(); switchByOffset(1); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); switchByOffset(-1); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, timeSlot, entries, currentEntry, slotOptions]);

  // Touch swipe: horizontal swipe on the focus mode body switches slot
  const touchRef = useRef<{ x: number; y: number; t: number } | null>(null);
  const onTouchStart = (e: React.TouchEvent) => {
    const tgt = e.target as HTMLElement;
    if (tgt.closest('textarea, input, [role="dialog"], [data-no-swipe]')) return;
    const t0 = e.touches[0];
    touchRef.current = { x: t0.clientX, y: t0.clientY, t: Date.now() };
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const start = touchRef.current;
    touchRef.current = null;
    if (!start) return;
    const end = e.changedTouches[0];
    const dx = end.clientX - start.x;
    const dy = end.clientY - start.y;
    if (Math.abs(dx) < 60 || Math.abs(dy) > 50 || Date.now() - start.t > 600) return;
    switchByOffset(dx < 0 ? 1 : -1);
  };


  const progress = (entries.length / target) * 100;
  const isLastEntry = entries.length === target - 1;
  const slotTotal = Math.min(alreadyCompleted + entries.length, target);
  const slotRemaining = Math.max(target - slotTotal, 0);
  const slotTitleKey = `practice.${timeSlot}Title` as const;

  useEffect(() => {
    if (!showBreathingGuide || !isOpen) return;
    const phases = ['inhale', 'hold', 'exhale'] as const;
    let currentPhaseIndex = 0;
    const interval = setInterval(() => {
      currentPhaseIndex = (currentPhaseIndex + 1) % phases.length;
      setBreathPhase(phases[currentPhaseIndex]);
    }, 2000);
    const timeout = setTimeout(() => setShowBreathingGuide(false), 6000);
    return () => { clearInterval(interval); clearTimeout(timeout); };
  }, [showBreathingGuide, isOpen]);

  useEffect(() => {
    if (isOpen) {
      const startEntries = initialEntries ?? [];
      setEntries(startEntries);
      // Auto-fill draft from the wish affirmation when there's no saved draft
      // and the slot isn't already complete, so users can edit instead of typing from scratch.
      const autoDraft =
        initialDraft && initialDraft.length > 0
          ? initialDraft
          : startEntries.length < target
            ? wish.affirmation ?? ''
            : '';
      setCurrentEntry(autoDraft);
      setShowCelebration(startEntries.length >= target);
      setShowBreathingGuide(!(startEntries.length || initialDraft));
    }
    // Re-init only when opening or when slot/target identity changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, timeSlot, target, wish.id]);

  // Notify parent of draft changes for persistence
  useEffect(() => {
    if (!isOpen || !onProgress) return;
    onProgress(entries, currentEntry);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entries, currentEntry, isOpen]);

  const handleAddEntry = useCallback(() => {
    if (!currentEntry.trim() || entries.length >= target) return;
    const newEntries = [...entries, currentEntry.trim()];
    setEntries(newEntries);
    setCurrentEntry('');
    if (newEntries.length === target) setShowCelebration(true);
  }, [currentEntry, entries, target]);

  const handleComplete = async () => {
    if (entries.length !== target) return;
    setIsCompleting(true);
    try {
      await onComplete(entries, 'good');
    } catch (error) {
      logger.error('Error completing practice', error);
    } finally {
      setIsCompleting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleAddEntry(); }
  };

  if (!isOpen) return null;

  const breathingTexts = {
    inhale: t('practice.breatheIn'),
    hold: t('practice.hold'),
    exhale: t('practice.breatheOut')
  };

  return (
    <div className="fixed inset-0 z-50 bg-background" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      <div className={cn("absolute inset-0 bg-gradient-to-br opacity-10", slotGradients[timeSlot])} />
      <div className="absolute top-20 left-10 w-64 h-64 bg-storybook-honey/5 rounded-blob blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-storybook-coral/5 rounded-blob blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      
      <div className="relative flex items-center justify-between p-4 border-b border-border/50">
        <div className="flex items-center gap-3 min-w-0">
          <div className={cn("w-10 h-10 rounded-storybook flex items-center justify-center flex-shrink-0", `bg-gradient-to-br ${slotGradients[timeSlot]}`)}>
            <Heart className="w-5 h-5 text-white" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="font-storybook font-semibold text-foreground truncate">{t(slotTitleKey)}</h2>
              <span className={cn(
                "text-xs font-semibold px-2 py-0.5 rounded-full text-white bg-gradient-to-r",
                slotGradients[timeSlot]
              )}>
                {slotTotal}/{target}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              {slotRemaining > 0
                ? t('practice.slotRemaining', { defaultValue: '还差 {{count}} 次完成本时段', count: slotRemaining })
                : t('practice.slotDone', { defaultValue: '本时段已完成' })}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          {slotOptions && slotOptions.length > 0 && onSwitchSlot && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="rounded-storybook gap-1.5">
                  <Repeat className="w-4 h-4" />
                  <span className="hidden sm:inline">{t('practice.switchSlot', { defaultValue: '选择时段' })}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="flex items-center justify-between gap-2">
                  <span>{t('practice.switchSlotTitle', { defaultValue: '切换练习时段' })}</span>
                  <span className="text-[10px] font-normal text-muted-foreground hidden sm:inline">
                    {t('practice.switchShortcutHint', { defaultValue: 'Alt+1/2/3 · ← →' })}
                  </span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {slotOptions.map(({ slot, target: tg, completed: cp }) => {
                  const Icon = slotIcon[slot];
                  const done = cp >= tg;
                  const isCurrent = slot === timeSlot;
                  const progress = Math.min(cp / tg, 1);
                  return (
                    <DropdownMenuItem
                      key={slot}
                      onSelect={(e) => { e.preventDefault(); requestSwitchSlot(slot); }}
                      disabled={isCurrent}
                      className={cn(
                        "gap-2.5 cursor-pointer py-3 px-3",
                        done && "bg-storybook-sage/8 focus:bg-storybook-sage/15",
                        isCurrent && "bg-storybook-honey/8 focus:bg-storybook-honey/15 ring-1 ring-storybook-honey/40"
                      )}
                    >
                      <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                        done
                          ? "bg-storybook-sage text-white"
                          : `bg-gradient-to-br ${slotGradients[slot]} text-white`
                      )}>
                        {done ? <CheckCircle className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <span className={cn(
                              "text-sm font-medium",
                              done ? "text-storybook-sage" : "text-foreground"
                            )}>
                              {t(`practice.${slot}Title` as const)}
                            </span>
                            {isCurrent && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-storybook-honey/20 text-storybook-honey font-medium shrink-0">
                                {t('practice.currentSlot')}
                              </span>
                            )}
                          </div>
                          <span className={cn(
                            "text-xs font-semibold tabular-nums shrink-0",
                            done ? "text-storybook-sage" : "text-muted-foreground"
                          )}>
                            {done ? (
                              <span className="inline-flex items-center gap-1">
                                {cp}/{tg} <CheckCircle className="w-3 h-3" />
                              </span>
                            ) : (
                              `${cp}/${tg}`
                            )}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="w-20 h-1.5 rounded-full bg-muted overflow-hidden flex-shrink-0">
                            <div
                              className={cn(
                                "h-full rounded-full transition-all",
                                done ? "bg-storybook-sage" : "bg-storybook-honey"
                              )}
                              style={{ width: `${progress * 100}%` }}
                            />
                          </div>
                          <span className="text-[11px] text-muted-foreground truncate">
                            {t(`practice.${slot}Desc` as const)}
                          </span>
                        </div>
                      </div>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-storybook">
            <X className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <AlertDialog open={pendingSwitch !== null} onOpenChange={(open) => !open && setPendingSwitch(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('practice.switchConfirmTitle', { defaultValue: '切换到其他时段？' })}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('practice.switchConfirmDesc', { defaultValue: '当前书写的内容尚未提交，切换后将会丢失。是否继续？' })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('practice.switchCancel', { defaultValue: '取消' })}</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmSwitch}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t('practice.switchDiscard', { defaultValue: '清空并继续' })}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {(() => {
        const nextSlot = celebrateSlot ? findNextIncompleteSlot(celebrateSlot) : null;
        const isAllDone = celebrateSlot !== null && !nextSlot;
        const category = (wish.category ?? 'other') as string;
        const slotKey = isAllDone ? 'allDone' : (celebrateSlot ?? 'morning');
        const opt = celebrateSlot ? slotOptions?.find(o => o.slot === celebrateSlot) : undefined;
        const tVars = {
          slot: celebrateSlot ? t(`practice.${celebrateSlot}Title` as const) : '',
          completed: opt?.completed ?? 0,
          target: opt?.target ?? 0,
          category: t(`wishes.categories.${category}` as const, { defaultValue: category }),
        };
        const titleKeys = [
          `practice.celebrate.${slotKey}.${category}.title`,
          `practice.celebrate.${slotKey}.default.title`,
          'practice.celebrateTitle',
        ];
        const descKeys = [
          `practice.celebrate.${slotKey}.${category}.desc`,
          `practice.celebrate.${slotKey}.default.desc`,
          'practice.celebrateDesc',
        ];
        return (
      <AlertDialog open={celebrateSlot !== null} onOpenChange={(open) => { if (!open) handleCelebrateClose(); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
                celebrateSlot && `bg-gradient-to-br ${slotGradients[celebrateSlot]}`
              )}>
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <AlertDialogTitle>
                  {t(titleKeys, tVars)}
                </AlertDialogTitle>
                <AlertDialogDescription>
                  {t(descKeys, tVars)}
                </AlertDialogDescription>
              </div>
            </div>
          </AlertDialogHeader>
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">
              {t('practice.reflectionLabel', { defaultValue: '记录一句感受（可选）' })}
            </label>
            <Textarea
              value={reflectionText}
              onChange={(e) => setReflectionText(e.target.value)}
              placeholder={t('practice.reflectionPlaceholder', { defaultValue: '此刻的心情、新的觉察、或一句感恩…' })}
              maxLength={140}
              className="min-h-[80px] resize-none rounded-storybook border-2 focus:border-storybook-honey"
            />
            <div className="text-[11px] text-muted-foreground text-right tabular-nums">
              {reflectionText.length}/140
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCelebrateClose}>
              {t('practice.celebrateStay', { defaultValue: '留在当前时段' })}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCelebrateNextRound}
              disabled={!celebrateSlot || !nextSlot}
              className={cn(
                "gap-1.5",
                celebrateSlot && `bg-gradient-to-r ${slotGradients[celebrateSlot]} hover:opacity-90`
              )}
            >
              <Sparkles className="w-4 h-4" />
              {nextSlot
                ? t('practice.celebrateNextRound', {
                    defaultValue: '开始下一轮：{{slot}}',
                    slot: t(`practice.${nextSlot}Title` as const),
                  })
                : t('practice.celebrateAllDone', { defaultValue: '今日所有时段已完成' })}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
        );
      })()}

      <div className="px-4 py-2"><Progress value={progress} className="h-1.5" /></div>

      <div className="relative flex-1 overflow-y-auto p-4 space-y-6" style={{ height: 'calc(100vh - 140px)' }}>
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
                <p className="text-2xl font-storybook font-light text-foreground animate-fade-in">{breathingTexts[breathPhase]}</p>
                <p className="text-sm text-muted-foreground">{t('practice.prepareYourMind')}</p>
              </div>
              <Button variant="ghost" onClick={() => setShowBreathingGuide(false)} className="text-muted-foreground">
                {t('practice.skipBreathing')}
              </Button>
            </div>
          </div>
        )}

        <div className={cn("relative p-6 rounded-storybook-lg text-center", `bg-gradient-to-br ${slotGradients[timeSlot]}`)}>
          <Sparkles className="w-6 h-6 text-white/80 mx-auto mb-3" />
          <p className="text-lg font-storybook font-medium text-white leading-relaxed">{wish.affirmation}</p>
        </div>

        {!showCelebration && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-foreground">
                {t('practice.writeAffirmation')} #{entries.length + 1}
              </label>
              {isLastEntry && (
                <span className="text-xs text-storybook-honey animate-pulse">{t('practice.lastOne')}</span>
              )}
            </div>
            <Textarea value={currentEntry} onChange={(e) => setCurrentEntry(e.target.value)} onKeyDown={handleKeyDown}
              placeholder={t('practice.writingPlaceholder')}
              className="min-h-[120px] text-base leading-relaxed resize-none border-2 focus:border-storybook-honey rounded-storybook"
              disabled={entries.length >= target} autoFocus={!showBreathingGuide} />
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{currentEntry.length} {t('practice.characters')}</span>
              <Button onClick={handleAddEntry} disabled={!currentEntry.trim() || entries.length >= target}
                className={cn("rounded-storybook", `bg-gradient-to-r ${slotGradients[timeSlot]} hover:opacity-90`)}>
                <CheckCircle className="w-4 h-4 mr-2" />{t('practice.confirmEntry')}<ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        )}

        {entries.length > 0 && !showCelebration && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground">{t('practice.writtenEntries')}</h4>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {entries.map((entry, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-storybook-sage/10 rounded-storybook animate-fade-in">
                  <div className="w-6 h-6 rounded-full bg-storybook-sage flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-sm text-foreground line-clamp-2">{entry}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {showCelebration && (
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="text-center space-y-6 animate-scale-in">
              <div className={cn("w-24 h-24 mx-auto rounded-full flex items-center justify-center animate-pulse",
                `bg-gradient-to-br ${slotGradients[timeSlot]}`)}>
                <Sparkles className="w-12 h-12 text-white" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-storybook font-bold text-foreground">{t('practice.congratulations')}</h2>
                <p className="text-muted-foreground">{t('practice.completedSession')}</p>
              </div>
              <div className="flex items-center justify-center gap-4 text-sm">
                <div className="px-4 py-2 bg-storybook-honey/10 rounded-full">
                  <span className="text-storybook-honey font-medium">+{target * 10} {t('practice.points')}</span>
                </div>
              </div>
              <Button onClick={handleComplete} disabled={isCompleting} size="lg"
                className={cn("rounded-storybook-lg px-8", `bg-gradient-to-r ${slotGradients[timeSlot]} hover:opacity-90`)}>
                {isCompleting ? t('practice.saving') : t('practice.finishSession')}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
