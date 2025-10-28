import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SiteStat {
  id: string;
  key: string;
  value: string;
  label: string;
  description: string | null;
  display_order: number;
  updated_at: string;
}

export const useSiteStats = () => {
  const [stats, setStats] = useState<SiteStat[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchStats = async () => {
    try {
      const { data, error } = await supabase
        .from('site_stats')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setStats(data || []);
    } catch (error) {
      console.error('Error fetching site stats:', error);
      toast({
        variant: 'destructive',
        title: '加载失败',
        description: '无法加载统计数据'
      });
    } finally {
      setLoading(false);
    }
  };

  const updateStat = async (id: string, value: string) => {
    try {
      const { error } = await supabase
        .from('site_stats')
        .update({ 
          value,
          updated_at: new Date().toISOString(),
          updated_by: (await supabase.auth.getUser()).data.user?.id
        })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: '更新成功',
        description: '统计数据已更新'
      });

      await fetchStats();
    } catch (error) {
      console.error('Error updating stat:', error);
      toast({
        variant: 'destructive',
        title: '更新失败',
        description: '无法更新统计数据'
      });
    }
  };

  const getStatByKey = (key: string): string => {
    const stat = stats.find(s => s.key === key);
    return stat?.value || '0';
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return {
    stats,
    loading,
    updateStat,
    getStatByKey,
    refetch: fetchStats
  };
};
