import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AdvancedStructuredData } from '@/components/seo/AdvancedStructuredData';
import { SocialMediaCards } from '@/components/seo/SocialMediaCards';
import { UnifiedSEO } from '@/components/seo/UnifiedSEO';
import { LanguageSwitcher } from '@/components/i18n/LanguageSwitcher';
import { EnhancedInternalLinks } from '@/components/seo/EnhancedInternalLinks';
import { supabase } from '@/integrations/supabase/client';
import { SkeletonLoader, CardSkeleton } from '@/components/performance/SkeletonLoader';
import { logger } from '@/utils/logger';
import { 
  Sparkles, 
  ArrowLeft,
  Heart,
  MapPin,
  Calendar,
  Star,
  Trophy,
  Plus,
  Filter,
  User
} from 'lucide-react';
import { toast } from 'sonner';

interface UserStory {
  id: string;
  title: string;
  content: string;
  category: string;
  goal_achieved: string;
  days_to_success: number;
  user_name: string;
  user_location: string;
  rating: number;
  created_at: string;
  anonymous: boolean;
}

const UserStories = () => {
  const { t, i18n } = useTranslation(['userStories', 'common']);
  const [stories, setStories] = useState<UserStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [submitForm, setSubmitForm] = useState({
    title: '',
    content: '',
    category: 'career',
    goal_achieved: '',
    days_to_success: '',
    user_name: '',
    user_location: '',
    anonymous: true,
    rating: 5
  });

  const categories = [
    { key: 'all', label: t('categories.all') },
    { key: 'career', label: t('categories.career') },
    { key: 'health', label: t('categories.health') },
    { key: 'relationship', label: t('categories.relationship') },
    { key: 'finance', label: t('categories.finance') },
    { key: 'personal', label: t('categories.personal') },
  ];

  useEffect(() => {
    fetchStories();
  }, [selectedCategory]);

  const fetchStories = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('user_stories')
        .select('*')
        .eq('is_approved', true)
        .order('created_at', { ascending: false });

      if (selectedCategory !== 'all') {
        query = query.eq('category', selectedCategory);
      }

      const { data, error } = await query;

      if (error) throw error;
      setStories(data || []);
    } catch (error) {
      logger.error('Error fetching user stories:', error);
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

  const getCategoryColor = (category: string) => {
    const colors = {
      career: 'bg-blue-100 text-blue-800',
      health: 'bg-green-100 text-green-800',
      relationship: 'bg-pink-100 text-pink-800',
      finance: 'bg-yellow-100 text-yellow-800',
      personal: 'bg-purple-100 text-purple-800',
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const handleSubmitStory = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { error } = await supabase
        .from('user_stories')
        .insert([{
          title: submitForm.title,
          content: submitForm.content,
          category: submitForm.category,
          goal_achieved: submitForm.goal_achieved,
          days_to_success: parseInt(submitForm.days_to_success),
          user_name: submitForm.anonymous ? t('form.anonymousUser') : submitForm.user_name,
          user_location: submitForm.user_location,
          anonymous: submitForm.anonymous,
          rating: submitForm.rating,
          is_approved: false
        }]);

      if (error) throw error;

      toast.success(t('toast.submitSuccess'));
      setIsSubmitModalOpen(false);
      setSubmitForm({
        title: '',
        content: '',
        category: 'career',
        goal_achieved: '',
        days_to_success: '',
        user_name: '',
        user_location: '',
        anonymous: true,
        rating: 5
      });
    } catch (error) {
      logger.error('Error submitting story:', error);
      toast.error(t('toast.submitFailed'));
    }
  };

  const featuredStories = stories.filter(story => story.rating >= 5).slice(0, 3);
  const regularStories = stories.filter(story => story.rating < 5 || !featuredStories.some(f => f.id === story.id));

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <UnifiedSEO 
        title={t('seo.title')}
        description={t('seo.description')}
        type="website"
        keywords={t('seo.keywords')}
      />
      <AdvancedStructuredData 
        type="WebPage"
        title={t('hero.title')}
        description={t('hero.description')}
        author={t('common:appName')}
      />
      <SocialMediaCards 
        title={t('seo.title')}
        description={t('seo.description')}
        type="website"
      />

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t('common:buttons.back')}
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <Sparkles className="w-8 h-8 text-primary" />
              <span className="text-2xl font-bold text-foreground">{t('common:appName')}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <LanguageSwitcher />
            <Link to="/auth">
              <Button>{t('common:buttons.getStarted')}</Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Hero Section */}
        <section className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary/60 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
            {t('hero.h1')}
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            {t('hero.subtitle')}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Dialog open={isSubmitModalOpen} onOpenChange={setIsSubmitModalOpen}>
              <DialogTrigger asChild>
                <Button size="lg" className="px-8 py-4 text-lg">
                  <Plus className="w-5 h-5 mr-2" />
                  {t('form.shareStory')}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {t('form.shareTitle')}
                  </DialogTitle>
                  <DialogDescription>
                    {t('form.shareDescription')}
                  </DialogDescription>
                </DialogHeader>
                
                <form onSubmit={handleSubmitStory} className="space-y-4">
                  <div>
                    <Label htmlFor="title">
                      {t('form.storyTitle')}
                    </Label>
                    <Input
                      id="title"
                      value={submitForm.title}
                      onChange={(e) => setSubmitForm({...submitForm, title: e.target.value})}
                      placeholder={t('form.storyTitlePlaceholder')}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="category">
                      {t('form.category')}
                    </Label>
                    <select
                      id="category"
                      value={submitForm.category}
                      onChange={(e) => setSubmitForm({...submitForm, category: e.target.value})}
                      className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                    >
                      {categories.filter(c => c.key !== 'all').map((category) => (
                        <option key={category.key} value={category.key}>
                          {category.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <Label htmlFor="goal_achieved">
                      {t('form.goalAchieved')}
                    </Label>
                    <Input
                      id="goal_achieved"
                      value={submitForm.goal_achieved}
                      onChange={(e) => setSubmitForm({...submitForm, goal_achieved: e.target.value})}
                      placeholder={t('form.goalAchievedPlaceholder')}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="days_to_success">
                      {t('form.daysToSuccess')}
                    </Label>
                    <Input
                      id="days_to_success"
                      type="number"
                      value={submitForm.days_to_success}
                      onChange={(e) => setSubmitForm({...submitForm, days_to_success: e.target.value})}
                      placeholder="21"
                      min="1"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="content">
                      {t('form.yourStory')}
                    </Label>
                    <Textarea
                      id="content"
                      value={submitForm.content}
                      onChange={(e) => setSubmitForm({...submitForm, content: e.target.value})}
                      placeholder={t('form.yourStoryPlaceholder')}
                      rows={6}
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="user_name">
                        {t('form.name')}
                      </Label>
                      <Input
                        id="user_name"
                        value={submitForm.user_name}
                        onChange={(e) => setSubmitForm({...submitForm, user_name: e.target.value})}
                        placeholder={t('form.namePlaceholder')}
                        disabled={submitForm.anonymous}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="user_location">
                        {t('form.location')}
                      </Label>
                      <Input
                        id="user_location"
                        value={submitForm.user_location}
                        onChange={(e) => setSubmitForm({...submitForm, user_location: e.target.value})}
                        placeholder={t('form.locationPlaceholder')}
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      id="anonymous"
                      type="checkbox"
                      checked={submitForm.anonymous}
                      onChange={(e) => setSubmitForm({...submitForm, anonymous: e.target.checked})}
                      className="rounded"
                    />
                    <Label htmlFor="anonymous">
                      {t('form.anonymous')}
                    </Label>
                  </div>
                  
                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setIsSubmitModalOpen(false)}>
                      {t('form.cancel')}
                    </Button>
                    <Button type="submit">
                      {t('form.submit')}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
            
            <Link to="/blog">
              <Button variant="outline" size="lg" className="px-8 py-4 text-lg">
                {t('cta.readMore')}
              </Button>
            </Link>
          </div>
        </section>

        {/* Filter */}
        <section className="mb-8">
          <div className="flex items-center justify-center space-x-2 mb-6">
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
        </section>

        {loading ? (
          <div className="space-y-8">
            <div className="grid md:grid-cols-3 gap-6">
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
            </div>
          </div>
        ) : (
          <>
            {/* Featured Stories */}
            {featuredStories.length > 0 && (
              <section className="mb-12">
                <h2 className="text-3xl font-bold text-foreground mb-6 text-center">
                  <Trophy className="inline w-8 h-8 text-yellow-500 mr-2" />
                  {t('stories.featuredTitle')}
                </h2>
                <div className="grid md:grid-cols-3 gap-6">
                  {featuredStories.map((story) => (
                    <Card key={story.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden">
                      <div className="absolute top-4 right-4">
                        <Badge className="bg-yellow-100 text-yellow-800">
                          <Star className="w-3 h-3 mr-1" />
                          {t('stories.featured')}
                        </Badge>
                      </div>
                      
                      <CardHeader className="pb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={getCategoryColor(story.category)}>
                            {categories.find(c => c.key === story.category)?.label}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {story.days_to_success} {t('stories.days')}
                          </Badge>
                        </div>
                        <CardTitle className="text-lg">{story.title}</CardTitle>
                        <CardDescription className="font-medium text-primary">
                          {story.goal_achieved}
                        </CardDescription>
                      </CardHeader>
                      
                      <CardContent>
                        <p className="text-muted-foreground mb-4 line-clamp-3 leading-relaxed">
                          {story.content}
                        </p>
                        
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-1">
                              <User className="w-4 h-4" />
                              <span>{story.user_name}</span>
                            </div>
                            {story.user_location && (
                              <div className="flex items-center space-x-1">
                                <MapPin className="w-4 h-4" />
                                <span>{story.user_location}</span>
                              </div>
                            )}
                          </div>
                          <div className="flex items-center space-x-1">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`w-3 h-3 ${i < story.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            )}

            {/* Regular Stories */}
            <section>
              <h2 className="text-3xl font-bold text-foreground mb-6 text-center">
                {t('stories.moreTitle')}
              </h2>
              {regularStories.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {regularStories.map((story) => (
                    <Card key={story.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                      <CardHeader className="pb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={getCategoryColor(story.category)}>
                            {categories.find(c => c.key === story.category)?.label}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {story.days_to_success} {t('stories.days')}
                          </Badge>
                        </div>
                        <CardTitle className="text-lg">{story.title}</CardTitle>
                        <CardDescription className="font-medium text-primary">
                          {story.goal_achieved}
                        </CardDescription>
                      </CardHeader>
                      
                      <CardContent>
                        <p className="text-muted-foreground mb-4 line-clamp-3 leading-relaxed">
                          {story.content}
                        </p>
                        
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <User className="w-4 h-4" />
                            <span>{story.user_name}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(story.created_at)}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {t('stories.noStories')}
                  </h3>
                  <p className="text-muted-foreground">
                    {t('stories.beFirst')}
                  </p>
                </div>
              )}
            </section>
          </>
        )}

        {/* Internal Links Section */}
        <section className="mt-16">
          <EnhancedInternalLinks currentPage="user-stories" maxLinks={12} showClusterLabels />
        </section>

        {/* CTA Section */}
        <section className="mt-16 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-2xl p-8 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            {t('cta.title')}
          </h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            {t('cta.description')}
          </p>
          <Button 
            size="lg" 
            className="px-8 py-4 text-lg"
            onClick={() => setIsSubmitModalOpen(true)}
          >
            <Plus className="w-5 h-5 mr-2" />
            {t('cta.shareButton')}
          </Button>
        </section>
      </div>
    </div>
  );
};

export default UserStories;
