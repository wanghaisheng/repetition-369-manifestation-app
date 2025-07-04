
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Target, TrendingUp, Users, Heart } from 'lucide-react';

interface RelatedPage {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  relevance: number;
}

interface InternalLinksProps {
  currentPage: string;
  maxLinks?: number;
}

export const InternalLinks = ({ currentPage, maxLinks = 4 }: InternalLinksProps) => {
  const location = useLocation();
  
  const allPages: Record<string, RelatedPage[]> = {
    '/': [
      {
        title: '愿望管理',
        description: '创建和管理你的369显化愿望',
        href: '/wishes',
        icon: <Heart className="w-4 h-4" />,
        relevance: 0.9
      },
      {
        title: '开始练习',
        description: '立即开始369书写练习',
        href: '/practice',
        icon: <Target className="w-4 h-4" />,
        relevance: 0.85
      },
      {
        title: '查看进度',
        description: '了解你的显化进展',
        href: '/progress',
        icon: <TrendingUp className="w-4 h-4" />,
        relevance: 0.8
      },
      {
        title: '社区分享',
        description: '与其他显化者交流经验',
        href: '/community',
        icon: <Users className="w-4 h-4" />,
        relevance: 0.7
      }
    ],
    '/wishes': [
      {
        title: '开始练习',
        description: '用你的愿望开始369练习',
        href: '/practice',
        icon: <Target className="w-4 h-4" />,
        relevance: 0.95
      },
      {
        title: '查看进度',
        description: '跟踪愿望显化进度',
        href: '/progress',
        icon: <TrendingUp className="w-4 h-4" />,
        relevance: 0.85
      },
      {
        title: '首页',
        description: '返回应用首页',
        href: '/',
        icon: <Heart className="w-4 h-4" />,
        relevance: 0.6
      }
    ],
    '/practice': [
      {
        title: '愿望管理',
        description: '管理你的显化愿望',
        href: '/wishes',
        icon: <Heart className="w-4 h-4" />,
        relevance: 0.9
      },
      {
        title: '查看进度',
        description: '查看练习统计和进度',
        href: '/progress',
        icon: <TrendingUp className="w-4 h-4" />,
        relevance: 0.85
      },
      {
        title: '社区分享',
        description: '分享你的练习心得',
        href: '/community',
        icon: <Users className="w-4 h-4" />,
        relevance: 0.7
      }
    ],
    '/progress': [
      {
        title: '继续练习',
        description: '继续你的369练习',
        href: '/practice',
        icon: <Target className="w-4 h-4" />,
        relevance: 0.9
      },
      {
        title: '愿望管理',
        description: '调整和优化愿望',
        href: '/wishes',
        icon: <Heart className="w-4 h-4" />,
        relevance: 0.8
      },
      {
        title: '社区分享',
        description: '分享你的成功故事',
        href: '/community',
        icon: <Users className="w-4 h-4" />,
        relevance: 0.75
      }
    ],
    '/community': [
      {
        title: '我的进度',
        description: '查看个人显化数据',
        href: '/progress',
        icon: <TrendingUp className="w-4 h-4" />,
        relevance: 0.8
      },
      {
        title: '开始练习',
        description: '受到启发？立即开始练习',
        href: '/practice',
        icon: <Target className="w-4 h-4" />,
        relevance: 0.75
      },
      {
        title: '愿望管理',
        description: '创建新的显化愿望',
        href: '/wishes',
        icon: <Heart className="w-4 h-4" />,
        relevance: 0.7
      }
    ]
  };

  const relatedPages = allPages[currentPage] || [];
  const sortedPages = relatedPages
    .sort((a, b) => b.relevance - a.relevance)
    .slice(0, maxLinks);

  if (sortedPages.length === 0) return null;

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="text-lg">相关页面</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3">
          {sortedPages.map((page) => (
            <Link
              key={page.href}
              to={page.href}
              className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 transition-colors group"
            >
              <div className="flex items-center space-x-3">
                <div className="text-ios-blue">{page.icon}</div>
                <div>
                  <h4 className="font-medium text-gray-900 group-hover:text-ios-blue">
                    {page.title}
                  </h4>
                  <p className="text-sm text-gray-600">{page.description}</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-ios-blue" />
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// 用于页面底部的相关链接组件
export const RelatedLinks = ({ exclude = [] }: { exclude?: string[] }) => {
  const location = useLocation();
  
  const quickLinks = [
    { title: '首页', href: '/', description: '返回应用首页' },
    { title: '愿望管理', href: '/wishes', description: '管理显化愿望' },
    { title: '练习中心', href: '/practice', description: '开始369练习' },
    { title: '进度跟踪', href: '/progress', description: '查看显化进度' },
    { title: '社区分享', href: '/community', description: '交流显化经验' }
  ].filter(link => !exclude.includes(link.href) && link.href !== location.pathname);

  return (
    <div className="mt-8 pt-6 border-t border-gray-200">
      <h3 className="text-lg font-semibold mb-4">快速导航</h3>
      <div className="grid grid-cols-2 gap-4">
        {quickLinks.map((link) => (
          <Link
            key={link.href}
            to={link.href}
            className="flex flex-col p-3 rounded-lg border hover:border-ios-blue hover:bg-blue-50 transition-colors"
          >
            <span className="font-medium text-gray-900 hover:text-ios-blue">
              {link.title}
            </span>
            <span className="text-sm text-gray-600 mt-1">
              {link.description}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};
