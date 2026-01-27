import { TrendingUp, Award, Flame, Calendar } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

interface QuickStatsRowProps {
  weeklyPractices: number;
  totalPractices: number;
}

export const QuickStatsRow = ({ weeklyPractices, totalPractices }: QuickStatsRowProps) => {
  return (
    <div className="grid grid-cols-2 gap-3 mb-4">
      <StatCard
        icon={TrendingUp}
        value={weeklyPractices}
        label="本周练习"
        iconBg="bg-emerald-500/10"
        iconColor="text-emerald-500"
      />
      <StatCard
        icon={Award}
        value={totalPractices}
        label="累计练习"
        iconBg="bg-amber-500/10"
        iconColor="text-amber-500"
      />
    </div>
  );
};

interface StatCardProps {
  icon: LucideIcon;
  value: number;
  label: string;
  iconBg: string;
  iconColor: string;
}

const StatCard = ({ icon: Icon, value, label, iconBg, iconColor }: StatCardProps) => (
  <div className="bg-card rounded-xl p-4 shadow-sm border border-border/50">
    <div className="flex items-center gap-3">
      <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center`}>
        <Icon className={`w-5 h-5 ${iconColor}`} />
      </div>
      <div>
        <div className="text-lg font-bold text-foreground">{value}</div>
        <div className="text-xs text-muted-foreground">{label}</div>
      </div>
    </div>
  </div>
);
