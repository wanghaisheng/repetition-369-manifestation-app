
import React from 'react';
import { CircularProgress } from './CircularProgress';
import { AnimatedCounter } from './AnimatedCounter';
import { PointsService } from '@/services/PointsService';

interface LevelProgressProps {
  level: number;
  totalPoints: number;
  pointsToNextLevel: number;
  variant?: 'default' | 'compact';
  className?: string;
}

export const LevelProgress = ({
  level,
  totalPoints,
  pointsToNextLevel,
  variant = 'default',
  className = ''
}: LevelProgressProps) => {
  const levelName = PointsService.getLevelName(level);
  const levelColor = PointsService.getLevelColor(level);
  
  // Calculate progress percentage
  const currentLevelBase = level > 1 ? 
    [0, 500, 1500, 5000, 15000, 30000, 60000, 100000][level - 1] || 0 : 0;
  const nextLevelPoints = currentLevelBase + pointsToNextLevel;
  const currentLevelPoints = totalPoints - currentLevelBase;
  const levelTotalPoints = nextLevelPoints - currentLevelBase;
  const progressPercentage = levelTotalPoints > 0 ? 
    (currentLevelPoints / levelTotalPoints) * 100 : 100;

  if (variant === 'compact') {
    return (
      <div className={`flex items-center space-x-3 ${className}`}>
        <CircularProgress
          value={progressPercentage}
          size={50}
          strokeWidth={6}
          color="url(#levelGradient)"
          backgroundColor="#e2e8f0"
        >
          <div className="text-xs font-bold text-gray-700">
            L{level}
          </div>
        </CircularProgress>
        
        <div className="flex-1 min-w-0">
          <div className={`text-sm font-semibold ${levelColor} truncate`}>
            {levelName}
          </div>
          <div className="text-xs text-gray-500">
            还需 <AnimatedCounter value={pointsToNextLevel} /> 点数升级
          </div>
        </div>

        <svg width="0" height="0">
          <defs>
            <linearGradient id="levelGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#667eea" />
              <stop offset="100%" stopColor="#764ba2" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    );
  }

  return (
    <div className={`text-center ${className}`}>
      <div className="relative mb-4">
        <CircularProgress
          value={progressPercentage}
          size={120}
          strokeWidth={10}
          color="url(#levelGradient)"
          backgroundColor="#e2e8f0"
        >
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-800">
              {level}
            </div>
            <div className="text-xs text-gray-500">
              等级
            </div>
          </div>
        </CircularProgress>
      </div>

      <div className={`text-lg font-bold ${levelColor} mb-2`}>
        {levelName}
      </div>
      
      <div className="text-sm text-gray-600 space-y-1">
        <div>
          总点数: <AnimatedCounter value={totalPoints} className="font-semibold" />
        </div>
        {pointsToNextLevel > 0 ? (
          <div>
            升级还需: <AnimatedCounter value={pointsToNextLevel} className="font-semibold text-ios-blue" />
          </div>
        ) : (
          <div className="text-manifest-gold font-semibold">
            已达到最高等级！
          </div>
        )}
      </div>

      <svg width="0" height="0">
        <defs>
          <linearGradient id="levelGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#667eea" />
            <stop offset="100%" stopColor="#764ba2" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};
