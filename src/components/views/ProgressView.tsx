
import { useState } from 'react';
import { Calendar, TrendingUp, Target, Award, Flame, BarChart3, PieChart, Clock, Heart } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

export const ProgressView = () => {
  const [streakDays] = useState(21);
  const [totalPractices] = useState(189);
  const [completedGoals] = useState(2);
  const [totalWishes] = useState(5);

  const weeklyData = [
    { day: '周一', completed: true, sessions: 3, mood: 'excellent' },
    { day: '周二', completed: true, sessions: 3, mood: 'good' },
    { day: '周三', completed: true, sessions: 3, mood: 'excellent' },
    { day: '周四', completed: true, sessions: 3, mood: 'good' },
    { day: '周五', completed: false, sessions: 2, mood: 'neutral' },
    { day: '周六', completed: true, sessions: 3, mood: 'excellent' },
    { day: '周日', completed: true, sessions: 3, mood: 'good' }
  ];

  const monthlyStats = [
    { month: '1月', practices: 45, completed: 15 },
    { month: '2月', practices: 78, completed: 28 },
    { month: '3月', practices: 66, completed: 22 }
  ];

  const categoryProgress = [
    { category: '事业', completed: 18, total: 30, color: 'bg-ios-blue' },
    { category: '健康', completed: 25, total: 30, color: 'bg-ios-green' },
    { category: '感情', completed: 12, total: 30, color: 'bg-ios-pink' },
    { category: '财富', completed: 8, total: 30, color: 'bg-manifest-gold' }
  ];

  const achievements = [
    {
      id: 1,
      title: '初心者',
      description: '完成第一次369练习',
      icon: Target,
      color: 'bg-ios-blue',
      unlocked: true,
      date: '2024-01-01'
    },
    {
      id: 2,
      title: '坚持者',
      description: '连续练习7天',
      icon: Flame,
      color: 'bg-ios-orange',
      unlocked: true,
      date: '2024-01-07'
    },
    {
      id: 3,
      title: '21天挑战者',
      description: '连续练习21天',
      icon: Calendar,
      color: 'bg-manifest-warm-gold',
      unlocked: true,
      date: '2024-01-21'
    },
    {
      id: 4,
      title: '显化大师',
      description: '成功显化第一个愿望',
      icon: Award,
      color: 'bg-manifest-gold',
      unlocked: false
    },
    {
      id: 5,
      title: '心情管理师',
      description: '保持30天积极心情',
      icon: Heart,
      color: 'bg-ios-pink',
      unlocked: false
    }
  ];

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case 'excellent': return 'bg-ios-green';
      case 'good': return 'bg-ios-blue';
      case 'neutral': return 'bg-ios-gray';
      default: return 'bg-gray-300';
    }
  };

  return (
    <div className="flex-1 bg-ios-secondary-background px-4 py-6 overflow-y-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">我的进度</h1>
        <p className="text-gray-600">追踪您的显化历程与成就</p>
      </div>

      {/* Key Stats Grid */}
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

        <Card className="p-4 bg-white border-0 shadow-ios rounded-ios">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-manifest-gold rounded-ios flex items-center justify-center">
              <Award className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800">{completedGoals}</div>
              <div className="text-sm text-gray-600">已实现愿望</div>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-white border-0 shadow-ios rounded-ios">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-ios-green rounded-ios flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800">{Math.round((completedGoals / totalWishes) * 100)}%</div>
              <div className="text-sm text-gray-600">成功率</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Weekly Progress with Mood */}
      <Card className="mb-6 p-6 bg-white border-0 shadow-ios rounded-ios">
        <div className="flex items-center space-x-3 mb-4">
          <Calendar className="w-6 h-6 text-ios-blue" />
          <h3 className="text-lg font-semibold text-gray-800">本周进度与心情</h3>
        </div>
        
        <div className="grid grid-cols-7 gap-2 mb-4">
          {weeklyData.map((day, index) => (
            <div key={index} className="text-center">
              <div className="text-xs text-gray-600 mb-2">{day.day}</div>
              <div className={`w-12 h-12 rounded-ios flex items-center justify-center text-sm font-medium mb-2 ${
                day.completed 
                  ? 'bg-ios-green text-white' 
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {day.sessions}
              </div>
              <div className={`w-12 h-2 rounded-full ${getMoodColor(day.mood)}`} />
            </div>
          ))}
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">本周完成率：
            <span className="font-semibold text-ios-green ml-1">
              {Math.round((weeklyData.filter(d => d.completed).length / weeklyData.length) * 100)}%
            </span>
          </span>
          <div className="flex items-center space-x-4 text-xs">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-2 bg-ios-green rounded" />
              <span>优秀</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-2 bg-ios-blue rounded" />
              <span>良好</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-2 bg-ios-gray rounded" />
              <span>一般</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Monthly Trends */}
      <Card className="mb-6 p-6 bg-white border-0 shadow-ios rounded-ios">
        <div className="flex items-center space-x-3 mb-4">
          <BarChart3 className="w-6 h-6 text-manifest-warm-gold" />
          <h3 className="text-lg font-semibold text-gray-800">月度趋势</h3>
        </div>
        
        <div className="space-y-4">
          {monthlyStats.map((month, index) => (
            <div key={index} className="flex items-center space-x-4">
              <div className="w-12 text-sm font-medium text-gray-700">{month.month}</div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-600">练习次数</span>
                  <span className="text-sm font-medium">{month.practices}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full bg-gradient-to-r from-ios-blue to-manifest-warm-gold transition-all duration-300"
                    style={{ width: `${(month.practices / 90) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Category Progress */}
      <Card className="mb-6 p-6 bg-white border-0 shadow-ios rounded-ios">
        <div className="flex items-center space-x-3 mb-4">
          <PieChart className="w-6 h-6 text-manifest-lavender" />
          <h3 className="text-lg font-semibold text-gray-800">分类进度</h3>
        </div>
        
        <div className="space-y-4">
          {categoryProgress.map((category, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">{category.category}</span>
                <span className="text-sm text-gray-600">{category.completed}/{category.total}</span>
              </div>
              <Progress 
                value={(category.completed / category.total) * 100} 
                className="h-2"
              />
            </div>
          ))}
        </div>
      </Card>

      {/* 33天挑战 */}
      <Card className="mb-6 p-6 bg-white border-0 shadow-ios rounded-ios">
        <div className="flex items-center space-x-3 mb-4">
          <Target className="w-6 h-6 text-manifest-gold" />
          <h3 className="text-lg font-semibold text-gray-800">33天显化挑战</h3>
        </div>
        
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">整体进度</span>
            <span className="text-sm text-gray-600">{streakDays} / 33 天</span>
          </div>
          <Progress value={(streakDays / 33) * 100} className="h-3 mb-2" />
          <div className="flex justify-between text-xs text-gray-500">
            <span>开始</span>
            <span className="font-medium text-manifest-warm-gold">
              {Math.round((streakDays / 33) * 100)}% 完成
            </span>
            <span>完成</span>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-manifest-gold/10 to-manifest-warm-gold/10 rounded-ios p-4">
          <p className="text-sm text-gray-700 leading-relaxed mb-2">
            科学研究表明，养成一个新习惯需要21-66天。您已经坚持了{streakDays}天，非常棒！
          </p>
          <p className="text-xs text-gray-600">
            距离完成还有 {33 - streakDays} 天，继续保持！
          </p>
        </div>
      </Card>

      {/* 成就徽章 */}
      <Card className="p-6 bg-white border-0 shadow-ios rounded-ios">
        <div className="flex items-center space-x-3 mb-4">
          <Award className="w-6 h-6 text-manifest-gold" />
          <h3 className="text-lg font-semibold text-gray-800">成就徽章</h3>
        </div>
        
        <div className="grid grid-cols-1 gap-3">
          {achievements.map((achievement) => {
            const Icon = achievement.icon;
            return (
              <div 
                key={achievement.id}
                className={`flex items-center space-x-3 p-3 rounded-ios transition-all duration-200 ${
                  achievement.unlocked 
                    ? 'bg-gradient-to-r from-gray-50 to-gray-100' 
                    : 'bg-gray-100 opacity-60'
                }`}
              >
                <div className={`w-12 h-12 rounded-ios flex items-center justify-center ${
                  achievement.unlocked 
                    ? achievement.color 
                    : 'bg-gray-400'
                }`}>
                  <Icon className="w-6 h-6 text-white" />
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
                  {achievement.unlocked && achievement.date && (
                    <p className="text-xs text-gray-500 mt-1">
                      获得于 {achievement.date}
                    </p>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  {achievement.unlocked ? (
                    <div className="text-ios-green">
                      <Award className="w-5 h-5" />
                    </div>
                  ) : (
                    <div className="text-gray-400">
                      <Clock className="w-5 h-5" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};
