import { m } from '@/paraglide/messages';
import { Target, Award, Activity, Flame } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface StatsCarouselProps {
  totalWishes: number;
  achievedWishes: number;
  totalSessions: number;
  longestStreak: number;
}

export const StatsCarousel = ({
  totalWishes,
  achievedWishes,
  totalSessions,
  longestStreak
}: StatsCarouselProps) => {
  const stats = [
    {
      icon: Target,
      value: totalWishes,
      label: m.app_progress_totalWishes(),
      gradient: 'from-storybook-honey/20 to-storybook-coral/20',
      iconColor: 'text-storybook-honey',
      iconBg: 'bg-storybook-honey/10'
    },
    {
      icon: Award,
      value: achievedWishes,
      label: m.app_progress_achieved(),
      gradient: 'from-storybook-sage/20 to-storybook-sage/10',
      iconColor: 'text-storybook-sage',
      iconBg: 'bg-storybook-sage/10'
    },
    {
      icon: Activity,
      value: totalSessions,
      label: m.app_progress_totalPractices(),
      gradient: 'from-storybook-coral/20 to-storybook-honey/20',
      iconColor: 'text-storybook-coral',
      iconBg: 'bg-storybook-coral/10'
    },
    {
      icon: Flame,
      value: longestStreak,
      label: m.app_progress_longestStreak(),
      gradient: 'from-storybook-honey/20 to-storybook-blush/30',
      iconColor: 'text-storybook-honey',
      iconBg: 'bg-storybook-honey/10'
    }
  ];

  return (
    <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide -mx-4 px-4">
      {stats.map((stat, index) => (
        <Card 
          key={index}
          className={`flex-shrink-0 w-[calc(25%-0.75rem)] min-w-[100px] p-3 border-0 shadow-storybook bg-gradient-to-br ${stat.gradient} backdrop-blur-sm rounded-storybook-lg`}
        >
          <div className="flex flex-col items-center text-center space-y-2">
            <div className={`${stat.iconBg} rounded-storybook p-2`}>
              <stat.icon className={`w-4 h-4 ${stat.iconColor}`} />
            </div>
            <div className="text-xl font-storybook font-bold text-foreground">{stat.value}</div>
            <div className="text-xs text-muted-foreground font-medium">{stat.label}</div>
          </div>
        </Card>
      ))}
    </div>
  );
};
