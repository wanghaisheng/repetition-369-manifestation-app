
import { useState } from 'react';
import { HomeView } from '@/components/views/HomeView';
import { WishesView } from '@/components/views/WishesView';
import { PracticeView } from '@/components/views/PracticeView';
import { ProgressView } from '@/components/views/ProgressView';
import { CommunityView } from '@/components/views/CommunityView';
import { TabBar } from '@/components/navigation/TabBar';
import { StatusBar } from '@/components/ui/StatusBar';

export type Tab = 'home' | 'wishes' | 'practice' | 'progress' | 'community';

const Index = () => {
  const [activeTab, setActiveTab] = useState<Tab>('home');

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
    <div className="min-h-screen bg-ios-gray-light flex flex-col safe-top safe-bottom">
      <StatusBar />
      
      <main className="flex-1 overflow-hidden">
        {renderActiveView()}
      </main>

      <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Index;
