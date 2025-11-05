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
  const { t, i18n } = useTranslation(['common']);
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
    { value: 'founder-story', label: i18n.language === 'zh' ? '创始人故事' : 'Founder Story' },
    { value: 'build-in-public', label: i18n.language === 'zh' ? '公开开发' : 'Build in Public' },
    { value: 'manifestation', label: i18n.language === 'zh' ? '显化方法' : 'Manifestation' },
    { value: 'technical', label: i18n.language === 'zh' ? '技术分享' : 'Technical' },
    { value: 'user-stories', label: i18n.language === 'zh' ? '用户故事' : 'User Stories' },
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
      toast.error(i18n.language === 'zh' ? '标题和内容不能为空' : 'Title and content cannot be empty');
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
        i18n.language === 'zh' 
          ? (publish ? '文章已发布' : '文章已保存为草稿')
          : (publish ? 'Article published' : 'Article saved as draft')
      );

      if (onSave) {
        onSave(result.data);
      }
    } catch (error) {
      logger.error('Error saving blog post', error);
      toast.error(i18n.language === 'zh' ? '保存失败' : 'Failed to save');
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
              ? (i18n.language === 'zh' ? '编辑文章' : 'Edit Article')
              : (i18n.language === 'zh' ? '创建文章' : 'Create Article')
            }
          </h1>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              onClick={onCancel}
            >
              {i18n.language === 'zh' ? '取消' : 'Cancel'}
            </Button>
            <Button 
              onClick={() => handleSave(false)}
              disabled={loading}
              variant="outline"
            >
              <Save className="w-4 h-4 mr-2" />
              {i18n.language === 'zh' ? '保存草稿' : 'Save Draft'}
            </Button>
            <Button 
              onClick={() => handleSave(true)}
              disabled={loading}
            >
              <Send className="w-4 h-4 mr-2" />
              {i18n.language === 'zh' ? '发布' : 'Publish'}
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
                  {i18n.language === 'zh' ? '文章内容' : 'Article Content'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">{i18n.language === 'zh' ? '标题' : 'Title'}</Label>
                  <Input
                    id="title"
                    value={post.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder={i18n.language === 'zh' ? '输入文章标题...' : 'Enter article title...'}
                    className="text-lg font-semibold"
                  />
                </div>

                <div>
                  <Label htmlFor="slug">{i18n.language === 'zh' ? '链接标识' : 'Slug'}</Label>
                  <Input
                    id="slug"
                    value={post.slug}
                    onChange={(e) => handleInputChange('slug', e.target.value)}
                    placeholder={i18n.language === 'zh' ? '文章链接标识...' : 'Article slug...'}
                  />
                </div>

                <div>
                  <Label htmlFor="excerpt">{i18n.language === 'zh' ? '摘要' : 'Excerpt'}</Label>
                  <Textarea
                    id="excerpt"
                    value={post.excerpt}
                    onChange={(e) => handleInputChange('excerpt', e.target.value)}
                    placeholder={i18n.language === 'zh' ? '文章摘要...' : 'Article excerpt...'}
                    rows={3}
                  />
                </div>

                <Tabs defaultValue="write" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="write">
                      {i18n.language === 'zh' ? '编写' : 'Write'}
                    </TabsTrigger>
                    <TabsTrigger value="preview">
                      <Eye className="w-4 h-4 mr-2" />
                      {i18n.language === 'zh' ? '预览' : 'Preview'}
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="write" className="mt-4">
                    <Textarea
                      value={post.content}
                      onChange={(e) => handleInputChange('content', e.target.value)}
                      placeholder={i18n.language === 'zh' ? '使用Markdown格式编写文章...' : 'Write your article in Markdown...'}
                      rows={20}
                      className="font-mono"
                    />
                    <div className="text-sm text-muted-foreground mt-2">
                      {i18n.language === 'zh' ? '支持Markdown格式' : 'Markdown supported'} • 
                      {post.content.split(/\s+/).length} {i18n.language === 'zh' ? '字' : 'words'} • 
                      {post.reading_time} {i18n.language === 'zh' ? '分钟阅读' : 'min read'}
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
                  {i18n.language === 'zh' ? '文章设置' : 'Article Settings'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="author">{i18n.language === 'zh' ? '作者' : 'Author'}</Label>
                  <Input
                    id="author"
                    value={post.author}
                    onChange={(e) => handleInputChange('author', e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="category">{i18n.language === 'zh' ? '分类' : 'Category'}</Label>
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
                  <Label>{i18n.language === 'zh' ? '标签' : 'Tags'}</Label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder={i18n.language === 'zh' ? '添加标签...' : 'Add tag...'}
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
                    {i18n.language === 'zh' ? '精选文章' : 'Featured Article'}
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
                        {i18n.language === 'zh' ? '已发布' : 'Published'}
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        {i18n.language === 'zh' ? '草稿' : 'Draft'}
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
                  SEO {i18n.language === 'zh' ? '设置' : 'Settings'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="seo-title">SEO {i18n.language === 'zh' ? '标题' : 'Title'}</Label>
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
                  <Label htmlFor="seo-description">SEO {i18n.language === 'zh' ? '描述' : 'Description'}</Label>
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
                  <Label htmlFor="seo-keywords">SEO {i18n.language === 'zh' ? '关键词' : 'Keywords'}</Label>
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