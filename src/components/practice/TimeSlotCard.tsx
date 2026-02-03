import { Sun, Sunset, Moon, Play, CheckCircle, Lock, Clock } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useTranslation } from 'react-i18next';
import { TimeSlot } from '@/types';
import { cn } from '@/lib/utils';

interface TimeSlotCardProps {
  slot: TimeSlot;
  completed: number;
  target: number;
  isActive: boolean;
  isLocked: boolean;
  onStart: () => void;
}

const slotConfig = {
  morning: {
    icon: Sun,
    gradient: 'from-amber-400 via-orange-400 to-rose-400',
    bgGradient: 'from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30',
    accentColor: 'text-amber-600 dark:text-amber-400',
    time: '06:00 - 12:00'
  },
  afternoon: {
    icon: Sunset,
    gradient: 'from-orange-400 via-rose-400 to-purple-400',
    bgGradient: 'from-orange-50 to-rose-50 dark:from-orange-950/30 dark:to-rose-950/30',
    accentColor: 'text-rose-600 dark:text-rose-400',
    time: '12:00 - 18:00'
  },
  evening: {
    icon: Moon,
    gradient: 'from-indigo-400 via-purple-400 to-violet-500',
    bgGradient: 'from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30',
    accentColor: 'text-indigo-600 dark:text-indigo-400',
    time: '18:00 - 24:00'
  }
};

export const TimeSlotCard = ({
  slot,
  completed,
  target,
  isActive,
  isLocked,
  onStart
}: TimeSlotCardProps) => {
  const { t } = useTranslation('app');
  const config = slotConfig[slot];
  const Icon = config.icon;
  const isCompleted = completed >= target;
  const progressPercent = target > 0 ? Math.min((completed / target) * 100, 100) : 0;

  const slotNames = {
    morning: t('practice.morningTitle', '晨间修行'),
    afternoon: t('practice.afternoonTitle', '午间修行'),
    evening: t('practice.eveningTitle', '晚间修行')
  };

  const slotDescriptions = {
    morning: t('practice.morningDesc', '以清澈的意念开启新的一天'),
    afternoon: t('practice.afternoonDesc', '在繁忙中保持内心的专注'),
    evening: t('practice.eveningDesc', '带着感恩的心迎接夜晚')
  };

  return (
    <Card 
      className={cn(
        "relative overflow-hidden border-0 shadow-lg transition-all duration-300",
        isActive && !isCompleted && "ring-2 ring-primary/50 scale-[1.02]",
        isCompleted && "opacity-80",
        `bg-gradient-to-br ${config.bgGradient}`
      )}
    >
      {/* Completed overlay */}
      {isCompleted && (
        <div className="absolute inset-0 bg-emerald-500/10 z-10" />
      )}
      
      <div className="relative p-4">
        <div className="flex items-start gap-4">
          {/* Icon with gradient background */}
          <div className={cn(
            "relative flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center",
            `bg-gradient-to-br ${config.gradient}`,
            "shadow-lg"
          )}>
            <Icon className="w-7 h-7 text-white" />
            {isCompleted && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center shadow-md">
                <CheckCircle className="w-3.5 h-3.5 text-white" />
              </div>
            )}
          </div>
          
          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-semibold text-foreground">
                {slotNames[slot]}
              </h3>
              {isActive && !isCompleted && (
                <span className="text-xs font-medium px-2 py-0.5 bg-primary/20 text-primary rounded-full">
                  {t('practice.currentSlot', '当前时段')}
                </span>
              )}
            </div>
            
            <p className="text-sm text-muted-foreground mb-2 line-clamp-1">
              {slotDescriptions[slot]}
            </p>
            
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
              <Clock className="w-3 h-3" />
              <span>{config.time}</span>
              <span className="text-muted-foreground/50">·</span>
              <span>{target}× {t('practice.affirmations', '肯定句')}</span>
            </div>
            
            {/* Progress bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">
                  {t('practice.progress', '进度')}
                </span>
                <span className={cn("text-xs font-medium", config.accentColor)}>
                  {completed}/{target}
                </span>
              </div>
              <Progress value={progressPercent} className="h-2" />
            </div>
          </div>
        </div>
        
        {/* Action button */}
        <div className="mt-4 flex justify-end">
          {isCompleted ? (
            <div className="flex items-center gap-1.5 text-sm font-medium text-emerald-600 dark:text-emerald-400">
              <CheckCircle className="w-4 h-4" />
              <span>{t('practice.completedLabel', '已完成')}</span>
            </div>
          ) : isLocked ? (
            <Button variant="outline" size="sm" disabled className="rounded-xl">
              <Lock className="w-4 h-4 mr-1.5" />
              {t('practice.locked', '未到时间')}
            </Button>
          ) : (
            <Button 
              size="sm" 
              onClick={onStart}
              className={cn(
                "rounded-xl shadow-md transition-all",
                `bg-gradient-to-r ${config.gradient} hover:opacity-90`,
                "text-white"
              )}
            >
              <Play className="w-4 h-4 mr-1.5" />
              {t('practice.startNow', '开始修行')}
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};
