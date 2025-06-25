
import { Clock, CheckCircle2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TimeSlot } from '@/types';

interface PracticePhaseProps {
  period: TimeSlot;
  periodInfo: {
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    subtitle: string;
    color: string;
    time: string;
    target: number;
  };
  progress: {
    completed: number;
    target: number;
  };
  isCompleted: boolean;
  selectedWishId: string;
  onStartWriting: () => void;
}

export const PracticePhase = ({
  periodInfo,
  progress,
  isCompleted,
  selectedWishId,
  onStartWriting
}: PracticePhaseProps) => {
  const Icon = periodInfo.icon;

  return (
    <Card className="mb-6 p-6 bg-white border-0 shadow-ios rounded-ios">
      <div className="flex items-center space-x-4 mb-4">
        <div className={`w-16 h-16 rounded-ios bg-gradient-to-br ${periodInfo.color} flex items-center justify-center`}>
          <Icon className="w-8 h-8 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800">{periodInfo.title}</h3>
          <p className="text-gray-600">{periodInfo.subtitle}</p>
          <div className="flex items-center space-x-2 mt-1">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-500">{periodInfo.time}</span>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">进度</span>
          <span className="text-sm text-gray-600">
            {progress.completed} / {progress.target}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full bg-gradient-to-r ${periodInfo.color} transition-all duration-300`}
            style={{ width: `${(progress.completed / progress.target) * 100}%` }}
          />
        </div>
      </div>

      {isCompleted ? (
        <div className="text-center py-4">
          <CheckCircle2 className="w-12 h-12 text-ios-green mx-auto mb-2" />
          <h4 className="font-semibold text-gray-800 mb-1">今日练习已完成！</h4>
          <p className="text-sm text-gray-600">恭喜您完成了{periodInfo.title}</p>
        </div>
      ) : (
        <Button
          onClick={onStartWriting}
          disabled={!selectedWishId}
          className={`w-full bg-gradient-to-r ${periodInfo.color} hover:opacity-90 rounded-ios py-3 shadow-ios disabled:opacity-50`}
        >
          开始书写练习
        </Button>
      )}
    </Card>
  );
};
