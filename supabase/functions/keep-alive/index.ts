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
    console.log('Keep-alive function triggered at:', new Date().toISOString());
    
    // Create Supabase client using current project configuration
    const supabaseUrl = 'https://hziwbeyokjdswlzzmjem.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh6aXdiZXlva2pkc3dsenptamVtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA2OTcwMDgsImV4cCI6MjA2NjI3MzAwOH0.Gg6MndKGFjMjN7TVClOgCVnVWeWBhpngIaQKtRL0wBQ';
    
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Perform keep-alive queries to maintain database connection
    const results = [];

    // Query 1: Simple connection test
    const { data: connectionTest, error: connectionError } = await supabase
      .from('profiles')
      .select('count', { count: 'exact', head: true });
    
    if (connectionError) {
      console.error('Connection test failed:', connectionError);
      results.push({
        query: 'connection_test',
        status: 'error',
        message: connectionError.message,
      });
    } else {
      console.log('Connection test successful');
      results.push({
        query: 'connection_test',
        status: 'success',
        count: connectionTest?.length || 0,
      });
    }

    // Query 2: Check database health with wishes table
    const { data: wishesCheck, error: wishesError } = await supabase
      .from('wishes')
      .select('count', { count: 'exact', head: true });
    
    if (wishesError) {
      console.error('Wishes table check failed:', wishesError);
      results.push({
        query: 'wishes_check',
        status: 'error',
        message: wishesError.message,
      });
    } else {
      console.log('Wishes table check successful');
      results.push({
        query: 'wishes_check',
        status: 'success',
        count: wishesCheck?.length || 0,
      });
    }

    // Query 3: Check practice sessions table
    const { data: practiceCheck, error: practiceError } = await supabase
      .from('practice_sessions')
      .select('count', { count: 'exact', head: true });
    
    if (practiceError) {
      console.error('Practice sessions check failed:', practiceError);
      results.push({
        query: 'practice_sessions_check',
        status: 'error',
        message: practiceError.message,
      });
    } else {
      console.log('Practice sessions check successful');
      results.push({
        query: 'practice_sessions_check',
        status: 'success',
        count: practiceCheck?.length || 0,
      });
    }

    // Log summary
    const successCount = results.filter(r => r.status === 'success').length;
    const errorCount = results.filter(r => r.status === 'error').length;
    
    console.log(`Keep-alive completed: ${successCount} successful, ${errorCount} errors`);

    return new Response(
      JSON.stringify({
        success: true,
        timestamp: new Date().toISOString(),
        project: 'xianghua369-app',
        summary: {
          total_queries: results.length,
          successful: successCount,
          errors: errorCount,
        },
        results: results,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error in keep-alive function:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
        project: 'xianghua369-app',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
