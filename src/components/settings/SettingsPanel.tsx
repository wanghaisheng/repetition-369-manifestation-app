
import { m } from '@/paraglide/messages';
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
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
        <h1 className="text-2xl font-bold mb-6">{m.app_settingsPanel_title()}</h1>
        
        <Tabs defaultValue="notifications" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="notifications" className="flex items-center">
              <Bell className="w-4 h-4 mr-2" />
              {m.app_settingsPanel_tabs_notifications()}
            </TabsTrigger>
            <TabsTrigger value="performance" className="flex items-center">
              <Zap className="w-4 h-4 mr-2" />
              {m.app_settingsPanel_tabs_performance()}
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex items-center">
              <Shield className="w-4 h-4 mr-2" />
              {m.app_settingsPanel_tabs_privacy()}
            </TabsTrigger>
            <TabsTrigger value="about" className="flex items-center">
              <Info className="w-4 h-4 mr-2" />
              {m.app_settingsPanel_tabs_about()}
            </TabsTrigger>
          </TabsList>

        <TabsContent value="notifications">
          <ReminderSystem />
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{m.app_settingsPanel_performance_title()}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">{m.app_settingsPanel_performance_mode()}</h3>
                  <p className="text-sm text-muted-foreground">
                    {m.app_settingsPanel_performance_modeDesc()}
                  </p>
                </div>
                <Switch
                  checked={performanceMode}
                  onCheckedChange={handlePerformanceMode}
                />
              </div>

              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium">{m.app_settingsPanel_performance_memoryUsage()}</h3>
                  <Button onClick={checkMemoryUsage} variant="outline" size="sm">
                    {m.app_settingsPanel_performance_checkMemory()}
                  </Button>
                </div>
                
                {memoryInfo && (
                  <div className="bg-muted rounded-lg p-4">
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">{m.app_settingsPanel_performance_used()}</span>
                        <div className="font-medium">{memoryInfo.used} {m.app_settingsPanel_performance_mb()}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">{m.app_settingsPanel_performance_total()}</span>
                        <div className="font-medium">{memoryInfo.total} {m.app_settingsPanel_performance_mb()}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">{m.app_settingsPanel_performance_limit()}</span>
                        <div className="font-medium">{memoryInfo.limit} {m.app_settingsPanel_performance_mb()}</div>
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
              <CardTitle>{m.app_settingsPanel_privacy_title()}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">{m.app_settingsPanel_privacy_localData()}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {m.app_settingsPanel_privacy_localDataDesc()}
                </p>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-medium mb-2">{m.app_settingsPanel_privacy_clearData()}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {m.app_settingsPanel_privacy_clearDataDesc()}
                </p>
                <Button onClick={() => setShowClearDataDialog(true)} variant="destructive">
                  {m.app_settingsPanel_privacy_clearAllData()}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="about" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{m.app_settingsPanel_about_title()}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium">{m.app_settingsPanel_about_version()}</h3>
                <p className="text-sm text-muted-foreground">
                  {m.app_settingsPanel_about_versionNumber()}
                </p>
              </div>

              <div>
                <h3 className="font-medium">{m.app_settingsPanel_about_method369()}</h3>
                <p className="text-sm text-muted-foreground">
                  {m.app_settingsPanel_about_methodDesc()}
                </p>
              </div>

              <div>
                <h3 className="font-medium">{m.app_settingsPanel_about_techStack()}</h3>
                <p className="text-sm text-muted-foreground">
                  {m.app_settingsPanel_about_techStackInfo()}
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
          <AlertDialogTitle>{m.app_settingsPanel_privacy_clearData()}</AlertDialogTitle>
          <AlertDialogDescription>
            {m.app_settings_clearDataConfirm()}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{m.app_shareModal_cancel()}</AlertDialogCancel>
          <AlertDialogAction onClick={clearAppData} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
            {m.app_settingsPanel_privacy_clearAllData()}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </>
  );
};
