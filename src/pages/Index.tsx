
import { useState } from 'react';
import { HomeView } from '@/components/views/HomeView';
import { WishesView } from '@/components/views/WishesView';
import { PracticeView } from '@/components/views/PracticeView';
import { ProgressView } from '@/components/views/ProgressView';
import { CommunityView } from '@/components/views/CommunityView';
import { TabBar } from '@/components/navigation/TabBar';
import { StatusBar } from '@/components/ui/StatusBar';
import { SEOHead } from '@/components/seo/SEOHead';
import { WebAppStructuredData, OrganizationStructuredData } from '@/components/seo/StructuredData';
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs';

export type Tab = 'home' | 'wishes' | 'practice' | 'progress' | 'community';

const Index = () => {
  const [activeTab, setActiveTab] = useState<Tab>('home');

  const getPageSEOData = () => {
    switch (activeTab) {
      case 'wishes':
        return {
          title: '愿望管理 - 创建和管理您的显化愿望',
          description: '在显化369中创建、编辑和管理您的愿望。设定明确的目标，让显化过程更加有效。',
          url: 'https://xianghua369.com/wishes'
        };
      case 'practice':
        return {
          title: '练习中心 - 369显化练习',
          description: '通过369方法进行每日显化练习。上午3次、下午6次、晚上9次，让愿望成真。',
          url: 'https://xianghua369.com/practice'
        };
      case 'progress':
        return {
          title: '进度跟踪 - 显化成果统计',
          description: '追踪您的显化练习进度，查看统计数据和成就，保持动力持续前进。',
          url: 'https://xianghua369.com/progress'
        };
      case 'community':
        return {
          title: '社区分享 - 显化经验交流',
          description: '与其他显化者分享经验，获得灵感和支持，一起在显化路上成长。',
          url: 'https://xianghua369.com/community'
        };
      default:
        return {
          title: '显化369 - 愿望成真的神奇力量',
          description: '一款极简优雅的显化练习应用，通过369方法帮助您实现愿望。支持愿望管理、书写练习、进度跟踪和社区分享。',
          url: 'https://xianghua369.com'
        };
    }
  };

  const seoData = getPageSEOData();

  const renderActiveView = () => {
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
      default:
        return <HomeView />;
    }
  };

  return (
    <>
      <SEOHead {...seoData} />
      <WebAppStructuredData />
      <OrganizationStructuredData />
      
      <div className="min-h-screen bg-ios-gray-light flex flex-col safe-top safe-bottom">
        <StatusBar />
        <Breadcrumbs />
        
        <main className="flex-1 overflow-hidden">
          {renderActiveView()}
        </main>

        <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </>
  );
};

export default Index;
