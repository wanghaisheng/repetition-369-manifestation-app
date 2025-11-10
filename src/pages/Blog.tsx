import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AdvancedStructuredData } from '@/components/seo/AdvancedStructuredData';
import { SocialMediaCards } from '@/components/seo/SocialMediaCards';
import { UnifiedSEO } from '@/components/seo/UnifiedSEO';
import { LanguageSwitcher } from '@/components/i18n/LanguageSwitcher';
import { supabase } from '@/integrations/supabase/client';
import { SkeletonLoader, CardSkeleton } from '@/components/performance/SkeletonLoader';
import { 
  Sparkles, 
  ArrowLeft,
  BookOpen,
  Calendar,
  Clock,
  User,
  Tag,
  Search,
  Filter
} from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  author: string;
  category: string;
  tags: string[];
  featured_image?: string;
  reading_time?: number;
  created_at: string;
  view_count: number;
  featured: boolean;
}

const Blog = () => {
  const { t, i18n } = useTranslation(['app', 'common']);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { key: 'all', label: t('app:blog.categories.all') },
    { key: 'founder-story', label: t('app:blog.categories.founder_story') },
    { key: 'build-in-public', label: t('app:blog.categories.build_in_public') },
    { key: 'manifestation', label: t('app:blog.categories.manifestation') },
    { key: 'technical', label: t('app:blog.categories.technical') },
  ];

  useEffect(() => {
    fetchPosts();
  }, [i18n.language, selectedCategory, searchQuery]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('blog_posts')
        .select('*')
        .eq('published', true)
        .eq('language', i18n.language)
        .order('created_at', { ascending: false });

      if (selectedCategory !== 'all') {
        query = query.eq('category', selectedCategory);
      }

      if (searchQuery) {
        query = query.or(`title.ilike.%${searchQuery}%,excerpt.ilike.%${searchQuery}%`);
      }

      const { data, error } = await query;

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(i18n.language === 'zh' ? 'zh-CN' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  const featuredPosts = posts.filter(post => post.featured).slice(0, 2);
  const regularPosts = posts.filter(post => !post.featured);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <UnifiedSEO 
        title={t('app:blog.title') + ' - ' + t('app:blog.subtitle')}
        description={t('app:blog.subtitle')}
        type="website"
        keywords={i18n.language === 'zh' ? '显化369博客,显化方法,成功案例,创始人故事,独立开发' : 'manifestation 369 blog,manifestation method,success stories,founder story,indie development'}
      />
      <AdvancedStructuredData 
        type="WebPage"
        title={t('app:blog.title')}
        description={t('app:blog.subtitle')}
        author="显化369团队"
      />
      <SocialMediaCards 
        title={t('app:blog.title') + ' - ' + t('app:blog.subtitle')}
        description={t('app:blog.subtitle')}
        type="website"
      />

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t('buttons.back')}
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <Sparkles className="w-8 h-8 text-primary" />
              <span className="text-2xl font-bold text-foreground">{t('appName')}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <LanguageSwitcher />
            <Link to="/auth">
              <Button>{t('buttons.getStarted')}</Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Hero Section */}
        <section className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary/60 rounded-full flex items-center justify-center mx-auto mb-6">
            <BookOpen className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
            {t('app:blog.title')}
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            {t('app:blog.subtitle')}
          </p>
        </section>

        {/* Search and Filter */}
        <section className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <input
                type="text"
                placeholder={t('app:blog.list.search')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {categories.map((category) => (
                  <option key={category.key} value={category.key}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {loading ? (
          <div className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              <CardSkeleton />
              <CardSkeleton />
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
            </div>
          </div>
        ) : (
          <>
            {/* Featured Posts */}
            {featuredPosts.length > 0 && (
              <section className="mb-12">
                <h2 className="text-3xl font-bold text-foreground mb-6">
                  {t('app:blog.list.featuredArticles')}
                </h2>
                <div className="grid md:grid-cols-2 gap-8">
                  {featuredPosts.map((post) => (
                    <Card key={post.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
                      <div className="aspect-video bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                        <BookOpen className="w-12 h-12 text-primary/60" />
                      </div>
                      <CardHeader>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="secondary">{post.category}</Badge>
                          {post.tags.slice(0, 2).map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <CardTitle className="text-xl group-hover:text-primary transition-colors">
                          <Link to={`/blog/${post.slug}`}>
                            {post.title}
                          </Link>
                        </CardTitle>
                        <CardDescription className="line-clamp-3">
                          {post.excerpt || post.title}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-1">
                              <User className="w-4 h-4" />
                              <span>{post.author}</span>
                            </div>
                            {post.reading_time && (
                              <div className="flex items-center space-x-1">
                                <Clock className="w-4 h-4" />
                                <span>{post.reading_time}min</span>
                              </div>
                            )}
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(post.created_at)}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            )}

            {/* Regular Posts */}
            <section>
              <h2 className="text-3xl font-bold text-foreground mb-6">
                {t('app:blog.list.latestArticles')}
              </h2>
              {regularPosts.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {regularPosts.map((post) => (
                    <Card key={post.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                      <CardHeader>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="secondary">{post.category}</Badge>
                          {post.tags.slice(0, 1).map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <CardTitle className="text-lg group-hover:text-primary transition-colors">
                          <Link to={`/blog/${post.slug}`}>
                            {post.title}
                          </Link>
                        </CardTitle>
                        <CardDescription className="line-clamp-2">
                          {post.excerpt || post.title}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <User className="w-4 h-4" />
                            <span className="truncate">{post.author}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(post.created_at)}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {t('app:blog.list.noArticles')}
                  </h3>
                  <p className="text-muted-foreground">
                    {t('app:blog.list.noArticlesSearch')}
                  </p>
                </div>
              )}
            </section>
          </>
        )}

        {/* Newsletter CTA */}
        <section className="mt-16 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-2xl p-8 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            {t('app:blog.newsletter.title')}
          </h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            {t('app:blog.newsletter.description')}
          </p>
          <Link to="/newsletter">
            <Button size="lg" className="px-8 py-4 text-lg">
              <Tag className="w-5 h-5 mr-2" />
              {t('app:blog.newsletter.subscribe')}
            </Button>
          </Link>
        </section>
      </div>
    </div>
  );
};

export default Blog;