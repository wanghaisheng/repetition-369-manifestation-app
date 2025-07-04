
-- 启用pg_cron和pg_net扩展以支持定时任务
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- 创建每三天执行一次的定时任务
SELECT cron.schedule(
  'database-query-every-3-days',
  '0 0 */3 * *', -- 每三天的午夜执行
  $$
  SELECT
    net.http_post(
        url:='https://hziwbeyokjdswlzzmjem.supabase.co/functions/v1/scheduled-query',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh6aXdiZXlva2pkc3dsenptamVtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA2OTcwMDgsImV4cCI6MjA2NjI3MzAwOH0.Gg6MndKGFjMjN7TVClOgCVnVWeWBhpngIaQKtRL0wBQ"}'::jsonb,
        body:=concat('{"timestamp": "', now(), '", "task": "scheduled-database-query"}')::jsonb
    ) as request_id;
  $$
);
