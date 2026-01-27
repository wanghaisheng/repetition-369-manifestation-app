import { Sparkles, Clock } from 'lucide-react';
import { Wish } from '@/types';

interface Practice {
  id: string;
  wishId: string;
  timeSlot: 'morning' | 'afternoon' | 'evening';
  completedCount: number;
  date: Date | string;
}

interface RecentActivityProps {
  practices: Practice[];
  wishes: Wish[];
}

const timeSlotLabels = {
  morning: '早晨',
  afternoon: '下午',
  evening: '晚间',
};

const timeSlotColors = {
  morning: 'bg-amber-500/10 text-amber-600',
  afternoon: 'bg-blue-500/10 text-blue-600',
  evening: 'bg-violet-500/10 text-violet-600',
};

export const RecentActivity = ({ practices, wishes }: RecentActivityProps) => {
  if (practices.length === 0) return null;

  return (
    <div className="bg-card rounded-2xl p-5 shadow-sm border border-border/50">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-4 h-4 text-muted-foreground" />
        <h2 className="font-semibold text-foreground">今日活动</h2>
      </div>
      
      <div className="space-y-3">
        {practices.slice(0, 3).map((practice) => {
          const wish = wishes.find(w => w.id === practice.wishId);
          
          return (
            <div 
              key={practice.id} 
              className="flex items-center gap-3 p-3 rounded-xl bg-secondary/30"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="font-medium text-foreground text-sm truncate">
                  {wish?.title || '未知愿望'}
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className={`text-xs px-1.5 py-0.5 rounded-md ${timeSlotColors[practice.timeSlot]}`}>
                    {timeSlotLabels[practice.timeSlot]}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {practice.completedCount} 次
                  </span>
                </div>
              </div>
              
              <div className="text-xs text-muted-foreground">
                {new Date(practice.date).toLocaleTimeString('zh-CN', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
