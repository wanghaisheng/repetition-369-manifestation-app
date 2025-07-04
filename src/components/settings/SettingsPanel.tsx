
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ReminderSystem } from '@/components/notifications/ReminderSystem';
import { Bell, Zap, Shield, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { monitorMemoryUsage } from '@/utils/performance';

export const SettingsPanel = () => {
  const [performanceMode, setPerformanceMode] = useState(
    localStorage.getItem('performance-mode') === 'true'
  );
  const [memoryInfo, setMemoryInfo] = useState<any>(null);

  const handlePerformanceMode = (enabled: boolean) => {
    setPerformanceMode(enabled);
    localStorage.setItem('performance-mode', enabled.toString());
    
    if (enabled) {
      // 启用性能优化
      document.body.classList.add('performance-mode');
    } else {
      document.body.classList.remove('performance-mode');
    }
  };

  const checkMemoryUsage = () => {
    const usage = monitorMemoryUsage();
    setMemoryInfo(usage);
  };

  const clearAppData = () => {
    if (confirm('确定要清除所有应用数据吗？这将删除所有本地设置和缓存。')) {
      localStorage.clear();
      sessionStorage.clear();
      
      // 清除缓存
      if ('caches' in window) {
        caches.keys().then((names) => {
          names.forEach(name => {
            caches.delete(name);
          });
        });
      }
      
      window.location.reload();
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">应用设置</h1>
      
      <Tabs defaultValue="notifications" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="notifications" className="flex items-center">
            <Bell className="w-4 h-4 mr-2" />
            通知
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center">
            <Zap className="w-4 h-4 mr-2" />
            性能
          </TabsTrigger>
          <TabsTrigger value="privacy" className="flex items-center">
            <Shield className="w-4 h-4 mr-2" />
            隐私
          </TabsTrigger>
          <TabsTrigger value="about" className="flex items-center">
            <Info className="w-4 h-4 mr-2" />
            关于
          </TabsTrigger>
        </TabsList>

        <TabsContent value="notifications">
          <ReminderSystem />
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>性能优化</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">性能模式</h3>
                  <p className="text-sm text-gray-600">
                    启用后将减少动画效果，提升应用响应速度
                  </p>
                </div>
                <Switch
                  checked={performanceMode}
                  onCheckedChange={handlePerformanceMode}
                />
              </div>

              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium">内存使用情况</h3>
                  <Button onClick={checkMemoryUsage} variant="outline" size="sm">
                    检查内存
                  </Button>
                </div>
                
                {memoryInfo && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">已使用:</span>
                        <div className="font-medium">{memoryInfo.used} MB</div>
                      </div>
                      <div>
                        <span className="text-gray-600">总计:</span>
                        <div className="font-medium">{memoryInfo.total} MB</div>
                      </div>
                      <div>
                        <span className="text-gray-600">限制:</span>
                        <div className="font-medium">{memoryInfo.limit} MB</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>数据和隐私</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">本地数据存储</h3>
                <p className="text-sm text-gray-600 mb-4">
                  您的愿望、练习记录和设置都存储在本地设备上，我们不会收集您的个人数据。
                </p>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-medium mb-2">清除应用数据</h3>
                <p className="text-sm text-gray-600 mb-4">
                  这将删除所有本地存储的数据，包括愿望、练习记录和设置。
                </p>
                <Button onClick={clearAppData} variant="destructive">
                  清除所有数据
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="about" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>关于显化369</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium">版本信息</h3>
                <p className="text-sm text-gray-600">
                  版本 1.8.0 - SEO优化版本
                </p>
              </div>

              <div>
                <h3 className="font-medium">369显化法则</h3>
                <p className="text-sm text-gray-600">
                  基于特斯拉的神圣数字理论，通过每天书写3-6-9次愿望来实现显化目标。
                  这个应用帮助您系统化地进行369练习，跟踪进度并保持连击。
                </p>
              </div>

              <div>
                <h3 className="font-medium">技术栈</h3>
                <p className="text-sm text-gray-600">
                  React + TypeScript + Tailwind CSS + Supabase
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
