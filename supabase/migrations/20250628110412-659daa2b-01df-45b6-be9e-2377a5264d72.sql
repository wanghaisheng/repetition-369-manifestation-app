
-- 为 wishes 表添加 RLS 策略
ALTER TABLE public.wishes ENABLE ROW LEVEL SECURITY;

-- 用户只能查看自己的愿望
CREATE POLICY "Users can view their own wishes" 
  ON public.wishes 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- 用户只能创建自己的愿望
CREATE POLICY "Users can create their own wishes" 
  ON public.wishes 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- 用户只能更新自己的愿望
CREATE POLICY "Users can update their own wishes" 
  ON public.wishes 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- 用户只能删除自己的愿望
CREATE POLICY "Users can delete their own wishes" 
  ON public.wishes 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- 为 practice_sessions 表添加 RLS 策略
ALTER TABLE public.practice_sessions ENABLE ROW LEVEL SECURITY;

-- 用户只能查看自己的练习记录
CREATE POLICY "Users can view their own practice sessions" 
  ON public.practice_sessions 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- 用户只能创建自己的练习记录
CREATE POLICY "Users can create their own practice sessions" 
  ON public.practice_sessions 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- 用户只能更新自己的练习记录
CREATE POLICY "Users can update their own practice sessions" 
  ON public.practice_sessions 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- 用户只能删除自己的练习记录
CREATE POLICY "Users can delete their own practice sessions" 
  ON public.practice_sessions 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- 为 profiles 表添加 RLS 策略
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 用户只能查看自己的档案
CREATE POLICY "Users can view their own profile" 
  ON public.profiles 
  FOR SELECT 
  USING (auth.uid() = id);

-- 用户只能更新自己的档案
CREATE POLICY "Users can update their own profile" 
  ON public.profiles 
  FOR UPDATE 
  USING (auth.uid() = id);
