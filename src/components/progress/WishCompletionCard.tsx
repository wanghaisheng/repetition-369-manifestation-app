import { Sparkles, Star } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useTranslation } from 'react-i18next';

interface WishCompletionCardProps {
  completionRate: number;
  achievedWishes: number;
  activeWishes: number;
  totalWishes: number;
}

export const WishCompletionCard = ({
  completionRate,
  achievedWishes,
  activeWishes,
  totalWishes
}: WishCompletionCardProps) => {
  const { t } = useTranslation('app');

  return (
    <Card className="border-0 shadow-lg bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 overflow-hidden">
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-amber-500/20 rounded-xl">
              <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            </div>
            <h3 className="font-semibold text-foreground">
              {t('progress.wishCompletion', '愿望实现率')}
            </h3>
          </div>
          <span className="text-xs text-muted-foreground">
            {achievedWishes}/{totalWishes}
          </span>
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">
              {t('progress.completionRate', '完成率')}
            </span>
            <span className="text-xs font-medium text-amber-600 dark:text-amber-400">
              {Math.round(completionRate)}%
            </span>
          </div>
          <Progress value={completionRate} className="h-2" />
          
          <div className="flex justify-between pt-2 border-t border-amber-200/50 dark:border-amber-800/50">
            <div className="flex-1 text-center">
              <div className="flex items-center justify-center gap-1">
                <Star className="w-3 h-3 text-emerald-500 fill-emerald-500" />
                <span className="text-base font-bold text-emerald-600 dark:text-emerald-400">{achievedWishes}</span>
              </div>
              <div className="text-xs text-muted-foreground">{t('progress.achieved', '已实现')}</div>
            </div>
            <div className="w-px bg-amber-200/50 dark:bg-amber-800/50" />
            <div className="flex-1 text-center">
              <div className="text-base font-bold text-primary">{activeWishes}</div>
              <div className="text-xs text-muted-foreground">{t('progress.inProgress', '进行中')}</div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
