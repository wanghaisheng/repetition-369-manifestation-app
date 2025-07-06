
import React, { useState } from 'react';
import { StatusBar } from '@/components/ui/StatusBar';
import { TabBar } from '@/components/navigation/TabBar';
import { HomeView } from '@/components/views/HomeView';
import { WishesView } from '@/components/views/WishesView';
import { PracticeView } from '@/components/views/PracticeView';
import { ProgressView } from '@/components/views/ProgressView';
import { CommunityView } from '@/components/views/CommunityView';
import { SettingsPanel } from '@/components/settings/SettingsPanel';
import { SEOHead } from '@/components/seo/SEOHead';
import { InternalLinks } from '@/components/seo/InternalLinks';
import { SitemapGenerator } from '@/components/seo/SitemapGenerator';
import { PageLoadMonitor } from '@/components/performance/PageLoadMonitor';
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs';
import { ModularSEO } from '@/components/seo/ModularSEO';
import { RedirectHandler } from '@/components/seo/RedirectHandler';
import { CriticalCSS } from '@/components/seo/CriticalCSS';

type Tab = 'home' | 'wishes' | 'practice' | 'progress' | 'community' | 'settings';

const Index = () => {
  const [activeTab, setActiveTab] = useState<Tab>('home');

  const getPageTitle = (tab: Tab) => {
    const titles = {
      home: '首页 - 显化369',
      wishes: '愿望管理 - 显化369',
      practice: '练习中心 - 显化369', 
      progress: '进度跟踪 - 显化369',
      community: '社区分享 - 显化369',
      settings: '应用设置 - 显化369'
    };
    return titles[tab] || '显化369';
  };

  const getPageDescription = (tab: Tab) => {
    const descriptions = {
      home: '开始您的369显化之旅，创建愿望，跟踪进度，实现目标',
      wishes: '创建和管理您的显化愿望，设置目标，追踪显化进度',
      practice: '进行每日369练习，专注冥想，书写肯定句，强化显化能量',
      progress: '查看您的显化进度，分析练习数据，庆祝成就里程碑',
      community: '与其他显化者交流经验，分享成功故事，互相激励',
      settings: '个性化设置您的显化369应用，优化使用体验'
    };
    return descriptions[tab] || '显化369应用';
  };

  const renderContent = () => {
    try {
      switch (activeTab) {
        case 'home':
          return (
            <>
              <HomeView />
              <InternalLinks currentPage="/" />
            </>
          );
        case 'wishes':
          return (
            <>
              <WishesView />
              <InternalLinks currentPage="/wishes" />
            </>
          );
        case 'practice':
          return (
            <>
              <PracticeView />
              <InternalLinks currentPage="/practice" />
            </>
          );
        case 'progress':
          return (
            <>
              <ProgressView />
              <InternalLinks currentPage="/progress" />
            </>
          );
        case 'community':
          return (
            <>
              <CommunityView />
              <InternalLinks currentPage="/community" />
            </>
          );
        case 'settings':
          return <SettingsPanel />;
        default:
          return <HomeView />;
      }
    } catch (error) {
      console.error('Content rendering error:', error);
      return <HomeView />;
    }
  };

  return (
    <>
      {/* Critical CSS */}
      <CriticalCSS />
      
      {/* Redirect handling */}
      <RedirectHandler />
      
      {/* Page-specific SEO */}
      <SEOHead 
        title={getPageTitle(activeTab)}
        description={getPageDescription(activeTab)}
      />
      
      {/* Modular SEO components */}
      <ModularSEO 
        page={activeTab}
        title={getPageTitle(activeTab)}
        description={getPageDescription(activeTab)}
      />
      
      {/* Performance monitoring */}
      <PageLoadMonitor />
      <SitemapGenerator />
      
      <div className="min-h-screen bg-ios-secondary-background">
        <StatusBar />
        <Breadcrumbs />
        
        <main className="pb-20">
          {renderContent()}
        </main>
        
        <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </>
  );
};

export default Index;
