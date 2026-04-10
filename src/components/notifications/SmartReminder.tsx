
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, TrendingUp, Target, Zap } from 'lucide-react';
import { NotificationService } from '@/services/NotificationService';
import { AnalyticsService } from '@/services/AnalyticsService';
import { useTranslation } from 'react-i18next';
import { logger } from '@/utils/logger';

interface SmartReminderProps {
  userId: string;
}

export const SmartReminder = ({ userId }: SmartReminderProps) => {
  const { t } = useTranslation('app');
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
      
      const { morning, afternoon, evening } = analytics.timePatterns;
      const timeScores = { morning, afternoon, evening };
      const bestTimes = Object.entries(timeScores)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 2)
        .map(([time]) => t(`smartReminder.timeSlots.${time}`));

      let riskLevel: 'low' | 'medium' | 'high' = 'low';
      if (analytics.streakAnalysis.consistency < 0.5) {
        riskLevel = 'high';
      } else if (analytics.streakAnalysis.consistency < 0.7) {
        riskLevel = 'medium';
      }

      const suggestions = [];
      if (analytics.streakAnalysis.current === 0) {
        suggestions.push(t('smartReminder.suggestions.startStreak'));
      } else if (analytics.streakAnalysis.current < 7) {
        suggestions.push(t('smartReminder.suggestions.keepGoing'));
      } else {
        suggestions.push(t('smartReminder.suggestions.greatJob'));
      }

      if (analytics.productivityScore < 60) {
        suggestions.push(t('smartReminder.suggestions.bestTime'));
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
      case 'high': return t('smartReminder.riskHigh');
      case 'medium': return t('smartReminder.riskMedium');
      default: return t('smartReminder.riskLow');
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Zap className="w-5 h-5 text-warning" />
          <span>{t('smartReminder.title')}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Risk assessment */}
        <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
          <div className="flex items-center space-x-2">
            <Target className="w-4 h-4" />
            <span className="text-sm text-muted-foreground">{t('smartReminder.riskAssessment')}</span>
          </div>
          <Badge variant={getRiskBadgeColor(recommendations.riskLevel)}>
            {getRiskText(recommendations.riskLevel)}
          </Badge>
        </div>

        {/* Best time recommendations */}
        {recommendations.bestTimes.length > 0 && (
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <Clock className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">{t('smartReminder.recommendedTimes')}</span>
            </div>
            <div className="space-y-1">
              {recommendations.bestTimes.map((time, index) => (
                <div key={index} className="text-sm text-muted-foreground pl-6">
                  • {time}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Personalized suggestions */}
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUp className="w-4 h-4 text-success" />
            <span className="text-sm font-medium">{t('smartReminder.personalizedSuggestions')}</span>
          </div>
          <div className="space-y-1">
            {recommendations.suggestions.map((suggestion, index) => (
              <div key={index} className="text-sm text-muted-foreground pl-6">
                • {suggestion}
              </div>
            ))}
          </div>
        </div>

        {/* Apply button */}
        <Button 
          onClick={setupSmartReminders}
          className="w-full"
        >
          {t('smartReminder.applySettings')}
        </Button>
      </CardContent>
    </Card>
  );
};
