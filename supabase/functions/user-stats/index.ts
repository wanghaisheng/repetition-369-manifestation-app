
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('User stats API called at:', new Date().toISOString());
    
    // Create Supabase client using current project configuration
    const supabaseUrl = 'https://hziwbeyokjdswlzzmjem.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh6aXdiZXlva2pkc3dsenptamVtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA2OTcwMDgsImV4cCI6MjA2NjI3MzAwOH0.Gg6MndKGFjMjN7TVClOgCVnVWeWBhpngIaQKtRL0wBQ';
    
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Query database for user statistics
    const stats = {};

    // Get total users count
    const { count: totalUsers, error: usersError } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });
    
    if (usersError) {
      console.error('Error querying users:', usersError);
      stats.totalUsers = { error: usersError.message };
    } else {
      stats.totalUsers = totalUsers || 0;
      console.log('Total users:', totalUsers);
    }

    // Get users created in the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const { count: newUsers, error: newUsersError } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', thirtyDaysAgo.toISOString());
    
    if (newUsersError) {
      console.error('Error querying new users:', newUsersError);
      stats.newUsersLast30Days = { error: newUsersError.message };
    } else {
      stats.newUsersLast30Days = newUsers || 0;
      console.log('New users (last 30 days):', newUsers);
    }

    // Get total wishes count
    const { count: totalWishes, error: wishesError } = await supabase
      .from('wishes')
      .select('*', { count: 'exact', head: true });
    
    if (wishesError) {
      console.error('Error querying wishes:', wishesError);
      stats.totalWishes = { error: wishesError.message };
    } else {
      stats.totalWishes = totalWishes || 0;
      console.log('Total wishes:', totalWishes);
    }

    // Get active wishes count
    const { count: activeWishes, error: activeWishesError } = await supabase
      .from('wishes')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true);
    
    if (activeWishesError) {
      console.error('Error querying active wishes:', activeWishesError);
      stats.activeWishes = { error: activeWishesError.message };
    } else {
      stats.activeWishes = activeWishes || 0;
      console.log('Active wishes:', activeWishes);
    }

    // Get practice sessions in the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const { count: recentPractice, error: practiceError } = await supabase
      .from('practice_sessions')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', sevenDaysAgo.toISOString());
    
    if (practiceError) {
      console.error('Error querying practice sessions:', practiceError);
      stats.recentPracticeSessions = { error: practiceError.message };
    } else {
      stats.recentPracticeSessions = recentPractice || 0;
      console.log('Recent practice sessions:', recentPractice);
    }

    // Calculate engagement metrics
    const engagementRate = stats.totalUsers > 0 && stats.recentPracticeSessions > 0 
      ? ((stats.recentPracticeSessions / stats.totalUsers) * 100).toFixed(2)
      : 0;

    console.log('User stats query completed successfully');

    return new Response(
      JSON.stringify({
        success: true,
        timestamp: new Date().toISOString(),
        project: 'xianghua369-app',
        domain: 'https://369.heymanifestation.com/app',
        statistics: {
          users: {
            total: stats.totalUsers,
            newLast30Days: stats.newUsersLast30Days,
          },
          wishes: {
            total: stats.totalWishes,
            active: stats.activeWishes,
          },
          practice: {
            sessionsLast7Days: stats.recentPracticeSessions,
            engagementRate: `${engagementRate}%`,
          },
        },
        metadata: {
          queryExecutedAt: new Date().toISOString(),
          apiVersion: '1.0.0',
        },
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error in user-stats function:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
        project: 'xianghua369-app',
        domain: 'https://369.heymanifestation.com/app',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
