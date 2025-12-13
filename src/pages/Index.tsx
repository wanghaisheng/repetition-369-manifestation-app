import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TabBar } from '@/components/navigation/TabBar';
import { DrawerMenu } from '@/components/navigation/DrawerMenu';
import { HomeView } from '@/components/views/HomeView';
import { WishesView } from '@/components/views/WishesView';
import { PracticeView } from '@/components/views/PracticeView';
import { ProgressView } from '@/components/views/ProgressView';
import { CommunityView } from '@/components/views/CommunityView';
import { SettingsPanel } from '@/components/settings/SettingsPanel';
import { UnifiedSEO } from '@/components/seo/UnifiedSEO';
import { SEOErrorBoundary } from '@/components/seo/SEOErrorBoundary';
import { SitemapGenerator } from '@/components/seo/SitemapGenerator';
import { PageLoadMonitor } from '@/components/performance/PageLoadMonitor';
import { RedirectHandler } from '@/components/seo/RedirectHandler';
import { useSwipeNavigation } from '@/hooks/useSwipeNavigation';

type Tab = 'home' | 'wishes' | 'practice' | 'progress' | 'community' | 'settings';

// Tab order for swipe navigation
const TAB_ORDER: Tab[] = ['home', 'wishes', 'practice', 'progress', 'community'];

const Index = () => {
  const { tab } = useParams<{ tab: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [slideDirection, setSlideDirection] = useState<'left' | 'right' | null>(null);

  // 同步路由参数和状态
  useEffect(() => {
    const validTabs: Tab[] = ['home', 'wishes', 'practice', 'progress', 'community', 'settings'];
    const currentTab = tab as Tab;
    
    if (validTabs.includes(currentTab)) {
      setActiveTab(currentTab);
    } else {
      navigate('/app/home', { replace: true });
    }
  }, [tab, navigate]);

  // Get current tab index
  const currentTabIndex = TAB_ORDER.indexOf(activeTab);

  // Swipe handlers
  const handleSwipeLeft = useCallback(() => {
    if (currentTabIndex < TAB_ORDER.length - 1 && currentTabIndex >= 0) {
      const nextTab = TAB_ORDER[currentTabIndex + 1];
      setSlideDirection('left');
      navigate(`/app/${nextTab}`);
    }
  }, [currentTabIndex, navigate]);

  const handleSwipeRight = useCallback(() => {
    if (currentTabIndex > 0) {
      const prevTab = TAB_ORDER[currentTabIndex - 1];
      setSlideDirection('right');
      navigate(`/app/${prevTab}`);
    }
  }, [currentTabIndex, navigate]);

  // Initialize swipe navigation
  const { containerRef, isSwiping, swipeProgress } = useSwipeNavigation({
    onSwipeLeft: handleSwipeLeft,
    onSwipeRight: handleSwipeRight,
    threshold: 100,
    enabled: TAB_ORDER.includes(activeTab), // Disable swipe on settings
  });

  // Reset slide direction after animation
  useEffect(() => {
    if (slideDirection) {
      const timer = setTimeout(() => setSlideDirection(null), 300);
      return () => clearTimeout(timer);
    }
  }, [slideDirection, activeTab]);

  // 处理tab切换
  const handleTabChange = (newTab: Tab) => {
    const newIndex = TAB_ORDER.indexOf(newTab);
    const oldIndex = TAB_ORDER.indexOf(activeTab);
    
    if (newIndex > oldIndex) {
      setSlideDirection('left');
    } else if (newIndex < oldIndex) {
      setSlideDirection('right');
    }
    
    navigate(`/app/${newTab}`);
  };

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
          return <HomeView />;
        case 'wishes':
          return <WishesView />;
        case 'practice':
          return <PracticeView />;
        case 'progress':
          return <ProgressView />;
        case 'community':
          return <CommunityView />;
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

  // Calculate transform for swipe visual feedback
  const swipeTransform = isSwiping ? `translateX(${swipeProgress * 30}px)` : '';
  
  // Get animation class based on slide direction
  const getSlideClass = () => {
    if (!slideDirection) return '';
    return slideDirection === 'left' ? 'animate-slide-in-left' : 'animate-slide-in-right';
  };

  return (
    <>
      <RedirectHandler />
      
      <SEOErrorBoundary>
        <UnifiedSEO 
          title={currentSEO.title}
          description={currentSEO.description}
          keywords={currentSEO.keywords}
        />
      </SEOErrorBoundary>
      
      <PageLoadMonitor />
      <SitemapGenerator />
      
      <div className="min-h-screen bg-ios-secondary-background">
        <DrawerMenu activeTab={activeTab} onTabChange={handleTabChange} />
        
        <main 
          ref={containerRef}
          className="pb-20 overflow-hidden"
          style={{ 
            transform: swipeTransform,
            transition: isSwiping ? 'none' : 'transform 0.3s ease-out'
          }}
        >
          <div 
            key={activeTab} 
            className={`${getSlideClass()}`}
          >
            {renderContent()}
          </div>
        </main>
        
        {/* Swipe indicator dots */}
        {TAB_ORDER.includes(activeTab) && (
          <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 flex gap-1.5 z-10">
            {TAB_ORDER.map((t, index) => (
              <div
                key={t}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
                  index === currentTabIndex 
                    ? 'bg-ios-blue w-4' 
                    : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        )}
        
        <TabBar activeTab={activeTab} onTabChange={handleTabChange} />
      </div>
    </>
  );
};

export default Index;
