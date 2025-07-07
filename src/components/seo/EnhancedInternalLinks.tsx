
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Target, TrendingUp, Users, Heart, Settings } from 'lucide-react';

interface LinkItem {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  relevance: number;
}

interface EnhancedInternalLinksProps {
  currentPage?: string;
  maxLinks?: number;
  showRelatedContent?: boolean;
}

export const EnhancedInternalLinks = ({ 
  currentPage, 
  maxLinks = 4,
  showRelatedContent = true 
}: EnhancedInternalLinksProps) => {
  const location = useLocation();
  const currentPath = currentPage || location.pathname;
  
  const allLinks: Record<string, LinkItem[]> = {
    '/': [
      {
        title: '愿望管理',
        description: '创建和管理你的369显化愿望，设定目标',
        href: '/wishes',
        icon: <Heart className="w-4 h-4" />,
        relevance: 0.95
      },
      {
        title: '开始练习',
        description: '立即开始369书写练习，强化显化能量',
        href: '/practice',
        icon: <Target className="w-4 h-4" />,
        relevance: 0.9
      },
      {
        title: '进度跟踪',
        description: '查看显化进度和数据分析',
        href: '/progress',
        icon: <TrendingUp className="w-4 h-4" />,
        relevance: 0.85
      },
      {
        title: '社区分享',
        description: '与其他显化者交流经验和成功故事',
        href: '/community',
        icon: <Users className="w-4 h-4" />,
        relevance: 0.8
      }
    ],
    '/wishes': [
      {
        title: '开始练习',
        description: '用你的愿望开始369显化练习',
        href: '/practice',
        icon: <Target className="w-4 h-4" />,
        relevance: 0.98
      },
      {
        title: '查看进度',
        description: '跟踪愿望显化进度和效果分析',
        href: '/progress',
        icon: <TrendingUp className="w-4 h-4" />,
        relevance: 0.9
      },
      {
        title: '社区分享',
        description: '分享你的愿望和获得社区支持',
        href: '/community',
        icon: <Users className="w-4 h-4" />,
        relevance: 0.8
      },
      {
        title: '应用设置',
        description: '个性化你的显化体验',
        href: '/settings',
        icon: <Settings className="w-4 h-4" />,
        relevance: 0.6
      }
    ],
    '/practice': [
      {
        title: '愿望管理',
        description: '管理和优化你的显化愿望',
        href: '/wishes',
        icon: <Heart className="w-4 h-4" />,
        relevance: 0.92
      },
      {
        title: '查看进度',
        description: '查看练习统计和显化进度',
        href: '/progress',
        icon: <TrendingUp className="w-4 h-4" />,
        relevance: 0.88
      },
      {
        title: '社区分享',
        description: '分享练习心得和显化体验',
        href: '/community',
        icon: <Users className="w-4 h-4" />,
        relevance: 0.75
      }
    ],
    '/progress': [
      {
        title: '继续练习',
        description: '继续你的369显化练习',
        href: '/practice',
        icon: <Target className="w-4 h-4" />,
        relevance: 0.95
      },
      {
        title: '优化愿望',
        description: '根据数据调整和优化愿望',
        href: '/wishes',
        icon: <Heart className="w-4 h-4" />,
        relevance: 0.85
      },
      {
        title: '分享成果',
        description: '在社区分享你的显化成果',
        href: '/community',
        icon: <Users className="w-4 h-4" />,
        relevance: 0.8
      }
    ],
    '/community': [
      {
        title: '我的进度',
        description: '查看个人显化数据和成就',
        href: '/progress',
        icon: <TrendingUp className="w-4 h-4" />,
        relevance: 0.85
      },
      {
        title: '开始练习',
        description: '受到启发？立即开始369练习',
        href: '/practice',
        icon: <Target className="w-4 h-4" />,
        relevance: 0.8
      },
      {
        title: '创建愿望',
        description: '受到启发后创建新的显化愿望',
        href: '/wishes',
        icon: <Heart className="w-4 h-4" />,
        relevance: 0.75
      }
    ]
  };

  const relatedLinks = allLinks[currentPath] || [];
  const sortedLinks = relatedLinks
    .sort((a, b) => b.relevance - a.relevance)
    .slice(0, maxLinks);

  if (!showRelatedContent || sortedLinks.length === 0) return null;

  return (
    <div className="mt-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">相关功能推荐</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {sortedLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="flex items-center justify-between p-4 rounded-lg border hover:border-ios-blue hover:bg-blue-50 transition-all duration-200 group"
              >
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0 text-ios-blue group-hover:scale-110 transition-transform">
                    {link.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 group-hover:text-ios-blue transition-colors">
                      {link.title}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                      {link.description}
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-ios-blue group-hover:translate-x-1 transition-all flex-shrink-0" />
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// 页面底部快速导航组件
export const QuickNavigation = () => {
  const location = useLocation();
  
  const navItems = [
    { title: '首页', href: '/', icon: <Heart className="w-4 h-4" /> },
    { title: '愿望', href: '/wishes', icon: <Target className="w-4 h-4" /> },
    { title: '练习', href: '/practice', icon: <Target className="w-4 h-4" /> },
    { title: '进度', href: '/progress', icon: <TrendingUp className="w-4 h-4" /> },
    { title: '社区', href: '/community', icon: <Users className="w-4 h-4" /> }
  ].filter(item => item.href !== location.pathname);

  return (
    <div className="mt-6 pt-4 border-t border-gray-200">
      <h3 className="text-sm font-medium text-gray-700 mb-3">快速导航</h3>
      <div className="flex flex-wrap gap-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            className="inline-flex items-center space-x-2 px-3 py-2 rounded-full bg-gray-100 hover:bg-ios-blue hover:text-white transition-colors text-sm"
          >
            {item.icon}
            <span>{item.title}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};
