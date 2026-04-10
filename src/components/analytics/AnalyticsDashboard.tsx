
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, TrendingUp, Clock, Heart, Share2, Calendar, Target } from 'lucide-react';
import { AnalyticsService, AnalyticsData, PracticeInsight } from '@/services/AnalyticsService';
import { SocialService } from '@/services/SocialService';
import { logger } from '@/utils/logger';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface AnalyticsDashboardProps {
  onClose?: () => void;
}

export const AnalyticsDashboard = ({ onClose }: AnalyticsDashboardProps) => {
  const { t } = useTranslation('app');
  const { user } = useAuth();
  const { toast } = useToast();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [insights, setInsights] = useState<PracticeInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<30 | 90 | 365>(30);

  useEffect(() => {
    loadAnalytics();
  }, [timeRange, user]);

  const loadAnalytics = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const [analyticsData, insightsData] = await Promise.all([
        AnalyticsService.getAnalytics(user.id, timeRange),
        AnalyticsService.generateInsights(user.id)
      ]);
      
      setAnalytics(analyticsData);
      setInsights(insightsData);
    } catch (error) {
      logger.error('Error loading analytics', error);
      toast({
        title: '加载失败',
        description: '无法加载分析数据，请稍后重试',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    if (!analytics) return;

    const shareContent = SocialService.createProgressShare(
      analytics.practiceFrequency.daily.reduce((sum, count) => sum + count, 0),
      analytics.wishProgress.filter(w => w.completionRate >= 100).length
    );

    const success = await SocialService.nativeShare(shareContent);
    if (!success) {
      // Fallback to copy
      await SocialService.shareContent({ platform: 'copy', content: shareContent });
      toast({
        title: t('shareModal.toast.contentCopied'),
        description: t('shareModal.toast.shareComplete')
      });
    }
  };

  const getInsightIcon = (type: PracticeInsight['type']) => {
    switch (type) {
      case 'success': return '🎉';
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
      default: return '💡';
    }
  };

  const getInsightColor = (type: PracticeInsight['type']) => {
    switch (type) {
      case 'success': return 'border-green-200 bg-green-50';
      case 'warning': return 'border-yellow-200 bg-yellow-50';
      case 'info': return 'border-blue-200 bg-blue-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ios-blue"></div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-600">{t('analytics.empty')}</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">练习分析</h1>
          <p className="text-gray-600">深入了解您的显化之旅</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handleShare} className="flex items-center space-x-2">
            <Share2 className="w-4 h-4" />
            <span>分享进展</span>
          </Button>
          {onClose && (
            <Button variant="outline" onClick={onClose}>
              关闭
            </Button>
          )}
        </div>
      </div>

      {/* Time Range Selector */}
      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-600">时间范围：</span>
        {[30, 90, 365].map((days) => (
          <Button
            key={days}
            variant={timeRange === days ? "default" : "outline"}
            size="sm"
            onClick={() => setTimeRange(days as 30 | 90 | 365)}
          >
            {days === 30 ? '30天' : days === 90 ? '90天' : '1年'}
          </Button>
        ))}
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 rounded-full p-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800">
                {Math.round(analytics.productivityScore)}
              </div>
              <div className="text-sm text-gray-600">效率得分</div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="bg-green-100 rounded-full p-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800">
                {analytics.streakAnalysis.current}
              </div>
              <div className="text-sm text-gray-600">连续天数</div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="bg-purple-100 rounded-full p-2">
              <Target className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800">
                {analytics.wishProgress.filter(w => w.completionRate >= 100).length}
              </div>
              <div className="text-sm text-gray-600">完成愿望</div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="bg-orange-100 rounded-full p-2">
              <Calendar className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800">
                {analytics.practiceFrequency.daily.reduce((sum, count) => sum + count, 0)}
              </div>
              <div className="text-sm text-gray-600">总练习数</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Insights */}
      {insights.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">个性化洞察</h3>
          <div className="space-y-3">
            {insights.map((insight, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border ${getInsightColor(insight.type)}`}
              >
                <div className="flex items-start space-x-3">
                  <span className="text-lg">{getInsightIcon(insight.type)}</span>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800">{insight.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{insight.description}</p>
                    {insight.recommendation && (
                      <p className="text-sm text-blue-600 mt-2 font-medium">
                        💡 {insight.recommendation}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Detailed Analytics */}
      <Tabs defaultValue="time-patterns" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="time-patterns">时间模式</TabsTrigger>
          <TabsTrigger value="mood-trends">情绪趋势</TabsTrigger>
          <TabsTrigger value="wish-progress">愿望进展</TabsTrigger>
          <TabsTrigger value="consistency">一致性</TabsTrigger>
        </TabsList>

        <TabsContent value="time-patterns">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">练习时间模式</h3>
            <div className="space-y-4">
              {Object.entries(analytics.timePatterns).map(([period, count]) => {
                const total = Object.values(analytics.timePatterns).reduce((sum, c) => sum + c, 0);
                const percentage = total > 0 ? (count / total) * 100 : 0;
                const periodNames = { morning: '早上', afternoon: '下午', evening: '晚上' };
                
                return (
                  <div key={period}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        {periodNames[period as keyof typeof periodNames]}
                      </span>
                      <span className="text-sm text-gray-600">{count}次 ({Math.round(percentage)}%)</span>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                );
              })}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="mood-trends">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">情绪趋势分析</h3>
            <div className="space-y-4">
              {Object.entries(analytics.moodTrends).map(([mood, count]) => {
                const total = Object.values(analytics.moodTrends).reduce((sum, c) => sum + c, 0);
                const percentage = total > 0 ? (count / total) * 100 : 0;
                const moodNames = { 
                  excellent: '优秀', 
                  good: '良好', 
                  neutral: '一般', 
                  poor: '较差' 
                };
                const moodColors = {
                  excellent: 'bg-green-500',
                  good: 'bg-blue-500',
                  neutral: 'bg-yellow-500',
                  poor: 'bg-red-500'
                };
                
                return (
                  <div key={mood}>
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${moodColors[mood as keyof typeof moodColors]}`}></div>
                        <span className="text-sm font-medium text-gray-700">
                          {moodNames[mood as keyof typeof moodNames]}
                        </span>
                      </div>
                      <span className="text-sm text-gray-600">{count}次 ({Math.round(percentage)}%)</span>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                );
              })}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="wish-progress">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">愿望完成进展</h3>
            <div className="space-y-4">
              {analytics.wishProgress.slice(0, 5).map((wish, index) => (
                <div key={wish.wishId}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700 truncate flex-1 pr-2">
                      {wish.title}
                    </span>
                    <span className="text-sm text-gray-600 whitespace-nowrap">
                      {Math.round(wish.completionRate)}% ({wish.totalSessions}次)
                    </span>
                  </div>
                  <Progress value={Math.min(wish.completionRate, 100)} className="h-2" />
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="consistency">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">练习一致性</h3>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">一致性得分</span>
                  <span className="text-sm text-gray-600">
                    {Math.round(analytics.streakAnalysis.consistency * 100)}%
                  </span>
                </div>
                <Progress value={analytics.streakAnalysis.consistency * 100} className="h-3" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-800">
                    {analytics.streakAnalysis.current}
                  </div>
                  <div className="text-sm text-gray-600">当前连击</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-800">
                    {analytics.streakAnalysis.longest}
                  </div>
                  <div className="text-sm text-gray-600">最长连击</div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
