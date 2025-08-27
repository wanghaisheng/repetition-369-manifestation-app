-- Enable required extensions for cron jobs
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Create a cron job to call scheduled-query function every 6 days at midnight
SELECT cron.schedule(
  'scheduled-query-every-6-days',
  '0 0 */6 * *', -- Every 6 days at midnight
  $$
  SELECT
    net.http_post(
        url:='https://hziwbeyokjdswlzzmjem.supabase.co/functions/v1/scheduled-query',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh6aXdiZXlva2pkc3dsenptamVtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA2OTcwMDgsImV4cCI6MjA2NjI3MzAwOH0.Gg6MndKGFjMjN7TVClOgCVnVWeWBhpngIaQKtRL0wBQ"}'::jsonb,
        body:=concat('{"scheduled_run": true, "timestamp": "', now(), '"}')::jsonb
    ) as request_id;
  $$
);