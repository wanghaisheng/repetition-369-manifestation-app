-- 创建站点统计设置表
CREATE TABLE public.site_stats (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key text NOT NULL UNIQUE,
  value text NOT NULL,
  label text NOT NULL,
  description text,
  display_order integer DEFAULT 0,
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_by uuid REFERENCES auth.users(id),
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- 启用RLS
ALTER TABLE public.site_stats ENABLE ROW LEVEL SECURITY;

-- 所有人可以查看统计数据
CREATE POLICY "Site stats are viewable by everyone"
ON public.site_stats
FOR SELECT
USING (true);

-- 只有管理员可以管理统计数据
CREATE POLICY "Admin can manage site stats"
ON public.site_stats
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE users.id = auth.uid()
    AND users.email IN ('admin@heymanifestation.com', 'wanghaisheng@gmail.com')
  )
);

-- 插入初始数据（首页当前显示的统计数据）
INSERT INTO public.site_stats (key, value, label, description, display_order) VALUES
  ('monthly_users', '5247', '月活跃用户', '每月使用应用的活跃用户数', 1),
  ('success_rate', '89', '成功率', '用户实现愿望的成功率（百分比）', 2),
  ('user_rating', '4.9', '用户评分', '应用商店用户评分（满分5分）', 3),
  ('average_days', '18', '平均天数', '用户实现目标的平均天数', 4),
  ('weekly_increase', '127', '本周增长', '本周新增用户数', 5),
  ('daily_completions', '23', '今日完成', '今天完成显化练习的人数', 6);

-- 创建更新时间戳触发器
CREATE TRIGGER update_site_stats_updated_at
  BEFORE UPDATE ON public.site_stats
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();