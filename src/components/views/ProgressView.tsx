
import { useState } from 'react';
import { Calendar, TrendingUp, Target, Award, Flame } from 'lucide-react';
import { Card } from '@/components/ui/card';

export const ProgressView = () => {
  const [streakDays] = useState(7);
  const [totalPractices] = useState(45);
  const [completedGoals] = useState(2);

  const weeklyData = [
    { day: '周一', completed: true, sessions: 3 },
    { day: '周二', completed: true, sessions: 3 },
    { day: '周三', completed: true, sessions: 3 },
    { day: '周四', completed: true, sessions: 3 },
    { day: '周五', completed: false, sessions: 2 },
    { day: '周六', completed: true, sessions: 3 },
    { day: '周日', completed: true, sessions: 3 }
  ];

  const achievements = [
    {
      id: 1,
      title: '初心者',
      description: '完成第一次369练习',
      icon: Target,
      color: 'bg-ios-blue',
      unlocked: true
    },
    {
      id: 2,
      title: '坚持者',
      description: '连续练习7天',
      icon: Flame,
      color: 'bg-ios-orange',
      unlocked: true
    },
    {
      id: 3,
      title: '显化大师',
      description: '成功显化第一个愿望',
      icon: Award,
      color: 'bg-manifest-gold',
      unlocked: false
    }
  ];

  return (
    <div className="flex-1 bg-ios-secondary-background px-4 py-6 overflow-y-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">我的进度</h1>
        <p className="text-gray-600">追踪您的显化历程</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Card className="p-4 bg-white border-0 shadow-ios rounded-ios">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-ios-orange rounded-ios flex items-center justify-center">
              <Flame className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800">{streakDays}</div>
              <div className="text-sm text-gray-600">连续天数</div>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-white border-0 shadow-ios rounded-ios">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-ios-blue rounded-ios flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800">{totalPractices}</div>
              <div className="text-sm text-gray-600">总练习次数</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Weekly Progress */}
      <Card className="mb-6 p-6 bg-white border-0 shadow-ios rounded-ios">
        <div className="flex items-center space-x-3 mb-4">
          <Calendar className="w-6 h-6 text-ios-blue" />
          <h3 className="text-lg font-semibold text-gray-800">本周进度</h3>
        </div>
        
        <div className="grid grid-cols-7 gap-2">
          {weeklyData.map((day, index) => (
            <div key={index} className="text-center">
              <div className="text-xs text-gray-600 mb-2">{day.day}</div>
              <div className={`w-10 h-10 rounded-ios flex items-center justify-center text-sm font-medium ${
                day.completed 
                  ? 'bg-ios-green text-white' 
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {day.sessions}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 text-center">
          <span className="text-sm text-gray-600">本周完成率：</span>
          <span className="text-sm font-semibold text-ios-green ml-1">
            {Math.round((weeklyData.filter(d => d.completed).length / weeklyData.length) * 100)}%
          </span>
        </div>
      </Card>

      {/* Monthly Goal */}
      <Card className="mb-6 p-6 bg-white border-0 shadow-ios rounded-ios">
        <div className="flex items-center space-x-3 mb-4">
          <Target className="w-6 h-6 text-manifest-gold" />
          <h3 className="text-lg font-semibold text-gray-800">33天挑战</h3>
        </div>
        
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">进度</span>
            <span className="text-sm text-gray-600">21 / 33 天</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="h-3 rounded-full bg-gradient-to-r from-manifest-gold to-manifest-warm-gold transition-all duration-300"
              style={{ width: `${(21 / 33) * 100}%` }}
            />
          </div>
        </div>
        
        <p className="text-sm text-gray-600 leading-relaxed">
          坚持练习33天，让显化成为习惯。你已经完成了 {Math.round((21 / 33) * 100)}%！
        </p>
      </Card>

      {/* Achievements */}
      <Card className="p-6 bg-white border-0 shadow-ios rounded-ios">
        <div className="flex items-center space-x-3 mb-4">
          <Award className="w-6 h-6 text-manifest-gold" />
          <h3 className="text-lg font-semibold text-gray-800">成就徽章</h3>
        </div>
        
        <div className="space-y-3">
          {achievements.map((achievement) => {
            const Icon = achievement.icon;
            return (
              <div 
                key={achievement.id}
                className={`flex items-center space-x-3 p-3 rounded-ios ${
                  achievement.unlocked 
                    ? 'bg-gray-50' 
                    : 'bg-gray-100 opacity-60'
                }`}
              >
                <div className={`w-10 h-10 rounded-ios flex items-center justify-center ${
                  achievement.unlocked 
                    ? achievement.color 
                    : 'bg-gray-400'
                }`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className={`font-medium ${
                    achievement.unlocked 
                      ? 'text-gray-800' 
                      : 'text-gray-500'
                  }`}>
                    {achievement.title}
                  </h4>
                  <p className={`text-sm ${
                    achievement.unlocked 
                      ? 'text-gray-600' 
                      : 'text-gray-400'
                  }`}>
                    {achievement.description}
                  </p>
                </div>
                {achievement.unlocked && (
                  <div className="text-ios-green">
                    <Award className="w-5 h-5" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};
