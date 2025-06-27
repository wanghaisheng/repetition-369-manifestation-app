
-- 创建用户档案表
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  PRIMARY KEY (id)
);

-- 启用行级安全
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 创建策略：用户只能查看和编辑自己的档案
CREATE POLICY "Users can view own profile" 
  ON public.profiles 
  FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
  ON public.profiles 
  FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" 
  ON public.profiles 
  FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- 创建函数：当新用户注册时自动创建档案
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data ->> 'full_name', new.email)
  );
  RETURN new;
END;
$$;

-- 创建触发器：新用户注册时自动执行
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 更新现有的表以支持用户关联
-- 为愿望表添加用户ID字段（如果还没有的话）
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'wishes' AND column_name = 'user_id'
  ) THEN
    -- 这里我们假设wishes表可能还没有创建，所以创建完整的表
    CREATE TABLE IF NOT EXISTS public.wishes (
      id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
      user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
      title TEXT NOT NULL,
      affirmation TEXT NOT NULL,
      category TEXT DEFAULT 'personal',
      color TEXT DEFAULT '#667eea',
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
      updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
    );
    
    -- 启用RLS
    ALTER TABLE public.wishes ENABLE ROW LEVEL SECURITY;
    
    -- 创建策略
    CREATE POLICY "Users can view own wishes" 
      ON public.wishes 
      FOR SELECT 
      USING (auth.uid() = user_id);
      
    CREATE POLICY "Users can create own wishes" 
      ON public.wishes 
      FOR INSERT 
      WITH CHECK (auth.uid() = user_id);
      
    CREATE POLICY "Users can update own wishes" 
      ON public.wishes 
      FOR UPDATE 
      USING (auth.uid() = user_id);
      
    CREATE POLICY "Users can delete own wishes" 
      ON public.wishes 
      FOR DELETE 
      USING (auth.uid() = user_id);
  END IF;
END
$$;

-- 为练习记录表添加用户关联
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_name = 'practice_sessions'
  ) THEN
    CREATE TABLE public.practice_sessions (
      id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
      user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
      wish_id UUID REFERENCES public.wishes(id) ON DELETE CASCADE NOT NULL,
      date TIMESTAMP WITH TIME ZONE NOT NULL,
      time_slot TEXT NOT NULL CHECK (time_slot IN ('morning', 'afternoon', 'evening')),
      completed_count INTEGER NOT NULL DEFAULT 1,
      target_count INTEGER NOT NULL,
      duration INTEGER, -- 持续时间（秒）
      affirmation_text TEXT,
      mood TEXT,
      created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
    );
    
    -- 启用RLS
    ALTER TABLE public.practice_sessions ENABLE ROW LEVEL SECURITY;
    
    -- 创建策略
    CREATE POLICY "Users can view own practice sessions" 
      ON public.practice_sessions 
      FOR SELECT 
      USING (auth.uid() = user_id);
      
    CREATE POLICY "Users can create own practice sessions" 
      ON public.practice_sessions 
      FOR INSERT 
      WITH CHECK (auth.uid() = user_id);
      
    CREATE POLICY "Users can update own practice sessions" 
      ON public.practice_sessions 
      FOR UPDATE 
      USING (auth.uid() = user_id);
      
    CREATE POLICY "Users can delete own practice sessions" 
      ON public.practice_sessions 
      FOR DELETE 
      USING (auth.uid() = user_id);
  END IF;
END
$$;
