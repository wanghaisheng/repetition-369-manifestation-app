import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { MarkdownRenderer } from './MarkdownRenderer';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { logger } from '@/utils/logger';
import { 
  Save, 
  Eye, 
  Send,
  Plus,
  X,
  FileText,
  Calendar,
  Tag as TagIcon,
  Globe,
  Lock
} from 'lucide-react';

interface BlogPost {
  id?: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author: string;
  category: string;
  tags: string[];
  featured: boolean;
  published: boolean;
  language: string;
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string;
  reading_time?: number;
}

interface BlogEditorProps {
  initialPost?: BlogPost;
  onSave?: (post: BlogPost) => void;
  onCancel?: () => void;
}

export const BlogEditor: React.FC<BlogEditorProps> = ({
  initialPost,
  onSave,
  onCancel
}) => {
  const { t, i18n } = useTranslation(['app', 'common']);
  const [post, setPost] = useState<BlogPost>({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    author: '显化369团队',
    category: 'manifestation',
    tags: [],
    featured: false,
    published: false,
    language: i18n.language,
    seo_title: '',
    seo_description: '',
    seo_keywords: '',
    reading_time: 0,
    ...initialPost
  });

  const [newTag, setNewTag] = useState('');
  const [loading, setLoading] = useState(false);

  const categories = [
    { value: 'founder-story', label: t('app:blog.categories.founder_story') },
    { value: 'build-in-public', label: t('app:blog.categories.build_in_public') },
    { value: 'manifestation', label: t('app:blog.categories.manifestation') },
    { value: 'technical', label: t('app:blog.categories.technical') },
    { value: 'user-stories', label: t('app:blog.categories.user_stories') },
  ];

  useEffect(() => {
    if (post.title && !initialPost?.slug) {
      const generatedSlug = post.title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-');
      setPost(prev => ({ ...prev, slug: generatedSlug }));
    }
  }, [post.title, initialPost?.slug]);

  useEffect(() => {
    // Calculate reading time (average 200 words per minute)
    const wordCount = post.content.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / 200);
    setPost(prev => ({ ...prev, reading_time: readingTime }));
  }, [post.content]);

  const handleInputChange = (field: keyof BlogPost, value: any) => {
    setPost(prev => ({ ...prev, [field]: value }));
  };

  const addTag = () => {
    if (newTag.trim() && !post.tags.includes(newTag.trim())) {
      setPost(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setPost(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSave = async (publish: boolean = false) => {
    if (!post.title.trim() || !post.content.trim()) {
      toast.error(t('app:blog.editor.validationError'));
      return;
    }

    setLoading(true);
    try {
      const postData = {
        ...post,
        published: publish,
        language: i18n.language,
        seo_title: post.seo_title || post.title,
        seo_description: post.seo_description || post.excerpt,
        seo_keywords: post.seo_keywords || post.tags.join(','),
      };

      let result;
      if (post.id) {
        result = await supabase
          .from('blog_posts')
          .update(postData)
          .eq('id', post.id)
          .select()
          .single();
      } else {
        result = await supabase
          .from('blog_posts')
          .insert(postData)
          .select()
          .single();
      }

      if (result.error) throw result.error;

      toast.success(
        publish 
          ? t('app:blog.editor.published_success')
          : t('app:blog.editor.draft_success')
      );

      if (onSave) {
        onSave(result.data);
      }
    } catch (error) {
      logger.error('Error saving blog post', error);
      toast.error(t('app:blog.editor.save_error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <FileText className="w-8 h-8 text-primary" />
            {initialPost?.id 
              ? t('app:blog.editor.edit')
              : t('app:blog.editor.create')
            }
          </h1>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              onClick={onCancel}
            >
              {t('app:blog.editor.cancel')}
            </Button>
            <Button 
              onClick={() => handleSave(false)}
              disabled={loading}
              variant="outline"
            >
              <Save className="w-4 h-4 mr-2" />
              {t('app:blog.editor.saveDraft')}
            </Button>
            <Button 
              onClick={() => handleSave(true)}
              disabled={loading}
            >
              <Send className="w-4 h-4 mr-2" />
              {t('app:blog.editor.publish')}
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Editor */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  {t('app:blog.editor.content')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">{t('app:blog.editor.title')}</Label>
                  <Input
                    id="title"
                    value={post.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder={t('app:blog.editor.titlePlaceholder')}
                    className="text-lg font-semibold"
                  />
                </div>

                <div>
                  <Label htmlFor="slug">{t('app:blog.editor.slug')}</Label>
                  <Input
                    id="slug"
                    value={post.slug}
                    onChange={(e) => handleInputChange('slug', e.target.value)}
                    placeholder={t('app:blog.editor.slugPlaceholder')}
                  />
                </div>

                <div>
                  <Label htmlFor="excerpt">{t('app:blog.editor.excerpt')}</Label>
                  <Textarea
                    id="excerpt"
                    value={post.excerpt}
                    onChange={(e) => handleInputChange('excerpt', e.target.value)}
                    placeholder={t('app:blog.editor.excerptPlaceholder')}
                    rows={3}
                  />
                </div>

                <Tabs defaultValue="write" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="write">
                      {t('app:blog.editor.write')}
                    </TabsTrigger>
                    <TabsTrigger value="preview">
                      <Eye className="w-4 h-4 mr-2" />
                      {t('app:blog.editor.preview')}
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="write" className="mt-4">
                    <Textarea
                      value={post.content}
                      onChange={(e) => handleInputChange('content', e.target.value)}
                      placeholder={t('app:blog.editor.contentPlaceholder')}
                      rows={20}
                      className="font-mono"
                    />
                    <div className="text-sm text-muted-foreground mt-2">
                      {t('app:blog.editor.markdownSupported')} • 
                      {post.content.split(/\s+/).length} {t('app:blog.editor.words')} • 
                      {post.reading_time} {t('app:blog.editor.minRead')}
                    </div>
                  </TabsContent>
                  <TabsContent value="preview" className="mt-4">
                    <div className="border rounded-lg p-6 min-h-[500px] bg-background">
                      <MarkdownRenderer content={post.content} />
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Article Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TagIcon className="w-5 h-5" />
                  {t('app:blog.editor.articleSettings')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="author">{t('app:blog.editor.author')}</Label>
                  <Input
                    id="author"
                    value={post.author}
                    onChange={(e) => handleInputChange('author', e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="category">{t('app:blog.editor.category')}</Label>
                  <Select value={post.category} onValueChange={(value) => handleInputChange('category', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>{t('app:blog.editor.tags')}</Label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder={t('app:blog.editor.addTag')}
                      onKeyPress={(e) => e.key === 'Enter' && addTag()}
                    />
                    <Button onClick={addTag} size="sm">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {post.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                        {tag}
                        <X 
                          className="w-3 h-3 cursor-pointer" 
                          onClick={() => removeTag(tag)}
                        />
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="featured"
                    checked={post.featured}
                    onCheckedChange={(checked) => handleInputChange('featured', checked)}
                  />
                  <Label htmlFor="featured">
                    {t('app:blog.editor.featured')}
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="published"
                    checked={post.published}
                    onCheckedChange={(checked) => handleInputChange('published', checked)}
                  />
                  <Label htmlFor="published" className="flex items-center gap-2">
                    {post.published ? (
                      <>
                        <Globe className="w-4 h-4" />
                        {t('app:blog.editor.published')}
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        {t('app:blog.editor.draft')}
                      </>
                    )}
                  </Label>
                </div>
              </CardContent>
            </Card>

            {/* SEO Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  {t('app:blog.editor.seoSettings')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="seo-title">{t('app:blog.editor.seoTitle')}</Label>
                  <Input
                    id="seo-title"
                    value={post.seo_title}
                    onChange={(e) => handleInputChange('seo_title', e.target.value)}
                    placeholder={post.title}
                  />
                  <div className="text-xs text-muted-foreground mt-1">
                    {(post.seo_title || post.title).length}/60
                  </div>
                </div>

                <div>
                  <Label htmlFor="seo-description">{t('app:blog.editor.seoDescription')}</Label>
                  <Textarea
                    id="seo-description"
                    value={post.seo_description}
                    onChange={(e) => handleInputChange('seo_description', e.target.value)}
                    placeholder={post.excerpt}
                    rows={3}
                  />
                  <div className="text-xs text-muted-foreground mt-1">
                    {(post.seo_description || post.excerpt).length}/160
                  </div>
                </div>

                <div>
                  <Label htmlFor="seo-keywords">{t('app:blog.editor.seoKeywords')}</Label>
                  <Input
                    id="seo-keywords"
                    value={post.seo_keywords}
                    onChange={(e) => handleInputChange('seo_keywords', e.target.value)}
                    placeholder={post.tags.join(', ')}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};