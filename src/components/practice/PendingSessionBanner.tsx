import { Play, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { TimeSlot } from '@/types';
import { cn } from '@/lib/utils';

interface PendingSessionBannerProps {
  nextSlot: TimeSlot;
  completed: number;
  target: number;
  remainingSlots: number;
  onContinue: () => void;
}

const slotGradient: Record<TimeSlot, string> = {
  morning: 'from-storybook-honey to-storybook-coral',
  afternoon: 'from-storybook-coral to-storybook-honey',
  evening: 'from-storybook-sage to-storybook-bark/70',
};

export const PendingSessionBanner = ({
  nextSlot,
  completed,
  target,
  remainingSlots,
  onContinue,
}: PendingSessionBannerProps) => {
  const { t } = useTranslation('app');

  const slotName = {
    morning: t('practice.morningTitle'),
    afternoon: t('practice.afternoonTitle'),
    evening: t('practice.eveningTitle'),
  }[nextSlot];

  return (
    <Card className="relative overflow-hidden border-0 shadow-storybook rounded-storybook-lg bg-gradient-to-br from-storybook-cream/80 to-storybook-blush/40">
      <div className="relative p-4 flex items-center gap-3">
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
          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
            {t('practice.pendingBanner.desc', {
              defaultValue: '下一时段：{{slot}} · 还差 {{remaining}}/{{target}} 次（共 {{slots}} 个时段待完成）',
              slot: slotName,
              remaining: Math.max(target - completed, 0),
              target,
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
    </Card>
  );
};
