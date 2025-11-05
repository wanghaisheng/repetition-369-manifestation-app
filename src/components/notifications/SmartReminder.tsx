
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, TrendingUp, Target, Zap } from 'lucide-react';
import { NotificationService } from '@/services/NotificationService';
import { AnalyticsService } from '@/services/AnalyticsService';
import { logger } from '@/utils/logger';

interface SmartReminderProps {
  userId: string;
}

export const SmartReminder = ({ userId }: SmartReminderProps) => {
  const [recommendations, setRecommendations] = useState<{
    bestTimes: string[];
    riskLevel: 'low' | 'medium' | 'high';
    suggestions: string[];
  }>({
    bestTimes: [],
    riskLevel: 'low',
    suggestions: []
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    generateSmartRecommendations();
  }, [userId]);

  const generateSmartRecommendations = async () => {
    try {
      setIsLoading(true);
      const analytics = await AnalyticsService.getAnalytics(userId, 30);
      const insights = await AnalyticsService.generateInsights(userId);
      
      // 分析最佳练习时间
      const { morning, afternoon, evening } = analytics.timePatterns;
      const timeScores = { morning, afternoon, evening };
      const bestTimes = Object.entries(timeScores)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 2)
        .map(([time]) => {
          const timeNames = {
            morning: '早上 8:00-10:00',
            afternoon: '下午 2:00-4:00',  
            evening: '晚上 7:00-9:00'
          };
          return timeNames[time as keyof typeof timeNames];
        });

      // 评估风险等级
      let riskLevel: 'low' | 'medium' | 'high' = 'low';
      if (analytics.streakAnalysis.consistency < 0.5) {
        riskLevel = 'high';
      } else if (analytics.streakAnalysis.consistency < 0.7) {
        riskLevel = 'medium';
      }

      // 生成个性化建议
      const suggestions = [];
      if (analytics.streakAnalysis.current === 0) {
        suggestions.push('开始新的练习连击，每天坚持会有意想不到的效果！');
      } else if (analytics.streakAnalysis.current < 7) {
        suggestions.push('继续保持，距离一周连击只差几天了！');
      } else {
        suggestions.push('你的坚持值得赞赏，继续保持这个好习惯！');
      }

      if (analytics.productivityScore < 60) {
        suggestions.push('建议在精力充沛时进行练习，效果会更好');
      }

      setRecommendations({
        bestTimes,
        riskLevel,
        suggestions
      });
    } catch (error) {
      logger.error('Error generating smart recommendations', error);
    } finally {
      setIsLoading(false);
    }
  };

  const setupSmartReminders = async () => {
    try {
      await NotificationService.setupSmartReminders(userId, recommendations);
      // 显示成功提示
      logger.log('Smart reminders set up successfully');
    } catch (error) {
      logger.error('Error setting up smart reminders', error);
    }
  };

  const getRiskBadgeColor = (level: string) => {
    switch (level) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      default: return 'secondary';
    }
  };

  const getRiskText = (level: string) => {
    switch (level) {
      case 'high': return '高风险 - 需要立即行动';
      case 'medium': return '中等风险 - 建议优化';
      default: return '低风险 - 保持良好';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Zap className="w-5 h-5 text-yellow-500" />
          <span>智能提醒建议</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 风险评估 */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <Target className="w-4 h-4" />
            <span className="text-sm text-gray-700">连击风险评估</span>
          </div>
          <Badge variant={getRiskBadgeColor(recommendations.riskLevel)}>
            {getRiskText(recommendations.riskLevel)}
          </Badge>
        </div>

        {/* 最佳时间推荐 */}
        {recommendations.bestTimes.length > 0 && (
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <Clock className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium">推荐练习时间</span>
            </div>
            <div className="space-y-1">
              {recommendations.bestTimes.map((time, index) => (
                <div key={index} className="text-sm text-gray-600 pl-6">
                  • {time}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 个性化建议 */}
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span className="text-sm font-medium">个性化建议</span>
          </div>
          <div className="space-y-1">
            {recommendations.suggestions.map((suggestion, index) => (
              <div key={index} className="text-sm text-gray-600 pl-6">
                • {suggestion}
              </div>
            ))}
          </div>
        </div>

        {/* 设置智能提醒按钮 */}
        <Button 
          onClick={setupSmartReminders}
          className="w-full"
        >
          应用智能提醒设置
        </Button>
      </CardContent>
    </Card>
  );
};
