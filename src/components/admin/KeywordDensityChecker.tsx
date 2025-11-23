import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { analyzeKeywordDensity, parseKeywords, type KeywordDensityReport } from '@/utils/keywordDensity';
import { 
  TrendingUp, 
  TrendingDown, 
  CheckCircle2, 
  AlertTriangle,
  FileText,
  Target,
  BarChart3
} from 'lucide-react';

interface KeywordDensityCheckerProps {
  content: string;
  keywords: string; // Comma-separated keywords
  targetDensity?: { min: number; max: number };
}

export const KeywordDensityChecker: React.FC<KeywordDensityCheckerProps> = ({
  content,
  keywords,
  targetDensity = { min: 2, max: 4 }
}) => {
  const { t } = useTranslation(['app', 'common']);

  const report: KeywordDensityReport = useMemo(() => {
    const keywordArray = parseKeywords(keywords);
    if (keywordArray.length === 0 || !content) {
      return {
        totalWords: 0,
        analyses: [],
        overallScore: 0,
        recommendations: [t('app:blog.keyword_density.empty_content')]
      };
    }
    return analyzeKeywordDensity(content, keywordArray, targetDensity);
  }, [content, keywords, targetDensity, t]);

  const getStatusIcon = (status: 'low' | 'optimal' | 'high') => {
    switch (status) {
      case 'low':
        return <TrendingDown className="w-4 h-4 text-yellow-500" />;
      case 'optimal':
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'high':
        return <TrendingUp className="w-4 h-4 text-red-500" />;
    }
  };

  const getStatusBadge = (status: 'low' | 'optimal' | 'high') => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      low: 'outline',
      optimal: 'default',
      high: 'destructive'
    };

    const labels = {
      low: t('app:blog.keyword_density.status.low'),
      optimal: t('app:blog.keyword_density.status.optimal'),
      high: t('app:blog.keyword_density.status.high')
    };

    return (
      <Badge variant={variants[status]} className="ml-2">
        {labels[status]}
      </Badge>
    );
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (!content || parseKeywords(keywords).length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            {t('app:blog.keyword_density.title')}
          </CardTitle>
          <CardDescription>
            {t('app:blog.keyword_density.description')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertTriangle className="w-4 h-4" />
            <AlertDescription>
              {t('app:blog.keyword_density.no_keywords')}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          {t('app:blog.keyword_density.title')}
        </CardTitle>
        <CardDescription>
          {t('app:blog.keyword_density.description')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Score */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">
                {t('app:blog.keyword_density.overall_score')}
              </span>
            </div>
            <span className={`text-2xl font-bold ${getScoreColor(report.overallScore)}`}>
              {report.overallScore}%
            </span>
          </div>
          <Progress value={report.overallScore} className="h-2" />
        </div>

        {/* Content Stats */}
        <div className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {t('app:blog.keyword_density.total_words')}:
            </span>
            <span className="font-semibold">{report.totalWords}</span>
          </div>
          <Separator orientation="vertical" className="h-4" />
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {t('app:blog.keyword_density.target_range')}:
            </span>
            <span className="font-semibold">
              {targetDensity.min}% - {targetDensity.max}%
            </span>
          </div>
        </div>

        <Separator />

        {/* Individual Keyword Analysis */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold">
            {t('app:blog.keyword_density.keywords_analysis')}
          </h4>
          {report.analyses.map((analysis, index) => (
            <div key={index} className="space-y-2 p-3 border rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getStatusIcon(analysis.status)}
                  <span className="font-medium">{analysis.keyword}</span>
                  {getStatusBadge(analysis.status)}
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold">{analysis.density}%</div>
                  <div className="text-xs text-muted-foreground">
                    {analysis.count} {t('app:blog.keyword_density.occurrences')}
                  </div>
                </div>
              </div>
              
              <Progress 
                value={(analysis.density / targetDensity.max) * 100} 
                className="h-1.5"
              />

              {/* Suggestions */}
              {analysis.suggestions.length > 0 && (
                <div className="mt-2 space-y-1">
                  {analysis.suggestions.map((suggestion, i) => (
                    <p key={i} className="text-xs text-muted-foreground">
                      • {suggestion}
                    </p>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <Separator />

        {/* Overall Recommendations */}
        {report.recommendations.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              {t('app:blog.keyword_density.recommendations')}
            </h4>
            <div className="space-y-1">
              {report.recommendations.map((recommendation, index) => (
                <p key={index} className="text-sm text-muted-foreground">
                  {recommendation}
                </p>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
