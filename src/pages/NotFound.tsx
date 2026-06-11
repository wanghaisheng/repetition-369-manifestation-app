import { useTranslation } from '@/i18n/compat';
import { m } from '@/paraglide/messages';
import { useLocation, Link } from "@tanstack/react-router";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Home, BookOpen, HelpCircle, Sparkles } from "lucide-react";
import { logger } from "@/utils/logger";
import { DEFAULT_LANGUAGE } from "@/config/routes";

const NotFound = () => {
  const { t, i18n } = useTranslation('app');
  const location = useLocation();
  const isNonDefault = i18n.language !== DEFAULT_LANGUAGE;
  const langPrefix = isNonDefault ? `/${i18n.language}` : '';

  logger.error("404 Error: User attempted to access non-existent route:", location.pathname);

  const popularPages = [
    { 
      name: m.app_notFound_home(), 
      href: isNonDefault ? `/${i18n.language}` : '/', 
      icon: Home 
    },
    { 
      name: m.app_notFound_method369(), 
      href: `${langPrefix}/method369`, 
      icon: Sparkles 
    },
    { 
      name: m.app_notFound_faq(), 
      href: `${langPrefix}/faq`, 
      icon: HelpCircle 
    },
    { 
      name: m.app_notFound_blog(), 
      href: `${langPrefix}/blog`, 
      icon: BookOpen 
    },
  ];

  return (
    <>
      <Helmet>
        <meta name="robots" content="noindex, nofollow" />
        <title>{m.app_notFound_pageTitle()}</title>
        <meta name="description" content={m.app_notFound_pageDesc()} />
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
            {m.app_notFound_title()}
          </h2>
          <p className="text-muted-foreground mb-8">
            {m.app_notFound_description()}
          </p>
          
          {/* Primary CTA */}
          <Button asChild size="lg" className="mb-8">
            <Link to={isNonDefault ? `/${i18n.language}` : '/'}>
              <Home className="w-4 h-4 mr-2" />
              {m.app_notFound_backHome()}
            </Link>
          </Button>
          
          {/* Popular Pages */}
          <div className="border-t border-border pt-6">
            <p className="text-sm text-muted-foreground mb-4">
              {m.app_notFound_explorePages()}
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
