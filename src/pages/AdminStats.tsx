import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSiteStats } from '@/hooks/useSiteStats';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Save, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminStats = () => {
  const navigate = useNavigate();
  const { stats, loading, updateStat } = useSiteStats();
  const [editValues, setEditValues] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<string | null>(null);

  const handleSave = async (id: string) => {
    setSaving(id);
    await updateStat(id, editValues[id]);
    setSaving(null);
  };

  const handleChange = (id: string, value: string) => {
    setEditValues(prev => ({
      ...prev,
      [id]: value
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-4 sm:p-6 md:p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <Skeleton className="h-12 w-64" />
          <div className="grid gap-4">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>统计数据管理 - 显化369后台</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b bg-card">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate('/')}
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                  <h1 className="text-2xl font-bold flex items-center gap-2">
                    <TrendingUp className="h-6 w-6 text-primary" />
                    统计数据管理
                  </h1>
                  <p className="text-sm text-muted-foreground mt-1">
                    管理首页显示的统计数据
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>关于数据管理</CardTitle>
              <CardDescription>
                这些数据会显示在首页的统计展示区域。定期更新这些数据可以让网站看起来更加真实和活跃，避免被搜索引擎判定为欺诈网站。
              </CardDescription>
            </CardHeader>
          </Card>

          <div className="grid gap-4">
            {stats.map((stat) => (
              <Card key={stat.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{stat.label}</CardTitle>
                  {stat.description && (
                    <CardDescription>{stat.description}</CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4 items-end">
                    <div className="flex-1 space-y-2">
                      <Label htmlFor={stat.id}>当前值</Label>
                      <Input
                        id={stat.id}
                        value={editValues[stat.id] !== undefined ? editValues[stat.id] : stat.value}
                        onChange={(e) => handleChange(stat.id, e.target.value)}
                        placeholder={stat.value}
                        className="font-mono text-lg"
                      />
                      <p className="text-xs text-muted-foreground">
                        数据标识: {stat.key}
                      </p>
                    </div>
                    <Button
                      onClick={() => handleSave(stat.id)}
                      disabled={saving === stat.id || editValues[stat.id] === undefined || editValues[stat.id] === stat.value}
                      className="mb-1"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {saving === stat.id ? '保存中...' : '保存'}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    最后更新: {new Date(stat.updated_at).toLocaleString('zh-CN')}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="mt-6 bg-muted/50">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">
                💡 提示：建议每周或每月更新这些数据，保持增长趋势，但增长幅度要合理。例如：
              </p>
              <ul className="text-sm text-muted-foreground mt-2 space-y-1 ml-4">
                <li>• 月活跃用户：每月增长 5-15%</li>
                <li>• 成功率：保持在 85-92% 之间</li>
                <li>• 评分：保持在 4.7-5.0 之间</li>
                <li>• 本周增长：与月增长率保持一致</li>
              </ul>
            </CardContent>
          </Card>
        </main>
      </div>
    </>
  );
};

export default AdminStats;
