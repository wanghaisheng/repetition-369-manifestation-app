import { m } from '@/paraglide/messages';

import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface PracticeTimerProps {
  targetCount: number;
  currentCount: number;
  onComplete: () => void;
  onTick?: (remainingTime: number) => void;
  timePerRep?: number;
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
            if (currentRep < remainingReps) {
              setCurrentRep(prev => prev + 1);
              return timePerRep;
            } else {
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
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isRunning, currentTime, currentRep, remainingReps, timePerRep, onComplete, onTick]);

  const handleStart = () => setIsRunning(true);
  const handlePause = () => setIsRunning(false);
  const handleReset = () => { setIsRunning(false); setCurrentTime(timePerRep); setCurrentRep(1); };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((timePerRep - currentTime) / timePerRep) * 100;

  if (remainingReps === 0) {
    return (
      <Card className="p-6 bg-storybook-sage/10 border-storybook-sage/20 rounded-storybook-lg">
        <div className="text-center">
          <div className="w-16 h-16 bg-storybook-sage rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-lg font-storybook font-semibold text-storybook-sage mb-2">{m.app_practiceTimer_completed()}</h3>
          <p className="text-sm text-muted-foreground">{m.app_practiceTimer_completedDesc({ count: targetCount })}</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-card border-0 shadow-storybook rounded-storybook-lg">
      <div className="text-center mb-6">
        <h3 className="text-lg font-storybook font-semibold text-foreground mb-2">{m.app_practiceTimer_title()}</h3>
        <p className="text-sm text-muted-foreground">
          {m.app_practiceTimer_repProgress({ current: currentRep, total: remainingReps, seconds: timePerRep })}
        </p>
      </div>

      <div className="relative w-32 h-32 mx-auto mb-6">
        <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="54" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-muted/30" />
          <circle cx="60" cy="60" r="54" stroke="currentColor" strokeWidth="8" fill="transparent"
            strokeDasharray={`${2 * Math.PI * 54}`}
            strokeDashoffset={`${2 * Math.PI * 54 * (1 - progress / 100)}`}
            className="text-storybook-honey transition-all duration-1000 ease-linear"
            strokeLinecap="round" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">{formatTime(currentTime)}</div>
            <div className="text-xs text-muted-foreground mt-1">{m.app_practiceTimer_remaining()}</div>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-muted-foreground">{m.app_practiceTimer_totalProgress()}</span>
          <span className="text-sm font-medium text-foreground">{currentCount + currentRep - 1} / {targetCount}</span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div className="bg-storybook-honey h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentCount + currentRep - 1) / targetCount) * 100}%` }} />
        </div>
      </div>

      <div className="flex justify-center space-x-4">
        {!isRunning ? (
          <Button onClick={handleStart} className="bg-storybook-honey hover:bg-storybook-honey/90 text-white rounded-storybook px-8 py-3">
            <Play className="w-4 h-4 mr-2" />
            {m.app_practiceTimer_start()}
          </Button>
        ) : (
          <Button onClick={handlePause} variant="outline" className="border-storybook-honey text-storybook-honey hover:bg-storybook-honey/10 rounded-storybook px-8 py-3">
            <Pause className="w-4 h-4 mr-2" />
            {m.app_practiceTimer_pause()}
          </Button>
        )}
        <Button onClick={handleReset} variant="outline" className="border-border text-muted-foreground hover:bg-muted rounded-storybook px-6 py-3">
          <RotateCcw className="w-4 h-4 mr-2" />
          {m.app_practiceTimer_reset()}
        </Button>
      </div>

      <div className="mt-4 p-3 bg-storybook-cream/50 rounded-storybook">
        <p className="text-xs text-muted-foreground text-center">
          💡 {m.app_practiceTimer_tip()}
        </p>
      </div>
    </Card>
  );
};
