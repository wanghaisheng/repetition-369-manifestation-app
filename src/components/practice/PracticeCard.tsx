
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Clock, Play } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

interface PracticeCardProps {
  period: {
    icon: LucideIcon;
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
    <Card className={`p-4 border-0 shadow-ios rounded-ios transition-all ${
      isActive ? 'ring-2 ring-ios-blue bg-blue-50' : 'bg-white'
    }`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`w-12 h-12 rounded-ios flex items-center justify-center bg-gradient-to-br ${period.color}`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">{period.title}</h3>
            <p className="text-sm text-gray-600">{period.subtitle}</p>
            <div className="flex items-center text-xs text-gray-500 mt-1">
              <Clock className="w-3 h-3 mr-1" />
              {period.time}
            </div>
          </div>
        </div>
        
        {isCompleted ? (
          <div className="flex items-center text-green-600">
            <CheckCircle className="w-5 h-5 mr-1" />
            <span className="text-sm font-medium">已完成</span>
          </div>
        ) : (
          <Button
            onClick={onStartPractice}
            size="sm"
            className={`rounded-ios ${
              isActive 
                ? 'bg-ios-blue text-white hover:bg-ios-blue/90' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Play className="w-4 h-4 mr-1" />
            开始
          </Button>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">进度</span>
          <span className="font-medium text-gray-800">
            {progress.completed}/{progress.target}
          </span>
        </div>
        <Progress 
          value={progressPercentage} 
          className="h-2"
        />
        <p className="text-xs text-gray-500 text-right">
          {Math.round(progressPercentage)}% 完成
        </p>
      </div>
    </Card>
  );
};
