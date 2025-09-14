import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BlogEditor } from './BlogEditor';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  FileText,
  Filter,
  Calendar,
  User,
  Globe,
  Lock
} from 'lucide-react';

interface BlogPost {
  id: string;
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
  created_at: string;
  view_count: number;
}

export const BlogManagement: React.FC = () => {
  const { t, i18n } = useTranslation(['common']);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showEditor, setShowEditor] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | undefined>();

  const categories = [
    { key: 'all', label: i18n.language === 'zh' ? '全部' : 'All' },
    { key: 'founder-story', label: i18n.language === 'zh' ? '创始人故事' : 'Founder Story' },
    { key: 'build-in-public', label: i18n.language === 'zh' ? '公开开发' : 'Build in Public' },
    { key: 'manifestation', label: i18n.language === 'zh' ? '显化方法' : 'Manifestation' },
    { key: 'technical', label: i18n.language === 'zh' ? '技术分享' : 'Technical' },
    { key: 'user-stories', label: i18n.language === 'zh' ? '用户故事' : 'User Stories' },
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
      toast.error(i18n.language === 'zh' ? '获取文章失败' : 'Failed to fetch articles');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(i18n.language === 'zh' ? 'zh-CN' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  const handleCreateNew = () => {
    setEditingPost(undefined);
    setShowEditor(true);
  };

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post);
    setShowEditor(true);
  };

  const handleDelete = async (postId: string) => {
    if (!confirm(i18n.language === 'zh' ? '确定要删除这篇文章吗？' : 'Are you sure you want to delete this article?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', postId);

      if (error) throw error;

      toast.success(i18n.language === 'zh' ? '文章已删除' : 'Article deleted');
      fetchPosts();
    } catch (error) {
      console.error('Error deleting blog post:', error);
      toast.error(i18n.language === 'zh' ? '删除失败' : 'Failed to delete');
    }
  };

  const handleSavePost = () => {
    setShowEditor(false);
    setEditingPost(undefined);
    fetchPosts();
  };

  if (showEditor) {
    return (
      <BlogEditor
        initialPost={editingPost}
        onSave={handleSavePost}
        onCancel={() => {
          setShowEditor(false);
          setEditingPost(undefined);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <FileText className="w-8 h-8 text-primary" />
            {i18n.language === 'zh' ? '博客管理' : 'Blog Management'}
          </h1>
          
          <Button onClick={handleCreateNew}>
            <Plus className="w-4 h-4 mr-2" />
            {i18n.language === 'zh' ? '创建文章' : 'Create Article'}
          </Button>
        </div>

        {/* Search and Filter */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={i18n.language === 'zh' ? '搜索文章...' : 'Search articles...'}
                  className="pl-10"
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
          </CardContent>
        </Card>

        {/* Posts List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground mt-2">
                {i18n.language === 'zh' ? '加载中...' : 'Loading...'}
              </p>
            </div>
          ) : posts.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {i18n.language === 'zh' ? '暂无文章' : 'No Articles Found'}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {i18n.language === 'zh' 
                    ? '开始创建您的第一篇文章' 
                    : 'Start by creating your first article'
                  }
                </p>
                <Button onClick={handleCreateNew}>
                  <Plus className="w-4 h-4 mr-2" />
                  {i18n.language === 'zh' ? '创建文章' : 'Create Article'}
                </Button>
              </CardContent>
            </Card>
          ) : (
            posts.map((post) => (
              <Card key={post.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant={post.published ? "default" : "secondary"}>
                          {post.published ? (
                            <>
                              <Globe className="w-3 h-3 mr-1" />
                              {i18n.language === 'zh' ? '已发布' : 'Published'}
                            </>
                          ) : (
                            <>
                              <Lock className="w-3 h-3 mr-1" />
                              {i18n.language === 'zh' ? '草稿' : 'Draft'}
                            </>
                          )}
                        </Badge>
                        {post.featured && (
                          <Badge variant="outline">
                            {i18n.language === 'zh' ? '精选' : 'Featured'}
                          </Badge>
                        )}
                        <Badge variant="secondary">{post.category}</Badge>
                      </div>
                      
                      <h3 className="text-xl font-semibold text-foreground mb-2">
                        {post.title}
                      </h3>
                      
                      <p className="text-muted-foreground mb-3 line-clamp-2">
                        {post.excerpt}
                      </p>
                      
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <User className="w-4 h-4" />
                          <span>{post.author}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(post.created_at)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Eye className="w-4 h-4" />
                          <span>{post.view_count} views</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-1 mt-2">
                        {post.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      {post.published && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => window.open(`/blog/${post.slug}`, '_blank')}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      )}
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEdit(post)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDelete(post.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};