
import React, { useState } from 'react';
import { StatusBar } from '@/components/ui/StatusBar';
import { TabBar } from '@/components/navigation/TabBar';
import { HomeView } from '@/components/views/HomeView';
import { WishesView } from '@/components/views/WishesView';
import { PracticeView } from '@/components/views/PracticeView';
import { ProgressView } from '@/components/views/ProgressView';
import { CommunityView } from '@/components/views/CommunityView';
import { SettingsPanel } from '@/components/settings/SettingsPanel';
import { UnifiedSEO } from '@/components/seo/UnifiedSEO';
import { SEOErrorBoundary } from '@/components/seo/SEOErrorBoundary';
import { EnhancedInternalLinks } from '@/components/seo/EnhancedInternalLinks';
import { SitemapGenerator } from '@/components/seo/SitemapGenerator';
import { PageLoadMonitor } from '@/components/performance/PageLoadMonitor';
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs';
import { RedirectHandler } from '@/components/seo/RedirectHandler';

type Tab = 'home' | 'wishes' | 'practice' | 'progress' | 'community' | 'settings';

const Index = () => {
  const [activeTab, setActiveTab] = useState<Tab>('home');

  const getPageSEO = (tab: Tab) => {
    const seoConfig = {
      home: {
        title: '显化369 - 愿望成真的神奇力量',
        description: '基于特斯拉369显化法则的智能练习应用，帮助您系统化实现愿望目标。开始您的显化之旅，创建愿望，跟踪进度。',
        keywords: '显化369,369方法,愿望实现,吸引力法则,特斯拉369,冥想练习,正念,个人成长'
      },
      wishes: {
        title: '愿望管理 - 显化369',
        description: '创建和管理您的显化愿望，设置具体目标，追踪显化进度。使用369方法让愿望更快实现。',
        keywords: '愿望管理,目标设定,显化练习,愿望实现,个人成长,369愿望'
      },
      practice: {
        title: '369练习中心 - 显化369',
        description: '进行每日369书写练习，专注冥想，书写肯定句，强化显化能量。跟随引导完成完整练习流程。',
        keywords: '369练习,书写练习,肯定句,冥想,正念练习,显化技巧,每日练习'
      },
      progress: {
        title: '进度跟踪 - 显化369',
        description: '查看您的显化进度，分析练习数据，庆祝成就里程碑。数据化追踪您的成长轨迹。',
        keywords: '进度跟踪,数据分析,成就统计,目标达成,个人发展,显化统计'
      },
      community: {
        title: '社区分享 - 显化369',
        description: '与其他显化者交流经验，分享成功故事，互相激励支持。加入显化369社区大家庭。',
        keywords: '社区分享,经验交流,成功故事,互动支持,励志分享,显化社区'
      },
      settings: {
        title: '应用设置 - 显化369',
        description: '个性化设置您的显化369应用，优化使用体验，自定义提醒和偏好设置。',
        keywords: '应用设置,个性化,用户偏好,通知设置,隐私设置,显化设置'
      }
    };
    
    return seoConfig[tab] || seoConfig.home;
  };

  const renderContent = () => {
    try {
      switch (activeTab) {
        case 'home':
          return (
            <div>
              <HomeView />
              <EnhancedInternalLinks currentPage="/" />
            </div>
          );
        case 'wishes':
          return (
            <div>
              <WishesView />
              <EnhancedInternalLinks currentPage="/wishes" />
            </div>
          );
        case 'practice':
          return (
            <div>
              <PracticeView />
              <EnhancedInternalLinks currentPage="/practice" />
            </div>
          );
        case 'progress':
          return (
            <div>
              <ProgressView />
              <EnhancedInternalLinks currentPage="/progress" />
            </div>
          );
        case 'community':
          return (
            <div>
              <CommunityView />
              <EnhancedInternalLinks currentPage="/community" />
            </div>
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

  const currentSEO = getPageSEO(activeTab);

  return (
    <>
      {/* 重定向处理 */}
      <RedirectHandler />
      
      {/* 统一SEO - 包含错误边界保护 */}
      <SEOErrorBoundary>
        <UnifiedSEO 
          title={currentSEO.title}
          description={currentSEO.description}
          keywords={currentSEO.keywords}
        />
      </SEOErrorBoundary>
      
      {/* 性能监控和sitemap生成 */}
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
