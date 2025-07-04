
import { useLocation, Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { generateBreadcrumbs } from '@/utils/seo';

export const Breadcrumbs = () => {
  const location = useLocation();
  const breadcrumbs = generateBreadcrumbs(location.pathname);

  if (breadcrumbs.length <= 1) {
    return null;
  }

  return (
    <nav className="flex items-center space-x-1 text-sm text-gray-500 py-2 px-4" aria-label="面包屑导航">
      <ol className="flex items-center space-x-1">
        {breadcrumbs.map((crumb, index) => (
          <li key={crumb.href} className="flex items-center">
            {index > 0 && <ChevronRight className="w-4 h-4 mx-1" />}
            {index === 0 ? (
              <Link 
                to={crumb.href} 
                className="flex items-center hover:text-blue-600 transition-colors"
                aria-label="返回首页"
              >
                <Home className="w-4 h-4" />
                <span className="ml-1">{crumb.name}</span>
              </Link>
            ) : index === breadcrumbs.length - 1 ? (
              <span className="text-gray-700 font-medium" aria-current="page">
                {crumb.name}
              </span>
            ) : (
              <Link 
                to={crumb.href} 
                className="hover:text-blue-600 transition-colors"
              >
                {crumb.name}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};
