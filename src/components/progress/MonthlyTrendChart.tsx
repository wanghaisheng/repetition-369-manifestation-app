import { BarChart3 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';
import { MonthlyStats } from '@/types';
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent,
  type ChartConfig 
} from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';

interface MonthlyTrendChartProps {
  monthlyStats: MonthlyStats[];
}

const chartConfig = {
  practices: {
    label: "练习次数",
    color: "hsl(var(--primary))"
  },
  completed: {
    label: "完成目标",
    color: "hsl(var(--manifest-gold))"
  }
} satisfies ChartConfig;

export const MonthlyTrendChart = ({ monthlyStats }: MonthlyTrendChartProps) => {
  const { t } = useTranslation('app');

  if (!monthlyStats || monthlyStats.length === 0) {
    return null;
  }

  const chartData = monthlyStats.slice(-4).map(stat => ({
    month: stat.month.replace('月', ''),
    practices: stat.practices,
    completed: stat.completed
  }));

  return (
    <Card className="border-0 shadow-lg bg-card overflow-hidden">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-500/10 rounded-xl">
              <BarChart3 className="w-4 h-4 text-indigo-500" />
            </div>
            <h3 className="font-semibold text-foreground">
              {t('progress.monthlyTrend', '月度趋势')}
            </h3>
          </div>
        </div>
        
        <ChartContainer config={chartConfig} className="h-[140px] w-full">
          <BarChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
            <XAxis 
              dataKey="month" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
              width={30}
            />
            <ChartTooltip 
              content={<ChartTooltipContent />}
              cursor={{ fill: 'hsl(var(--muted)/0.3)' }}
            />
            <Bar 
              dataKey="practices" 
              fill="hsl(var(--primary))" 
              radius={[4, 4, 0, 0]}
              maxBarSize={24}
            />
          </BarChart>
        </ChartContainer>

        {/* Legend */}
        <div className="flex items-center justify-center gap-4 mt-3 pt-3 border-t border-border/50">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-sm bg-primary" />
            <span className="text-xs text-muted-foreground">
              {t('progress.practiceCount', '练习次数')}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};
