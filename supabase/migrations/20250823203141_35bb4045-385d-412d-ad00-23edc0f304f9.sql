-- Create blog posts table for marketing content
CREATE TABLE public.blog_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT NOT NULL,
  featured_image TEXT,
  author TEXT NOT NULL DEFAULT '显化369团队',
  category TEXT NOT NULL DEFAULT 'general',
  tags TEXT[] DEFAULT '{}',
  language TEXT NOT NULL DEFAULT 'zh',
  published BOOLEAN NOT NULL DEFAULT false,
  featured BOOLEAN NOT NULL DEFAULT false,
  view_count INTEGER DEFAULT 0,
  reading_time INTEGER, -- in minutes
  seo_title TEXT,
  seo_description TEXT,
  seo_keywords TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  published_at TIMESTAMP WITH TIME ZONE
);

-- Create user success stories table
CREATE TABLE public.user_stories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL, -- 'career', 'health', 'relationship', 'finance', etc.
  goal_achieved TEXT,
  days_to_success INTEGER,
  method_used TEXT DEFAULT '369',
  is_approved BOOLEAN NOT NULL DEFAULT false,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  anonymous BOOLEAN NOT NULL DEFAULT true,
  user_name TEXT,
  user_location TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create comments table for blog posts
CREATE TABLE public.blog_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  blog_post_id UUID NOT NULL REFERENCES public.blog_posts(id) ON DELETE CASCADE,
  user_id UUID,
  parent_id UUID REFERENCES public.blog_comments(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  author_name TEXT,
  author_email TEXT,
  is_approved BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create newsletter subscribers table
CREATE TABLE public.newsletter_subscribers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  language TEXT DEFAULT 'zh',
  subscribed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN NOT NULL DEFAULT true,
  confirmed_at TIMESTAMP WITH TIME ZONE,
  unsubscribed_at TIMESTAMP WITH TIME ZONE
);

-- Enable Row Level Security
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- RLS Policies for blog_posts (public read, admin write)
CREATE POLICY "Blog posts are viewable by everyone" 
ON public.blog_posts 
FOR SELECT 
USING (published = true);

CREATE POLICY "Admin can manage blog posts" 
ON public.blog_posts 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.users.id = auth.uid() 
    AND auth.users.email IN ('admin@heymanifestation.com', 'wanghaisheng@gmail.com')
  )
);

-- RLS Policies for user_stories
CREATE POLICY "Approved user stories are viewable by everyone" 
ON public.user_stories 
FOR SELECT 
USING (is_approved = true);

CREATE POLICY "Users can create their own stories" 
ON public.user_stories 
FOR INSERT 
WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can update their own stories" 
ON public.user_stories 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Admin can manage all user stories" 
ON public.user_stories 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.users.id = auth.uid() 
    AND auth.users.email IN ('admin@heymanifestation.com', 'wanghaisheng@gmail.com')
  )
);

-- RLS Policies for blog_comments
CREATE POLICY "Approved comments are viewable by everyone" 
ON public.blog_comments 
FOR SELECT 
USING (is_approved = true);

CREATE POLICY "Users can create comments" 
ON public.blog_comments 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can update their own comments" 
ON public.blog_comments 
FOR UPDATE 
USING (auth.uid() = user_id);

-- RLS Policies for newsletter_subscribers
CREATE POLICY "Users can manage their own subscription" 
ON public.newsletter_subscribers 
FOR ALL 
USING (true);

-- Create indexes for better performance
CREATE INDEX idx_blog_posts_published ON public.blog_posts(published, published_at DESC);
CREATE INDEX idx_blog_posts_category ON public.blog_posts(category, published);
CREATE INDEX idx_blog_posts_language ON public.blog_posts(language, published);
CREATE INDEX idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX idx_user_stories_approved ON public.user_stories(is_approved, created_at DESC);
CREATE INDEX idx_user_stories_category ON public.user_stories(category, is_approved);
CREATE INDEX idx_blog_comments_post ON public.blog_comments(blog_post_id, is_approved);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
NEW.updated_at = now();
RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_blog_posts_updated_at
BEFORE UPDATE ON public.blog_posts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_stories_updated_at
BEFORE UPDATE ON public.user_stories
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_blog_comments_updated_at
BEFORE UPDATE ON public.blog_comments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert initial blog posts from marketing content
INSERT INTO public.blog_posts (title, slug, content, category, language, published, featured, author, tags, seo_title, seo_description) VALUES
(
  'From Skeptic to Believer: How I Built a Manifestation App That Actually Works',
  'from-skeptic-to-believer-manifestation-app',
  '# From Skeptic to Believer: How I Built a Manifestation App That Actually Works

*The unexpected journey of a rational developer into the world of manifestation*

## The Problem I Didn''t Know I Had

Two years ago, if you told me I''d be building a manifestation app, I would have laughed. As a senior full-stack developer with 10+ years in tech, I was the poster child for logical thinking. Code either works or it doesn''t. 1s and 0s. No room for "woo-woo" stuff.

But life has a funny way of humbling you.

## The Breaking Point

December 2022. Burned out from yet another failed startup. Third one in five years. Same pattern every time:
- Build amazing tech ✅
- Assume users will come ❌
- Run out of money ❌
- Repeat ❌

I was technically competent but missing something fundamental. While doom-scrolling Twitter at 3 AM (as one does), I stumbled upon a thread about Tesla''s obsession with 3, 6, 9. Not the car company - Nikola Tesla, the inventor.

"If you only knew the magnificence of the 3, 6 and 9, then you would have a key to the universe." - Tesla

## The Accidental Experiment

Desperate and unemployed, I figured: what''s the worst that could happen? I started writing down one specific goal:

*"I will build a profitable product that helps people within 90 days"*

Following the 369 pattern:
- 3 times at 9 AM
- 6 times at 3 PM  
- 9 times at 9 PM

Every. Single. Day.

## The Unexpected Results

Week 1: Nothing. Obviously.
Week 2: Started getting ideas. Dismissed them as coincidence.
Week 3: Met a potential co-founder at a coffee shop. Randomly.
Week 4: Stranger approached me about app development needs.

By day 30, I had three solid business opportunities. By day 60, I was building 显化369. By day 90, we had our first paying customers.

Coincidence? Maybe. But the pattern was undeniable.',
  'founder-story',
  'en',
  true,
  true,
  'Wang Haisheng',
  ARRAY['manifestation', 'startup', 'indie-hacker', 'build-in-public'],
  'From Skeptic to Believer: Building a Manifestation App | 显化369',
  'The unexpected journey of a rational developer into manifestation - from failed startups to $10K MRR in 100 days.'
),
(
  '显化369开发日记：100天从0到月收入10K',
  'xianghua369-100-days-journey',
  '# 显化369开发日记：100天从0到月收入10K

## Day 1-10: 项目启动期

### Day 1 Post:
开始我的100天公开开发挑战！🚀

正在做一个369显化app，因为现有工具都不好用...

每天早中晚写愿望3-6-9遍，听起来很玄学，但我要用代码让它变科学 👨‍💻

今天进度：
✅ 搭建React+Supabase基础架构
✅ 设计数据库表结构
🔄 明天开始写用户界面

#BuildInPublic #显化369 #独立开发

---

### Day 2 Post:
昨天那条关于显化app的动态，收到好多私信问"这是什么东西" 😅

简单解释：369显化法就是每天写目标18遍（3+6+9），据说特斯拉很迷这个数字组合

我的理解：其实就是通过重复书写来：
- 澄清目标
- 建立习惯  
- 训练专注力
- 强化记忆

用不用相信"宇宙能量"都行，反正对大脑有益 🧠

今天写了登录界面，明天搞核心的书写功能！

#心理学 #产品开发',
  'build-in-public',
  'zh',
  true,
  true,
  '王海生',
  ARRAY['显化369', '独立开发', '公开开发', '创业日记'],
  '显化369开发日记：100天从0到月收入10K的真实记录',
  '记录显化369应用从想法到盈利的完整开发过程，真实分享独立开发者的创业历程。'
);

-- Insert sample user stories
INSERT INTO public.user_stories (title, content, category, goal_achieved, days_to_success, is_approved, is_featured, user_name, user_location, rating) VALUES
(
  '3周找到理想工作，369方法真的有效！',
  '用显化369应用3个星期了，昨天面试成功拿到心仪的offer！每天写"我会找到理想工作"真的有用，至少让我面试时更自信了。推荐给所有在找工作的朋友！',
  'career',
  '成功获得心仪工作offer',
  21,
  true,
  true,
  '小李',
  '北京',
  5
),
(
  '坚持369显化法，成功减重20斤',
  '之前试过很多减肥方法都没用，最后决定试试显化法。每天写"我拥有健康苗条的身材"，配合合理饮食和运动，3个月减了20斤！关键是心态变了，不再焦虑体重。',
  'health',
  '成功减重20斤并保持健康体重',
  90,
  true,
  true,
  '小美',
  '上海',
  5
),
(
  '用369方法调整心态，走出情感低谷',
  '分手后很长时间走不出来，朋友推荐了这个app。每天写"我值得被爱，我会遇到对的人"，慢慢心态平和了。虽然还没遇到新的爱情，但现在的我更爱自己了。',
  'relationship',
  '重新找回自信和自爱',
  45,
  true,
  false,
  '匿名用户',
  '广州',
  4
);