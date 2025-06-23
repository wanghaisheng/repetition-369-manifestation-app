
import { useState, useEffect } from 'react';
import { Sunrise, Sun, Moon, Clock, CheckCircle2, Circle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

export const PracticeView = () => {
  const [currentPeriod, setCurrentPeriod] = useState<'morning' | 'afternoon' | 'evening'>('morning');
  const [todayProgress, setTodayProgress] = useState({
    morning: { completed: 0, target: 3 },
    afternoon: { completed: 0, target: 6 },
    evening: { completed: 0, target: 9 }
  });
  const [currentText, setCurrentText] = useState('');
  const [isWriting, setIsWriting] = useState(false);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) {
      setCurrentPeriod('morning');
    } else if (hour < 18) {
      setCurrentPeriod('afternoon');
    } else {
      setCurrentPeriod('evening');
    }
  }, []);

  const periods = {
    morning: {
      icon: Sunrise,
      title: '早晨练习',
      subtitle: '书写 3 次',
      color: 'from-manifest-warm-gold to-yellow-500',
      time: '6:00 - 12:00'
    },
    afternoon: {
      icon: Sun,
      title: '下午练习',
      subtitle: '书写 6 次',
      color: 'from-ios-blue to-blue-600',
      time: '12:00 - 18:00'
    },
    evening: {
      icon: Moon,
      title: '晚间练习',
      subtitle: '书写 9 次',
      color: 'from-manifest-lavender to-purple-500',
      time: '18:00 - 24:00'
    }
  };

  const currentPeriodInfo = periods[currentPeriod];
  const currentProgress = todayProgress[currentPeriod];
  const isCompleted = currentProgress.completed >= currentProgress.target;

  const handleSubmitWriting = () => {
    if (currentText.trim()) {
      setTodayProgress(prev => ({
        ...prev,
        [currentPeriod]: {
          ...prev[currentPeriod],
          completed: Math.min(prev[currentPeriod].completed + 1, prev[currentPeriod].target)
        }
      }));
      setCurrentText('');
      setIsWriting(false);
    }
  };

  const getCurrentAffirmation = () => {
    return "我正在吸引一份完美符合我技能和热情的工作，它带给我成就感和丰厚的回报。";
  };

  return (
    <div className="flex-1 bg-ios-secondary-background px-4 py-6 overflow-y-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">369练习</h1>
        <p className="text-gray-600">专注书写，显化愿望</p>
      </div>

      {/* Current Period Status */}
      <Card className="mb-6 p-6 bg-white border-0 shadow-ios rounded-ios">
        <div className="flex items-center space-x-4 mb-4">
          <div className={`w-16 h-16 rounded-ios bg-gradient-to-br ${currentPeriodInfo.color} flex items-center justify-center`}>
            <currentPeriodInfo.icon className="w-8 h-8 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-800">{currentPeriodInfo.title}</h3>
            <p className="text-gray-600">{currentPeriodInfo.subtitle}</p>
            <div className="flex items-center space-x-2 mt-1">
              <Clock className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-500">{currentPeriodInfo.time}</span>
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">进度</span>
            <span className="text-sm text-gray-600">
              {currentProgress.completed} / {currentProgress.target}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full bg-gradient-to-r ${currentPeriodInfo.color} transition-all duration-300`}
              style={{ width: `${(currentProgress.completed / currentProgress.target) * 100}%` }}
            />
          </div>
        </div>

        {isCompleted ? (
          <div className="text-center py-4">
            <CheckCircle2 className="w-12 h-12 text-ios-green mx-auto mb-2" />
            <h4 className="font-semibold text-gray-800 mb-1">今日练习已完成！</h4>
            <p className="text-sm text-gray-600">恭喜您完成了{currentPeriodInfo.title}</p>
          </div>
        ) : (
          <Button
            onClick={() => setIsWriting(true)}
            className={`w-full bg-gradient-to-r ${currentPeriodInfo.color} hover:opacity-90 rounded-ios py-3 shadow-ios`}
          >
            开始书写练习
          </Button>
        )}
      </Card>

      {/* Writing Interface */}
      {isWriting && (
        <Card className="mb-6 p-6 bg-white border-0 shadow-ios rounded-ios">
          <div className="mb-4">
            <h4 className="font-semibold text-gray-800 mb-2">当前肯定句</h4>
            <div className="bg-gray-50 p-4 rounded-ios">
              <p className="text-gray-700 leading-relaxed">{getCurrentAffirmation()}</p>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              书写区域 ({currentProgress.completed + 1} / {currentProgress.target})
            </label>
            <Textarea
              value={currentText}
              onChange={(e) => setCurrentText(e.target.value)}
              placeholder="在这里书写您的肯定句..."
              className="rounded-ios border-ios-gray-medium min-h-[120px] text-lg leading-relaxed"
            />
          </div>

          <div className="flex space-x-3">
            <Button
              onClick={handleSubmitWriting}
              disabled={!currentText.trim()}
              className={`flex-1 bg-gradient-to-r ${currentPeriodInfo.color} hover:opacity-90 rounded-ios py-3`}
            >
              完成这次书写
            </Button>
            <Button
              onClick={() => {
                setIsWriting(false);
                setCurrentText('');
              }}
              variant="outline"
              className="px-6 rounded-ios border-gray-300"
            >
              取消
            </Button>
          </div>
        </Card>
      )}

      {/* All Periods Overview */}
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
    </div>
  );
};
