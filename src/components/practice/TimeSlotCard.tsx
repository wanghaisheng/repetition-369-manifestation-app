import { m } from '@/paraglide/messages';
import { Sun, Sunset, Moon, Play, CheckCircle, Lock, Clock } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
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
    gradient: 'from-storybook-honey via-storybook-coral to-storybook-coral',
    bgGradient: 'from-storybook-cream/50 to-storybook-blush/30',
    accentColor: 'text-storybook-honey',
    time: '06:00 - 12:00'
  },
  afternoon: {
    icon: Sunset,
    gradient: 'from-storybook-coral via-storybook-coral to-storybook-honey',
    bgGradient: 'from-storybook-blush/30 to-storybook-cream/50',
    accentColor: 'text-storybook-coral',
    time: '12:00 - 18:00'
  },
  evening: {
    icon: Moon,
    gradient: 'from-storybook-sage via-storybook-sage to-storybook-bark/70',
    bgGradient: 'from-storybook-sage/10 to-storybook-cream/30',
    accentColor: 'text-storybook-sage',
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
  const config = slotConfig[slot];
  const Icon = config.icon;
  const isCompleted = completed >= target;
  const progressPercent = target > 0 ? Math.min((completed / target) * 100, 100) : 0;

  const slotNames = {
    morning: m.app_practice_morningTitle(),
    afternoon: m.app_practice_afternoonTitle(),
    evening: m.app_practice_eveningTitle()
  };

  const slotDescriptions = {
    morning: m.app_practice_morningDesc(),
    afternoon: m.app_practice_afternoonDesc(),
    evening: m.app_practice_eveningDesc()
  };

  return (
    <Card 
      className={cn(
        "relative overflow-hidden border-0 shadow-storybook transition-all duration-300 rounded-storybook-lg",
        isActive && !isCompleted && "ring-2 ring-storybook-honey/50 scale-[1.02]",
        isCompleted && "opacity-80",
        `bg-gradient-to-br ${config.bgGradient}`
      )}
    >
      {isCompleted && (
        <div className="absolute inset-0 bg-storybook-sage/10 z-10" />
      )}
      
      <div className="relative p-4">
        <div className="flex items-start gap-4">
          <div className={cn(
            "relative flex-shrink-0 w-14 h-14 rounded-storybook-lg flex items-center justify-center",
            `bg-gradient-to-br ${config.gradient}`,
            "shadow-storybook"
          )}>
            <Icon className="w-7 h-7 text-white" />
            {isCompleted && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-storybook-sage rounded-full flex items-center justify-center shadow-md">
                <CheckCircle className="w-3.5 h-3.5 text-white" />
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-storybook font-semibold text-foreground">{slotNames[slot]}</h3>
              {isActive && !isCompleted && (
                <span className="text-xs font-medium px-2 py-0.5 bg-storybook-honey/20 text-storybook-honey rounded-full">
                  {m.app_practice_currentSlot()}
                </span>
              )}
            </div>
            
            <p className="text-sm text-muted-foreground mb-2 line-clamp-1">{slotDescriptions[slot]}</p>
            
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
              <Clock className="w-3 h-3" />
              <span>{config.time}</span>
              <span className="text-muted-foreground/50">·</span>
              <span>{target}× {m.app_practice_affirmations()}</span>
            </div>
            
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">{m.app_practice_progress()}</span>
                <span className={cn("text-xs font-medium", config.accentColor)}>{completed}/{target}</span>
              </div>
              <Progress value={progressPercent} className="h-2" />
            </div>
          </div>
        </div>
        
        <div className="mt-4 flex justify-end">
          {isCompleted ? (
            <div className="flex items-center gap-1.5 text-sm font-medium text-storybook-sage">
              <CheckCircle className="w-4 h-4" />
              <span>{m.app_practice_completedLabel()}</span>
            </div>
          ) : isLocked ? (
            <Button variant="outline" size="sm" disabled className="rounded-storybook">
              <Lock className="w-4 h-4 mr-1.5" />
              {m.app_practice_locked()}
            </Button>
          ) : (
            <Button 
              size="sm" 
              onClick={onStart}
              className={cn(
                "rounded-storybook shadow-storybook transition-all",
                `bg-gradient-to-r ${config.gradient} hover:opacity-90`,
                "text-white"
              )}
            >
              <Play className="w-4 h-4 mr-1.5" />
              {m.app_practice_startNow()}
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};
