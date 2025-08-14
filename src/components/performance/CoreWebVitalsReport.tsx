import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ANALYTICS_CONFIG } from '@/config/analytics';

interface WebVitalsData {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  threshold: {
    good: number;
    poor: number;
  };
}

const WEB_VITALS_THRESHOLDS = {
  CLS: { good: 0.1, poor: 0.25 },
  INP: { good: 200, poor: 500 },
  FCP: { good: 1800, poor: 3000 },
  LCP: { good: 2500, poor: 4000 },
  TTFB: { good: 800, poor: 1800 }
};

export const CoreWebVitalsReport: React.FC = () => {
  const [vitalsData, setVitalsData] = useState<WebVitalsData[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // 只在开发环境或启用调试模式时显示
    setIsVisible(ANALYTICS_CONFIG.DEBUG_MODE || process.env.NODE_ENV === 'development');

    if (!isVisible) return;

    const collectWebVitals = async () => {
      try {
        const { onCLS, onINP, onFCP, onLCP, onTTFB } = await import('web-vitals');

        const handleMetric = (metric: any) => {
          const threshold = WEB_VITALS_THRESHOLDS[metric.name as keyof typeof WEB_VITALS_THRESHOLDS];
          if (!threshold) return;

          const webVitalData: WebVitalsData = {
            name: metric.name,
            value: metric.name === 'CLS' ? Math.round(metric.value * 1000) / 1000 : Math.round(metric.value),
            rating: metric.rating,
            threshold
          };

          setVitalsData(prev => [
            ...prev.filter(item => item.name !== metric.name),
            webVitalData
          ]);
        };

        onCLS(handleMetric);
        onINP(handleMetric);
        onFCP(handleMetric);
        onLCP(handleMetric);
        onTTFB(handleMetric);

      } catch (error) {
        console.warn('Web Vitals collection failed:', error);
      }
    };

    const timer = setTimeout(collectWebVitals, 1000);
    return () => clearTimeout(timer);
  }, [isVisible]);

  if (!isVisible || vitalsData.length === 0) {
    return null;
  }

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case 'good': return 'bg-green-500';
      case 'needs-improvement': return 'bg-yellow-500';
      case 'poor': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getRatingVariant = (rating: string) => {
    switch (rating) {
      case 'good': return 'default';
      case 'needs-improvement': return 'secondary';
      case 'poor': return 'destructive';
      default: return 'outline';
    }
  };

  const getProgressValue = (vital: WebVitalsData) => {
    const { value, threshold } = vital;
    if (vital.rating === 'good') {
      return Math.min((value / threshold.good) * 50, 50);
    } else if (vital.rating === 'needs-improvement') {
      return 50 + Math.min(((value - threshold.good) / (threshold.poor - threshold.good)) * 30, 30);
    } else {
      return 80 + Math.min(((value - threshold.poor) / threshold.poor) * 20, 20);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md">
      <Card className="border shadow-lg bg-white/95 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Core Web Vitals</CardTitle>
          <CardDescription className="text-xs">实时性能监控</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {vitalsData.map((vital) => (
            <div key={vital.name} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">{vital.name}</span>
                  <Badge variant={getRatingVariant(vital.rating)} className="text-xs">
                    {vital.rating === 'good' ? '良好' : 
                     vital.rating === 'needs-improvement' ? '需改进' : '差'}
                  </Badge>
                </div>
                <span className="text-sm text-muted-foreground">
                  {vital.name === 'CLS' ? vital.value.toFixed(3) : `${vital.value}ms`}
                </span>
              </div>
              <Progress 
                value={getProgressValue(vital)} 
                className="h-2"
              />
            </div>
          ))}
          <div className="pt-2 border-t">
            <p className="text-xs text-muted-foreground">
              数据来源: Web Vitals API
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};