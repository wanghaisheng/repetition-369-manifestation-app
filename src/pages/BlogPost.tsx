import React, { useState, useEffect } from 'react';
import { useParams, Link } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AdvancedStructuredData } from '@/components/seo/AdvancedStructuredData';
import { SocialMediaCards } from '@/components/seo/SocialMediaCards';
import { UnifiedSEO } from '@/components/seo/UnifiedSEO';
import { LanguageSwitcher } from '@/components/i18n/LanguageSwitcher';
import { supabase } from '@/integrations/supabase/client';
import { SkeletonLoader } from '@/components/performance/SkeletonLoader';
import { 
  Sparkles, 
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Eye,
  Share2,
  Twitter,
  Linkedin,
  Facebook,
  Link as LinkIcon
} from 'lucide-react';
import { MarkdownRenderer } from '@/components/blog/MarkdownRenderer';
import { toast } from 'sonner';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  author: string;
  category: string;
  tags: string[];
  featured_image?: string;
  reading_time?: number;
  created_at: string;
  view_count: number;
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string;
}

interface RelatedPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  author: string;
  category: string;
  tags: string[];
  reading_time?: number;
  created_at: string;
  view_count: number;
}

const BlogPostPage = () => {
  const { slug } = useParams({ from: '/blog/$slug' });
  const { t, i18n } = useTranslation(['common']);
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedPosts, setRelatedPosts] = useState<RelatedPost[]>([]);

  useEffect(() => {
    if (slug) {
      fetchPost();
    }
  }, [slug, i18n.language]);

  const fetchPost = async () => {
    setLoading(true);
    try {
      // Fetch the main post
      const { data: postData, error: postError } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .eq('published', true)
        .eq('language', i18n.language)
        .single();

      if (postError) throw postError;
      
      if (postData) {
        setPost(postData);
        
        // Increment view count
        await supabase
          .from('blog_posts')
          .update({ view_count: (postData.view_count || 0) + 1 })
          .eq('id', postData.id);

        // Fetch related posts
        const { data: relatedData } = await supabase
          .from('blog_posts')
          .select('id, title, slug, excerpt, author, category, created_at, reading_time, tags, view_count')
          .eq('published', true)
          .eq('language', i18n.language)
          .eq('category', postData.category)
          .neq('id', postData.id)
          .limit(3);

        setRelatedPosts(relatedData || []);
      }
    } catch (error) {
      console.error('Error fetching blog post:', error);
      toast.error(i18n.language === 'zh' ? '文章加载失败' : 'Failed to load article');
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

  const sharePost = async (platform: string) => {
    const url = window.location.href;
    const title = post?.title || '';
    
    let shareUrl = '';
    
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'copy':
        try {
          await navigator.clipboard.writeText(url);
          toast.success(i18n.language === 'zh' ? '链接已复制到剪贴板' : 'Link copied to clipboard');
          return;
        } catch (error) {
          console.error('Failed to copy link:', error);
          toast.error(i18n.language === 'zh' ? '复制失败' : 'Failed to copy link');
          return;
        }
      default:
        return;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <header className="sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/blog">
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
            <LanguageSwitcher />
          </div>
        </header>

        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <SkeletonLoader variant="text" width="60%" height={40} className="mb-4" />
          <SkeletonLoader variant="text" width="40%" height={20} className="mb-8" />
          <SkeletonLoader variant="rectangular" width="100%" height={200} className="mb-6" />
          <SkeletonLoader variant="text" lines={10} />
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            {i18n.language === 'zh' ? '文章未找到' : 'Article Not Found'}
          </h1>
          <p className="text-muted-foreground mb-6">
            {i18n.language === 'zh' ? '请检查URL是否正确' : 'Please check if the URL is correct'}
          </p>
          <Link to="/blog">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              {i18n.language === 'zh' ? '返回博客' : 'Back to Blog'}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <UnifiedSEO 
        title={post.seo_title || post.title}
        description={post.seo_description || post.excerpt || post.title}
        type="article"
        keywords={post.seo_keywords || post.tags.join(',')}
      />
      <AdvancedStructuredData 
        type="Article"
        title={post.title}
        description={post.excerpt || post.title}
        author={post.author}
        publishedDate={post.created_at}
        image={post.featured_image}
      />
      <SocialMediaCards 
        title={post.title}
        description={post.excerpt || post.title}
        type="article"
        author={post.author}
        publishedTime={post.created_at}
        image={post.featured_image}
      />

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/blog">
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

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Article Header */}
        <article>
          <header className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="secondary">{post.category}</Badge>
              {post.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
              {post.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 text-muted-foreground mb-6">
              <div className="flex items-center space-x-1">
                <User className="w-4 h-4" />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(post.created_at)}</span>
              </div>
              {post.reading_time && (
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{post.reading_time} min read</span>
                </div>
              )}
              <div className="flex items-center space-x-1">
                <Eye className="w-4 h-4" />
                <span>{post.view_count} views</span>
              </div>
            </div>

            {/* Share Buttons */}
            <div className="flex items-center space-x-2 mb-8">
              <Share2 className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground mr-2">
                {i18n.language === 'zh' ? '分享：' : 'Share:'}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => sharePost('twitter')}
                className="hover:bg-blue-50 hover:text-blue-600"
              >
                <Twitter className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => sharePost('linkedin')}
                className="hover:bg-blue-50 hover:text-blue-700"
              >
                <Linkedin className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => sharePost('facebook')}
                className="hover:bg-blue-50 hover:text-blue-800"
              >
                <Facebook className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => sharePost('copy')}
                className="hover:bg-gray-50"
              >
                <LinkIcon className="w-4 h-4" />
              </Button>
            </div>
          </header>

          {/* Article Content */}
          <MarkdownRenderer content={post.content} />
        </article>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="mt-16">
            <h2 className="text-3xl font-bold text-foreground mb-8">
              {i18n.language === 'zh' ? '相关文章' : 'Related Articles'}
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <Card key={relatedPost.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                  <CardHeader>
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">
                      <Link to={`/blog/${relatedPost.slug}`}>
                        {relatedPost.title}
                      </Link>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <User className="w-4 h-4" />
                        <span className="truncate">{relatedPost.author}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(relatedPost.created_at)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Newsletter CTA */}
        <section className="mt-16 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-2xl p-8 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            {i18n.language === 'zh' ? '喜欢这篇文章？' : 'Enjoyed This Article?'}
          </h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            {i18n.language === 'zh' 
              ? '订阅我们的内容更新，获取更多显化方法和成功案例' 
              : 'Subscribe to our newsletter for more manifestation methods and success stories'
            }
          </p>
          <Link to="/newsletter">
            <Button size="lg" className="px-8 py-4 text-lg">
              <Sparkles className="w-5 h-5 mr-2" />
              {i18n.language === 'zh' ? '立即订阅' : 'Subscribe Now'}
            </Button>
          </Link>
        </section>
      </div>
    </div>
  );
};

export default BlogPostPage;