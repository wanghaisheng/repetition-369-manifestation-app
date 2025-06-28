
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Clock, Target, Zap } from 'lucide-react';

interface PracticeCardProps {
  period: {
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
  isActive: boolean;
  isCompleted: boolean;
  onStartPractice: () => void;
}

export const PracticeCard = ({
  period,
  progress,
  isActive,
  isCompleted,
  onStartPractice
}: PracticeCardProps) => {
  const Icon = period.icon;
  const progressPercentage = (progress.completed / progress.target) * 100;

  return (
    <Card className={`p-6 border-0 shadow-ios rounded-ios transition-all duration-300 ${
      isActive ? 'ring-2 ring-blue-500 ring-opacity-50 scale-[1.02]' : ''
    } ${isCompleted ? 'bg-green-50' : 'bg-white'}`}>
      <div className="flex items-start space-x-4 mb-4">
        <div className={`w-16 h-16 rounded-ios bg-gradient-to-br ${period.color} flex items-center justify-center shadow-lg`}>
          <Icon className="w-8 h-8 text-white" />
        </div>
        
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <h3 className="text-lg font-semibold text-gray-800">{period.title}</h3>
            {isActive && (
              <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                当前时段
              </span>
            )}
            {isCompleted && (
              <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                已完成
              </span>
            )}
          </div>
          <p className="text-gray-600 mb-2">{period.subtitle}</p>
          
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{period.time}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Target className="w-4 h-4" />
              <span>{period.target}次</span>
            </div>
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
        <Progress 
          value={progressPercentage} 
          className="h-2"
        />
      </div>

      {/* Action Button */}
      {isCompleted ? (
        <div className="text-center py-3">
          <div className="text-green-600 text-sm font-medium">🎉 今日练习已完成</div>
        </div>
      ) : (
        <Button
          onClick={onStartPractice}
          className={`w-full bg-gradient-to-r ${period.color} hover:opacity-90 rounded-ios py-3 shadow-ios`}
        >
          <Zap className="w-4 h-4 mr-2" />
          {progress.completed > 0 ? '继续练习' : '开始专注练习'}
        </Button>
      )}
    </Card>
  );
};
