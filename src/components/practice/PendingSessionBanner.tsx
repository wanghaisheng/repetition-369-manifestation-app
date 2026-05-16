import { Play, Sparkles, Sun, Sunset, Moon, CheckCircle2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { TimeSlot } from '@/types';
import { cn } from '@/lib/utils';

interface SlotBreakdown {
  slot: TimeSlot;
  completed: number;
  target: number;
}

interface PendingSessionBannerProps {
  nextSlot: TimeSlot;
  remainingSlots: number;
  breakdown: SlotBreakdown[];
  onContinue: () => void;
}

const slotGradient: Record<TimeSlot, string> = {
  morning: 'from-storybook-honey to-storybook-coral',
  afternoon: 'from-storybook-coral to-storybook-honey',
  evening: 'from-storybook-sage to-storybook-bark/70',
};

const slotIcon: Record<TimeSlot, typeof Sun> = {
  morning: Sun,
  afternoon: Sunset,
  evening: Moon,
};

export const PendingSessionBanner = ({
  nextSlot,
  remainingSlots,
  breakdown,
  onContinue,
}: PendingSessionBannerProps) => {
  const { t } = useTranslation('app');

  const slotNames: Record<TimeSlot, string> = {
    morning: t('practice.morningTitle'),
    afternoon: t('practice.afternoonTitle'),
    evening: t('practice.eveningTitle'),
  };

  return (
    <Card className="relative overflow-hidden border-0 shadow-storybook rounded-storybook-lg bg-gradient-to-br from-storybook-cream/80 to-storybook-blush/40">
      <div className="relative p-4 space-y-3">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              'flex-shrink-0 w-12 h-12 rounded-storybook-lg flex items-center justify-center shadow-storybook bg-gradient-to-br text-white',
              slotGradient[nextSlot]
            )}
          >
            <Sparkles className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-storybook font-semibold text-foreground text-sm">
              {t('practice.pendingBanner.title', '未完成的369时段')}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {t('practice.pendingBanner.subtitle', {
                defaultValue: '下一时段：{{slot}} · 共 {{slots}} 个时段待完成',
                slot: slotNames[nextSlot],
                slots: remainingSlots,
              })}
            </p>
          </div>
          <Button
            size="sm"
            onClick={onContinue}
            className={cn(
              'rounded-storybook shadow-storybook text-white bg-gradient-to-r hover:opacity-90 flex-shrink-0',
              slotGradient[nextSlot]
            )}
          >
            <Play className="w-4 h-4 mr-1.5" />
            {t('practice.pendingBanner.continue', '一键继续')}
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-2 pt-1">
          {breakdown.map(({ slot, completed, target }) => {
            const Icon = slotIcon[slot];
            const done = completed >= target;
            const isNext = slot === nextSlot;
            return (
              <div
                key={slot}
                className={cn(
                  'rounded-storybook px-2.5 py-2 bg-background/60 backdrop-blur-sm border transition-colors',
                  isNext ? 'border-storybook-honey/60' : 'border-transparent',
                  done && 'opacity-70'
                )}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <Icon className={cn('w-3.5 h-3.5', done ? 'text-storybook-sage' : 'text-muted-foreground')} />
                  <span className="text-[11px] font-medium text-foreground truncate">{slotNames[slot]}</span>
                  {done && <CheckCircle2 className="w-3 h-3 text-storybook-sage ml-auto" />}
                </div>
                <div className={cn('text-sm font-storybook font-semibold', done ? 'text-storybook-sage' : 'text-foreground')}>
                  {completed}/{target}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
};
