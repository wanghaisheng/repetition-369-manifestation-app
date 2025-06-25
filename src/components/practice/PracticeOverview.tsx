
import { CheckCircle2, Circle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { TimeSlot } from '@/types';

interface PracticeOverviewProps {
  periods: Record<TimeSlot, {
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    subtitle: string;
    color: string;
    time: string;
    target: number;
  }>;
  todayProgress: Record<TimeSlot, {
    completed: number;
    target: number;
  }>;
  currentPeriod: TimeSlot;
}

export const PracticeOverview = ({
  periods,
  todayProgress,
  currentPeriod
}: PracticeOverviewProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">今日总览</h3>
      {Object.entries(periods).map(([periodKey, period]) => {
        const Icon = period.icon;
        const progress = todayProgress[periodKey as keyof typeof todayProgress];
        const isCurrentPeriod = periodKey === currentPeriod;
        const isPeriodCompleted = progress.completed >= progress.target;

        return (
          <Card 
            key={periodKey} 
            className={`p-4 border-0 shadow-ios rounded-ios ${
              isCurrentPeriod ? 'ring-2 ring-ios-blue ring-opacity-50' : ''
            }`}
          >
            <div className="flex items-center space-x-4">
              <div className={`w-12 h-12 rounded-ios bg-gradient-to-br ${period.color} flex items-center justify-center`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <h4 className="font-medium text-gray-800">{period.title}</h4>
                  {isCurrentPeriod && (
                    <span className="text-xs bg-ios-blue text-white px-2 py-1 rounded-full">
                      当前
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-4 mt-1">
                  <span className="text-sm text-gray-600">
                    {progress.completed} / {progress.target}
                  </span>
                  <div className="flex space-x-1">
                    {Array.from({ length: progress.target }, (_, i) => (
                      <div key={i}>
                        {i < progress.completed ? (
                          <CheckCircle2 className="w-4 h-4 text-ios-green" />
                        ) : (
                          <Circle className="w-4 h-4 text-gray-300" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              {isPeriodCompleted && (
                <CheckCircle2 className="w-6 h-6 text-ios-green" />
              )}
            </div>
          </Card>
        );
      })}
    </div>
  );
};
