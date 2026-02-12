import { useLocation, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Home, Search, BookOpen, HelpCircle, Sparkles } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const { t, i18n } = useTranslation(['common']);
  const isEnglish = i18n.language === 'en' || location.pathname.startsWith('/en');

  useEffect(() => {
    // Log 404 for analytics
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  const popularPages = [
    { 
      name: isEnglish ? "Home" : "首页", 
      href: isEnglish ? "/en" : "/", 
      icon: Home 
    },
    { 
      name: isEnglish ? "369 Method" : "369法则", 
      href: isEnglish ? "/en/method369" : "/method369", 
      icon: Sparkles 
    },
    { 
      name: isEnglish ? "FAQ" : "常见问题", 
      href: isEnglish ? "/en/faq" : "/faq", 
      icon: HelpCircle 
    },
    { 
      name: isEnglish ? "Blog" : "博客", 
      href: isEnglish ? "/en/blog" : "/blog", 
      icon: BookOpen 
    },
  ];

  return (
    <>
      <Helmet>
        {/* Critical: noindex to prevent 404 pages from being indexed */}
        <meta name="robots" content="noindex, nofollow" />
        <title>{isEnglish ? "Page Not Found | 369 Manifestation" : "页面未找到 | 369显化法"}</title>
        <meta name="description" content={isEnglish 
          ? "The page you're looking for doesn't exist. Return to our homepage or explore popular pages."
          : "您访问的页面不存在。返回首页或探索热门页面。"
        } />
      </Helmet>
      
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          {/* 404 Visual */}
          <div className="mb-8">
            <h1 className="text-8xl font-bold text-primary/20 mb-2">404</h1>
            <div className="w-16 h-1 bg-primary mx-auto rounded-full" />
          </div>
          
          {/* Message */}
          <h2 className="text-2xl font-semibold text-foreground mb-3">
            {isEnglish ? "Page Not Found" : "页面未找到"}
          </h2>
          <p className="text-muted-foreground mb-8">
            {isEnglish 
              ? "The page you're looking for doesn't exist or has been moved."
              : "您访问的页面不存在或已被移动。"
            }
          </p>
          
          {/* Primary CTA */}
          <Button asChild size="lg" className="mb-8">
            <Link to={isEnglish ? "/en" : "/"}>
              <Home className="w-4 h-4 mr-2" />
              {isEnglish ? "Back to Home" : "返回首页"}
            </Link>
          </Button>
          
          {/* Popular Pages */}
          <div className="border-t border-border pt-6">
            <p className="text-sm text-muted-foreground mb-4">
              {isEnglish ? "Or explore these pages:" : "或探索这些页面："}
            </p>
            <div className="grid grid-cols-2 gap-3">
              {popularPages.map((page) => (
                <Link
                  key={page.href}
                  to={page.href}
                  className="flex items-center justify-center gap-2 p-3 rounded-lg border border-border hover:bg-accent hover:text-accent-foreground transition-colors text-sm"
                >
                  <page.icon className="w-4 h-4" />
                  {page.name}
                </Link>
              ))}
            </div>
          </div>
          
          {/* Debug info for development */}
          {process.env.NODE_ENV === 'development' && (
            <p className="mt-8 text-xs text-muted-foreground/50">
              Requested path: {location.pathname}
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default NotFound;
