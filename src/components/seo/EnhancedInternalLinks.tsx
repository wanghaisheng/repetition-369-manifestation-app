import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  Target, 
  BookOpen, 
  TrendingUp, 
  Users, 
  HelpCircle,
  Info,
  Sparkles,
  Brain,
  PenTool,
  Trophy,
  Wrench,
  Heart,
  DollarSign,
  Briefcase,
  Star,
  Zap,
  Moon,
  Clock,
  FileText,
  Lightbulb
} from 'lucide-react';

interface InternalLinkProps {
  to: string;
  title: string;
  description: string;
  icon: React.ElementType;
  className?: string;
}

// Topic Cluster 定义
type ClusterType = 'tutorial' | 'science' | 'practice' | 'stories' | 'tools';

interface ClusterLink {
  to: string;
  titleKey: string;
  descriptionKey: string;
  icon: React.ElementType;
  cluster: ClusterType;
  page: string;
  priority: 'P0' | 'P1' | 'P2';
}

// 完整的Topic Cluster内链配置
const CLUSTER_LINKS: ClusterLink[] = [
  // 支柱页面
  { to: '/method369', titleKey: 'internalLinks.method369', descriptionKey: 'internalLinks.method369Desc', icon: Target, cluster: 'tutorial', page: 'method369', priority: 'P0' },
  { to: '/about', titleKey: 'internalLinks.about', descriptionKey: 'internalLinks.aboutDesc', icon: Info, cluster: 'tutorial', page: 'about', priority: 'P0' },
  { to: '/faq', titleKey: 'internalLinks.faq', descriptionKey: 'internalLinks.faqDesc', icon: HelpCircle, cluster: 'tutorial', page: 'faq', priority: 'P0' },
  { to: '/user-stories', titleKey: 'internalLinks.userStories', descriptionKey: 'internalLinks.userStoriesDesc', icon: Users, cluster: 'stories', page: 'user-stories', priority: 'P0' },
  { to: '/blog', titleKey: 'internalLinks.blog', descriptionKey: 'internalLinks.blogDesc', icon: BookOpen, cluster: 'tools', page: 'blog', priority: 'P0' },
  
  // 集群1: 入门教程
  { to: '/blog/what-is-369-manifestation', titleKey: 'internalLinks.whatIs369', descriptionKey: 'internalLinks.whatIs369Desc', icon: Lightbulb, cluster: 'tutorial', page: 'what-is-369', priority: 'P0' },
  { to: '/blog/369-manifestation-steps', titleKey: 'internalLinks.369Steps', descriptionKey: 'internalLinks.369StepsDesc', icon: FileText, cluster: 'tutorial', page: '369-steps', priority: 'P0' },
  { to: '/blog/369-manifestation-beginners', titleKey: 'internalLinks.369Beginners', descriptionKey: 'internalLinks.369BeginnersDesc', icon: Star, cluster: 'tutorial', page: '369-beginners', priority: 'P0' },
  { to: '/blog/tesla-369-theory', titleKey: 'internalLinks.tesla369', descriptionKey: 'internalLinks.tesla369Desc', icon: Zap, cluster: 'tutorial', page: 'tesla-369', priority: 'P1' },
  
  // 集群2: 科学原理
  { to: '/blog/manifestation-science', titleKey: 'internalLinks.manifestationScience', descriptionKey: 'internalLinks.manifestationScienceDesc', icon: Brain, cluster: 'science', page: 'manifestation-science', priority: 'P0' },
  { to: '/blog/neuroplasticity-manifestation', titleKey: 'internalLinks.neuroplasticity', descriptionKey: 'internalLinks.neuroplasticityDesc', icon: Brain, cluster: 'science', page: 'neuroplasticity', priority: 'P0' },
  { to: '/blog/law-of-attraction-science', titleKey: 'internalLinks.lawOfAttraction', descriptionKey: 'internalLinks.lawOfAttractionDesc', icon: Sparkles, cluster: 'science', page: 'law-of-attraction', priority: 'P0' },
  { to: '/blog/subconscious-mind-manifestation', titleKey: 'internalLinks.subconscious', descriptionKey: 'internalLinks.subconsciousDesc', icon: Brain, cluster: 'science', page: 'subconscious', priority: 'P0' },
  
  // 集群3: 实践技巧
  { to: '/blog/manifestation-techniques', titleKey: 'internalLinks.techniques', descriptionKey: 'internalLinks.techniquesDesc', icon: PenTool, cluster: 'practice', page: 'techniques', priority: 'P0' },
  { to: '/blog/how-to-write-affirmations', titleKey: 'internalLinks.writeAffirmations', descriptionKey: 'internalLinks.writeAffirmationsDesc', icon: PenTool, cluster: 'practice', page: 'write-affirmations', priority: 'P0' },
  { to: '/blog/manifestation-journal-guide', titleKey: 'internalLinks.journalGuide', descriptionKey: 'internalLinks.journalGuideDesc', icon: BookOpen, cluster: 'practice', page: 'journal-guide', priority: 'P0' },
  { to: '/blog/morning-manifestation-routine', titleKey: 'internalLinks.morningRoutine', descriptionKey: 'internalLinks.morningRoutineDesc', icon: Clock, cluster: 'practice', page: 'morning-routine', priority: 'P0' },
  { to: '/blog/visualization-meditation-guide', titleKey: 'internalLinks.visualization', descriptionKey: 'internalLinks.visualizationDesc', icon: Sparkles, cluster: 'practice', page: 'visualization', priority: 'P0' },
  
  // 集群4: 成功案例
  { to: '/blog/369-career-success-stories', titleKey: 'internalLinks.careerStories', descriptionKey: 'internalLinks.careerStoriesDesc', icon: Briefcase, cluster: 'stories', page: 'career-stories', priority: 'P0' },
  { to: '/blog/369-money-manifestation-stories', titleKey: 'internalLinks.moneyStories', descriptionKey: 'internalLinks.moneyStoriesDesc', icon: DollarSign, cluster: 'stories', page: 'money-stories', priority: 'P0' },
  { to: '/blog/369-love-manifestation-stories', titleKey: 'internalLinks.loveStories', descriptionKey: 'internalLinks.loveStoriesDesc', icon: Heart, cluster: 'stories', page: 'love-stories', priority: 'P0' },
  
  // 集群5: 工具资源
  { to: '/blog/manifestation-tools', titleKey: 'internalLinks.tools', descriptionKey: 'internalLinks.toolsDesc', icon: Wrench, cluster: 'tools', page: 'tools', priority: 'P0' },
  { to: '/blog/best-manifestation-apps', titleKey: 'internalLinks.bestApps', descriptionKey: 'internalLinks.bestAppsDesc', icon: Sparkles, cluster: 'tools', page: 'best-apps', priority: 'P0' },
  { to: '/blog/369-journal-template', titleKey: 'internalLinks.journalTemplate', descriptionKey: 'internalLinks.journalTemplateDesc', icon: FileText, cluster: 'tools', page: 'journal-template', priority: 'P0' },
];

// 页面到集群的映射
const PAGE_CLUSTER_MAP: Record<string, ClusterType[]> = {
  'landing': ['tutorial', 'science', 'practice', 'stories', 'tools'],
  'method369': ['tutorial', 'science', 'practice'],
  'about': ['tutorial', 'stories'],
  'faq': ['tutorial', 'practice', 'tools'],
  'user-stories': ['stories', 'practice', 'tutorial'],
  'blog': ['tutorial', 'science', 'practice', 'stories', 'tools'],
  'privacy': ['tutorial', 'tools'],
  'terms': ['tutorial', 'tools'],
};

// 获取相关内链的函数
const getRelatedLinks = (
  currentPage: string, 
  maxLinks: number = 12, 
  includeAllClusters: boolean = false
): ClusterLink[] => {
  const relevantClusters = PAGE_CLUSTER_MAP[currentPage] || ['tutorial', 'practice'];
  
  // 过滤掉当前页面
  const availableLinks = CLUSTER_LINKS.filter(link => link.page !== currentPage);
  
  // 按优先级和相关性排序
  const sortedLinks = availableLinks.sort((a, b) => {
    // 首先按优先级排序
    const priorityOrder = { 'P0': 0, 'P1': 1, 'P2': 2 };
    const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
    if (priorityDiff !== 0) return priorityDiff;
    
    // 然后按集群相关性排序
    const aRelevant = relevantClusters.includes(a.cluster);
    const bRelevant = relevantClusters.includes(b.cluster);
    if (aRelevant && !bRelevant) return -1;
    if (!aRelevant && bRelevant) return 1;
    
    return 0;
  });
  
  // 如果需要包含所有集群，确保每个集群都有代表
  if (includeAllClusters) {
    const clusterCounts: Record<ClusterType, number> = {
      'tutorial': 0, 'science': 0, 'practice': 0, 'stories': 0, 'tools': 0
    };
    const selectedLinks: ClusterLink[] = [];
    const minPerCluster = Math.floor(maxLinks / 5);
    
    // 首先确保每个集群有最少数量的链接
    for (const link of sortedLinks) {
      if (clusterCounts[link.cluster] < minPerCluster) {
        selectedLinks.push(link);
        clusterCounts[link.cluster]++;
      }
      if (selectedLinks.length >= maxLinks) break;
    }
    
    // 填充剩余位置
    for (const link of sortedLinks) {
      if (!selectedLinks.includes(link) && selectedLinks.length < maxLinks) {
        selectedLinks.push(link);
      }
    }
    
    return selectedLinks;
  }
  
  return sortedLinks.slice(0, maxLinks);
};

const InternalLinkCard: React.FC<InternalLinkProps> = ({ 
  to, 
  title, 
  description, 
  icon: Icon, 
  className = '' 
}) => (
  <Link 
    to={to}
    className={`group block p-4 bg-card hover:bg-accent/50 rounded-lg border transition-all duration-200 hover:shadow-lg ${className}`}
  >
    <div className="flex items-start space-x-3">
      <div className="flex-shrink-0">
        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
          <Icon className="w-5 h-5 text-primary" />
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
          {description}
        </p>
      </div>
    </div>
  </Link>
);

// 紧凑型内链卡片（用于列表形式）
const CompactLinkCard: React.FC<InternalLinkProps> = ({ 
  to, 
  title, 
  icon: Icon 
}) => (
  <Link 
    to={to}
    className="group flex items-center space-x-2 p-2 hover:bg-accent/30 rounded-md transition-colors"
  >
    <Icon className="w-4 h-4 text-primary/70 group-hover:text-primary transition-colors" />
    <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
      {title}
    </span>
  </Link>
);

interface EnhancedInternalLinksProps {
  currentPage?: string;
  maxLinks?: number;
  layout?: 'grid' | 'list' | 'compact';
  showClusterLabels?: boolean;
}

export const EnhancedInternalLinks: React.FC<EnhancedInternalLinksProps> = ({ 
  currentPage = 'landing',
  maxLinks = 12,
  layout = 'grid',
  showClusterLabels = false
}) => {
  const { t, i18n } = useTranslation(['common', 'marketing']);
  
  const relevantLinks = getRelatedLinks(currentPage, maxLinks, true);

  if (relevantLinks.length === 0) {
    return null;
  }

  const clusterLabels: Record<ClusterType, string> = {
    tutorial: i18n.language === 'zh' ? '入门教程' : 'Getting Started',
    science: i18n.language === 'zh' ? '科学原理' : 'Science',
    practice: i18n.language === 'zh' ? '实践技巧' : 'Practice',
    stories: i18n.language === 'zh' ? '成功案例' : 'Success Stories',
    tools: i18n.language === 'zh' ? '工具资源' : 'Tools & Resources',
  };

  // 按集群分组
  const groupedLinks = relevantLinks.reduce((acc, link) => {
    if (!acc[link.cluster]) acc[link.cluster] = [];
    acc[link.cluster].push(link);
    return acc;
  }, {} as Record<ClusterType, ClusterLink[]>);

  if (layout === 'compact') {
    return (
      <section className="mt-8 mb-6">
        <div className="border-t pt-6">
          <h2 className="text-base font-semibold text-foreground mb-3">
            {i18n.language === 'zh' ? '相关内容' : 'Related Content'}
          </h2>
          <div className="flex flex-wrap gap-1">
            {relevantLinks.slice(0, 8).map((link) => (
              <CompactLinkCard
                key={link.to}
                to={link.to}
                title={t(link.titleKey, { defaultValue: link.titleKey.split('.').pop() })}
                description=""
                icon={link.icon}
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (showClusterLabels) {
    return (
      <section className="mt-12 mb-8">
        <div className="border-t pt-8">
          <h2 className="text-lg font-semibold text-foreground mb-6">
            {i18n.language === 'zh' ? '探索更多内容' : 'Explore More Content'}
          </h2>
          {Object.entries(groupedLinks).map(([cluster, links]) => (
            <div key={cluster} className="mb-6">
              <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center">
                <span className="w-2 h-2 rounded-full bg-primary mr-2"></span>
                {clusterLabels[cluster as ClusterType]}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {links.map((link) => (
                  <InternalLinkCard
                    key={link.to}
                    to={link.to}
                    title={t(link.titleKey, { defaultValue: link.titleKey.split('.').pop() })}
                    description={t(link.descriptionKey, { defaultValue: '' })}
                    icon={link.icon}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="mt-12 mb-8">
      <div className="border-t pt-8">
        <h2 className="text-lg font-semibold text-foreground mb-4">
          {i18n.language === 'zh' ? '相关页面' : 'Related Pages'}
        </h2>
        <div className={`grid gap-4 ${
          layout === 'list' 
            ? 'grid-cols-1' 
            : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
        }`}>
          {relevantLinks.map((link) => (
            <InternalLinkCard
              key={link.to}
              to={link.to}
              title={t(link.titleKey, { defaultValue: link.titleKey.split('.').pop() })}
              description={t(link.descriptionKey, { defaultValue: '' })}
              icon={link.icon}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

// 首页专用内链组件 - 展示所有5个集群
export const HomePageLinks: React.FC = () => {
  const { i18n } = useTranslation();
  
  const clusterConfig: { cluster: ClusterType; icon: React.ElementType }[] = [
    { cluster: 'tutorial', icon: BookOpen },
    { cluster: 'science', icon: Brain },
    { cluster: 'practice', icon: PenTool },
    { cluster: 'stories', icon: Trophy },
    { cluster: 'tools', icon: Wrench },
  ];

  const clusterLabels: Record<ClusterType, { zh: string; en: string; desc_zh: string; desc_en: string }> = {
    tutorial: { 
      zh: '入门教程', 
      en: 'Getting Started',
      desc_zh: '从零开始学习369显化法的完整指南',
      desc_en: 'Complete guide to learn 369 manifestation from scratch'
    },
    science: { 
      zh: '科学原理', 
      en: 'Science Behind',
      desc_zh: '了解显化背后的神经科学与心理学',
      desc_en: 'Understand the neuroscience and psychology behind manifestation'
    },
    practice: { 
      zh: '实践技巧', 
      en: 'Practice Tips',
      desc_zh: '掌握有效的显化练习方法与技巧',
      desc_en: 'Master effective manifestation practice methods and tips'
    },
    stories: { 
      zh: '成功案例', 
      en: 'Success Stories',
      desc_zh: '真实用户的显化成功故事分享',
      desc_en: 'Real user manifestation success stories'
    },
    tools: { 
      zh: '工具资源', 
      en: 'Tools & Resources',
      desc_zh: '显化App、模板、书籍等资源推荐',
      desc_en: 'Recommended apps, templates, books and resources'
    },
  };

  const clusterUrls: Record<ClusterType, string> = {
    tutorial: '/method369',
    science: '/blog/manifestation-science',
    practice: '/blog/manifestation-techniques',
    stories: '/user-stories',
    tools: '/blog/manifestation-tools',
  };

  const isZh = i18n.language === 'zh';

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto max-w-6xl px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-foreground mb-4">
          {isZh ? '探索369显化法' : 'Explore 369 Manifestation'}
        </h2>
        <p className="text-center text-muted-foreground mb-10 max-w-2xl mx-auto">
          {isZh 
            ? '深入了解369显化法的各个方面，从科学原理到实践技巧，从成功案例到实用工具'
            : 'Dive deep into all aspects of 369 manifestation, from science to practice, from success stories to useful tools'
          }
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clusterConfig.map(({ cluster, icon: Icon }) => (
            <Link
              key={cluster}
              to={clusterUrls[cluster]}
              className="group block p-6 bg-card hover:bg-accent/50 rounded-xl border shadow-sm hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                  {isZh ? clusterLabels[cluster].zh : clusterLabels[cluster].en}
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                {isZh ? clusterLabels[cluster].desc_zh : clusterLabels[cluster].desc_en}
              </p>
            </Link>
          ))}
        </div>
        
        {/* 额外的热门链接 */}
        <div className="mt-12 pt-8 border-t">
          <h3 className="text-lg font-semibold text-foreground mb-4 text-center">
            {isZh ? '热门文章' : 'Popular Articles'}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {CLUSTER_LINKS.filter(l => l.priority === 'P0').slice(0, 8).map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="group flex items-center space-x-2 p-3 bg-background hover:bg-accent/30 rounded-lg border transition-colors"
              >
                <link.icon className="w-4 h-4 text-primary/70 group-hover:text-primary transition-colors flex-shrink-0" />
                <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors truncate">
                  {isZh 
                    ? link.titleKey.split('.').pop()?.replace(/([A-Z])/g, ' $1').trim()
                    : link.titleKey.split('.').pop()?.replace(/([A-Z])/g, ' $1').trim()
                  }
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// 侧边栏内链组件
export const SidebarLinks: React.FC<{ currentPage?: string }> = ({ currentPage = 'landing' }) => {
  const { i18n } = useTranslation();
  const isZh = i18n.language === 'zh';
  const relevantLinks = getRelatedLinks(currentPage, 8, false);

  return (
    <aside className="bg-muted/30 rounded-lg p-4">
      <h3 className="font-semibold text-foreground mb-3 text-sm">
        {isZh ? '相关阅读' : 'Related Reading'}
      </h3>
      <nav className="space-y-1">
        {relevantLinks.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className="group flex items-center space-x-2 p-2 hover:bg-accent/50 rounded-md transition-colors"
          >
            <link.icon className="w-4 h-4 text-primary/60 group-hover:text-primary transition-colors" />
            <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
              {link.titleKey.split('.').pop()?.replace(/([A-Z])/g, ' $1').trim()}
            </span>
          </Link>
        ))}
      </nav>
    </aside>
  );
};