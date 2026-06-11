import React from 'react';
import { Link, useLocation } from '@tanstack/react-router';
import { ChevronRight, Home } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { m } from '@/paraglide/messages';

export const Breadcrumbs = () => {
  const location = useLocation();
  const routeNames: Record<string, string> = {
    '': m.common_nav_home(),
    'wishes': m.common_nav_wishes(),
    'practice': m.common_nav_practice(),
    'progress': m.common_nav_progress(),
    'community': m.common_nav_community(),
    'auth': m.common_nav_auth(),
    'about': m.common_nav_about(),
    'faq': m.common_nav_faq()
  };

  const paths = location.pathname.split('/').filter(Boolean);
  
  const breadcrumbs = [
    { name: m.common_nav_home(), href: '/' }
  ];

  let currentPath = '';
  paths.forEach(path => {
    currentPath += `/${path}`;
    const name = routeNames[path] || path;
    breadcrumbs.push({
      name,
      href: currentPath
    });
  });

  // 生成JSON-LD结构化数据
  const breadcrumbStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((breadcrumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: breadcrumb.name,
      item: `https://369.heymanifestation.com${breadcrumb.href}`
    }))
  };

  if (breadcrumbs.length <= 1) {
    return null; // 首页不显示面包屑
  }

  return (
    <>
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbStructuredData)}
        </script>
      </Helmet>
      
      <nav className="flex items-center space-x-1 text-sm text-muted-foreground mb-4" aria-label="breadcrumb">
        {breadcrumbs.map((breadcrumb, index) => (
          <div key={breadcrumb.href} className="flex items-center">
            {index > 0 && <ChevronRight className="w-4 h-4 mx-1" />}
            {index === breadcrumbs.length - 1 ? (
              <span className="text-foreground font-medium">
                {breadcrumb.name}
              </span>
            ) : (
              <Link 
                to={breadcrumb.href}
                className="hover:text-foreground transition-colors"
              >
                <span className="flex items-center">
                  {index === 0 && <Home className="w-4 h-4 mr-1" />}
                  {breadcrumb.name}
                </span>
              </Link>
            )}
          </div>
        ))}
      </nav>
    </>
  );
};