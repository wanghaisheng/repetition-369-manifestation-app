
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { ReminderSystem } from '@/components/notifications/ReminderSystem';
import { Bell, Zap, Shield, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { monitorMemoryUsage } from '@/utils/performance';

export const SettingsPanel = () => {
  const { t } = useTranslation('app');
  const [performanceMode, setPerformanceMode] = useState(
    localStorage.getItem('performance-mode') === 'true'
  );
  const [memoryInfo, setMemoryInfo] = useState<any>(null);
  const [showClearDataDialog, setShowClearDataDialog] = useState(false);

  const handlePerformanceMode = (enabled: boolean) => {
    setPerformanceMode(enabled);
    localStorage.setItem('performance-mode', enabled.toString());
    
    if (enabled) {
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
    localStorage.clear();
    sessionStorage.clear();
    
    if ('caches' in window) {
      caches.keys().then((names) => {
        names.forEach(name => {
          caches.delete(name);
        });
      });
    }
    
    window.location.reload();
  };

  return (
    <>
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">{t('settingsPanel.title')}</h1>
        
        <Tabs defaultValue="notifications" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="notifications" className="flex items-center">
              <Bell className="w-4 h-4 mr-2" />
              {t('settingsPanel.tabs.notifications')}
            </TabsTrigger>
            <TabsTrigger value="performance" className="flex items-center">
              <Zap className="w-4 h-4 mr-2" />
              {t('settingsPanel.tabs.performance')}
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex items-center">
              <Shield className="w-4 h-4 mr-2" />
              {t('settingsPanel.tabs.privacy')}
            </TabsTrigger>
            <TabsTrigger value="about" className="flex items-center">
              <Info className="w-4 h-4 mr-2" />
              {t('settingsPanel.tabs.about')}
            </TabsTrigger>
          </TabsList>

        <TabsContent value="notifications">
          <ReminderSystem />
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('settingsPanel.performance.title')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">{t('settingsPanel.performance.mode')}</h3>
                  <p className="text-sm text-gray-600">
                    {t('settingsPanel.performance.modeDesc')}
                  </p>
                </div>
                <Switch
                  checked={performanceMode}
                  onCheckedChange={handlePerformanceMode}
                />
              </div>

              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium">{t('settingsPanel.performance.memoryUsage')}</h3>
                  <Button onClick={checkMemoryUsage} variant="outline" size="sm">
                    {t('settingsPanel.performance.checkMemory')}
                  </Button>
                </div>
                
                {memoryInfo && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">{t('settingsPanel.performance.used')}</span>
                        <div className="font-medium">{memoryInfo.used} {t('settingsPanel.performance.mb')}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">{t('settingsPanel.performance.total')}</span>
                        <div className="font-medium">{memoryInfo.total} {t('settingsPanel.performance.mb')}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">{t('settingsPanel.performance.limit')}</span>
                        <div className="font-medium">{memoryInfo.limit} {t('settingsPanel.performance.mb')}</div>
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
              <CardTitle>{t('settingsPanel.privacy.title')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">{t('settingsPanel.privacy.localData')}</h3>
                <p className="text-sm text-gray-600 mb-4">
                  {t('settingsPanel.privacy.localDataDesc')}
                </p>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-medium mb-2">{t('settingsPanel.privacy.clearData')}</h3>
                <p className="text-sm text-gray-600 mb-4">
                  {t('settingsPanel.privacy.clearDataDesc')}
                </p>
                <Button onClick={() => setShowClearDataDialog(true)} variant="destructive">
                  {t('settingsPanel.privacy.clearAllData')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="about" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('settingsPanel.about.title')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium">{t('settingsPanel.about.version')}</h3>
                <p className="text-sm text-gray-600">
                  {t('settingsPanel.about.versionNumber')}
                </p>
              </div>

              <div>
                <h3 className="font-medium">{t('settingsPanel.about.method369')}</h3>
                <p className="text-sm text-gray-600">
                  {t('settingsPanel.about.methodDesc')}
                </p>
              </div>

              <div>
                <h3 className="font-medium">{t('settingsPanel.about.techStack')}</h3>
                <p className="text-sm text-gray-600">
                  {t('settingsPanel.about.techStackInfo')}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>

    <AlertDialog open={showClearDataDialog} onOpenChange={setShowClearDataDialog}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('settingsPanel.privacy.clearData')}</AlertDialogTitle>
          <AlertDialogDescription>
            {t('settings.clearDataConfirm')}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t('shareModal.cancel')}</AlertDialogCancel>
          <AlertDialogAction onClick={clearAppData} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
            {t('settingsPanel.privacy.clearAllData')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </>
  );
};
