
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
    console.log('Scheduled query function triggered at:', new Date().toISOString());
    
    // Create Supabase client using environment variables for better security
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get request body
    const body = await req.json().catch(() => ({}));
    console.log('Request body:', body);

    // Perform comprehensive database queries
    const results: Record<string, any> = {};

    // Query 1: Get total number of profiles (users)
    const { count: totalUsers, error: profilesError } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });
    
    if (profilesError) {
      console.error('Error querying profiles:', profilesError);
    } else {
      results.totalUsers = totalUsers || 0;
      console.log('Total users:', results.totalUsers);
    }

    // Query 2: Get total active wishes
    const { count: totalWishes, error: wishesError } = await supabase
      .from('wishes')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true);
    
    if (wishesError) {
      console.error('Error querying wishes:', wishesError);
    } else {
      results.totalWishes = totalWishes || 0;
      console.log('Total active wishes:', results.totalWishes);
    }

    // Query 3: Get total practice sessions in last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const { count: recentPractices, error: practicesError } = await supabase
      .from('practice_sessions')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', sevenDaysAgo.toISOString());
    
    if (practicesError) {
      console.error('Error querying practice sessions:', practicesError);
    } else {
      results.recentPractices = recentPractices || 0;
      console.log('Recent practice sessions (7 days):', results.recentPractices);
    }

    // Query 4: Get total approved user stories
    const { count: totalStories, error: storiesError } = await supabase
      .from('user_stories')
      .select('*', { count: 'exact', head: true })
      .eq('is_approved', true);
    
    if (storiesError) {
      console.error('Error querying user stories:', storiesError);
    } else {
      results.totalStories = totalStories || 0;
      console.log('Total approved user stories:', results.totalStories);
    }

    // Query 5: Get total published blog posts
    const { count: totalBlogPosts, error: blogError } = await supabase
      .from('blog_posts')
      .select('*', { count: 'exact', head: true })
      .eq('published', true);
    
    if (blogError) {
      console.error('Error querying blog posts:', blogError);
    } else {
      results.totalBlogPosts = totalBlogPosts || 0;
      console.log('Total published blog posts:', results.totalBlogPosts);
    }

    // Query 6: Get newsletter subscribers count
    const { count: totalSubscribers, error: subscribersError } = await supabase
      .from('newsletter_subscribers')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true);
    
    if (subscribersError) {
      console.error('Error querying newsletter subscribers:', subscribersError);
    } else {
      results.totalSubscribers = totalSubscribers || 0;
      console.log('Total newsletter subscribers:', results.totalSubscribers);
    }

    // Log comprehensive results
    console.log('=== Scheduled Query Results ===');
    console.log('Total Users:', results.totalUsers);
    console.log('Total Active Wishes:', results.totalWishes);
    console.log('Recent Practice Sessions (7 days):', results.recentPractices);
    console.log('Total Approved User Stories:', results.totalStories);
    console.log('Total Published Blog Posts:', results.totalBlogPosts);
    console.log('Total Newsletter Subscribers:', results.totalSubscribers);
    console.log('Query execution completed at:', new Date().toISOString());
    console.log('===============================');

    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        timestamp: new Date().toISOString(),
        data: results
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error in scheduled-query function:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
        stack: error.stack
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
