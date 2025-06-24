
import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface PracticeTimerProps {
  targetCount: number;
  currentCount: number;
  onComplete: () => void;
  onTick?: (remainingTime: number) => void;
  timePerRep?: number; // 每次书写建议时间（秒）
}

export const PracticeTimer = ({ 
  targetCount, 
  currentCount, 
  onComplete, 
  onTick, 
  timePerRep = 30 
}: PracticeTimerProps) => {
  const [isRunning, setIsRunning] = useState(false);
  const [currentTime, setCurrentTime] = useState(timePerRep);
  const [currentRep, setCurrentRep] = useState(1);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const remainingReps = targetCount - currentCount;
  const totalTimeNeeded = remainingReps * timePerRep;

  useEffect(() => {
    if (isRunning && currentTime > 0) {
      intervalRef.current = setInterval(() => {
        setCurrentTime(prev => {
          const newTime = prev - 1;
          onTick?.(newTime);
          
          if (newTime === 0) {
            // 一次完成，准备下一次
            if (currentRep < remainingReps) {
              setCurrentRep(prev => prev + 1);
              return timePerRep; // 重置时间
            } else {
              // 全部完成
              setIsRunning(false);
              onComplete();
              return 0;
            }
          }
          
          return newTime;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, currentTime, currentRep, remainingReps, timePerRep, onComplete, onTick]);

  const handleStart = () => {
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setCurrentTime(timePerRep);
    setCurrentRep(1);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((timePerRep - currentTime) / timePerRep) * 100;

  if (remainingReps === 0) {
    return (
      <Card className="p-6 bg-ios-green/10 border-ios-green/20">
        <div className="text-center">
          <div className="w-16 h-16 bg-ios-green rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-ios-green mb-2">练习已完成！</h3>
          <p className="text-sm text-gray-600">恭喜您完成了所有 {targetCount} 次练习</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-white border-0 shadow-ios rounded-ios">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">369练习计时器</h3>
        <p className="text-sm text-gray-600">
          第 {currentRep} / {remainingReps} 次 · 每次建议 {timePerRep} 秒
        </p>
      </div>

      {/* 圆形进度指示器 */}
      <div className="relative w-32 h-32 mx-auto mb-6">
        <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
          {/* 背景圆 */}
          <circle
            cx="60"
            cy="60"
            r="54"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-gray-200"
          />
          {/* 进度圆 */}
          <circle
            cx="60"
            cy="60"
            r="54"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={`${2 * Math.PI * 54}`}
            strokeDashoffset={`${2 * Math.PI * 54 * (1 - progress / 100)}`}
            className="text-ios-blue transition-all duration-1000 ease-linear"
            strokeLinecap="round"
          />
        </svg>
        
        {/* 中心时间显示 */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-800">
              {formatTime(currentTime)}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              剩余时间
            </div>
          </div>
        </div>
      </div>

      {/* 总体进度 */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">总进度</span>
          <span className="text-sm font-medium text-gray-800">
            {currentCount + currentRep - 1} / {targetCount}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-ios-blue h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentCount + currentRep - 1) / targetCount) * 100}%` }}
          />
        </div>
      </div>

      {/* 控制按钮 */}
      <div className="flex justify-center space-x-4">
        {!isRunning ? (
          <Button
            onClick={handleStart}
            className="bg-ios-blue hover:bg-ios-blue/90 rounded-ios px-8 py-3"
          >
            <Play className="w-4 h-4 mr-2" />
            开始
          </Button>
        ) : (
          <Button
            onClick={handlePause}
            variant="outline"
            className="border-ios-blue text-ios-blue hover:bg-ios-blue/10 rounded-ios px-8 py-3"
          >
            <Pause className="w-4 h-4 mr-2" />
            暂停
          </Button>
        )}
        
        <Button
          onClick={handleReset}
          variant="outline"
          className="border-gray-300 text-gray-600 hover:bg-gray-50 rounded-ios px-6 py-3"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          重置
        </Button>
      </div>

      {/* 提示信息 */}
      <div className="mt-4 p-3 bg-gray-50 rounded-ios">
        <p className="text-xs text-gray-600 text-center">
          💡 建议在计时器提醒下专注书写，每次书写要用心感受愿望的能量
        </p>
      </div>
    </Card>
  );
};
