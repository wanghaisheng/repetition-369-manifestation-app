
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
    console.log('Scheduled query function triggered');
    
    // Create Supabase client
    const supabaseUrl = 'https://hziwbeyokjdswlzzmjem.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh6aXdiZXlva2pkc3dsenptamVtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA2OTcwMDgsImV4cCI6MjA2NjI3MzAwOH0.Gg6MndKGFjMjN7TVClOgCVnVWeWBhpngIaQKtRL0wBQ';
    
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get request body
    const body = await req.json();
    console.log('Request body:', body);

    // Perform database queries
    const results = {};

    // Query 1: Get total number of users
    const { data: profilesData, error: profilesError } = await supabase
      .from('profiles')
      .select('id', { count: 'exact' });
    
    if (profilesError) {
      console.error('Error querying profiles:', profilesError);
    } else {
      results.totalUsers = profilesData?.length || 0;
      console.log('Total users:', results.totalUsers);
    }

    // Query 2: Get total number of wishes
    const { data: wishesData, error: wishesError } = await supabase
      .from('wishes')
      .select('id', { count: 'exact' });
    
    if (wishesError) {
      console.error('Error querying wishes:', wishesError);
    } else {
      results.totalWishes = wishesData?.length || 0;
      console.log('Total wishes:', results.totalWishes);
    }

    // Query 3: Get total number of practice sessions in the last 3 days
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    
    const { data: practiceData, error: practiceError } = await supabase
      .from('practice_sessions')
      .select('id', { count: 'exact' })
      .gte('created_at', threeDaysAgo.toISOString());
    
    if (practiceError) {
      console.error('Error querying practice sessions:', practiceError);
    } else {
      results.recentPracticeSessions = practiceData?.length || 0;
      console.log('Recent practice sessions:', results.recentPracticeSessions);
    }

    // Query 4: Get active wishes count
    const { data: activeWishesData, error: activeWishesError } = await supabase
      .from('wishes')
      .select('id', { count: 'exact' })
      .eq('is_active', true);
    
    if (activeWishesError) {
      console.error('Error querying active wishes:', activeWishesError);
    } else {
      results.activeWishes = activeWishesData?.length || 0;
      console.log('Active wishes:', results.activeWishes);
    }

    // Log the results
    console.log('Scheduled query results:', results);
    console.log('Query execution completed at:', new Date().toISOString());

    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        timestamp: new Date().toISOString(),
        task: body.task || 'scheduled-database-query',
        results: results
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
        timestamp: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
