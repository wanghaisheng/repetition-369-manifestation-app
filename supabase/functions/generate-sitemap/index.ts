import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface BlogPost {
  slug: string;
  updated_at: string;
  language: string;
}

interface SitemapUrl {
  loc: string;
  lastmod: string;
  changefreq: string;
  priority: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting sitemap generation...');

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch all published blog posts
    const { data: posts, error } = await supabase
      .from('blog_posts')
      .select('slug, updated_at, language')
      .eq('published', true)
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error fetching blog posts:', error);
      throw error;
    }

    console.log(`Fetched ${posts?.length || 0} published blog posts`);

    const baseUrl = 'https://heymanifestation.com';
    const urls: SitemapUrl[] = [];

    // Static pages with their priorities and change frequencies
    const staticPages = [
      { path: '', priority: '1.0', changefreq: 'daily' }, // Homepage
      { path: 'about', priority: '0.9', changefreq: 'monthly' },
      { path: 'method369', priority: '0.9', changefreq: 'monthly' },
      { path: 'faq', priority: '0.8', changefreq: 'weekly' },
      { path: 'blog', priority: '0.8', changefreq: 'daily' },
      { path: 'user-stories', priority: '0.7', changefreq: 'weekly' },
      { path: 'privacy', priority: '0.5', changefreq: 'yearly' },
      { path: 'terms', priority: '0.5', changefreq: 'yearly' },
      { path: 'auth', priority: '0.6', changefreq: 'monthly' },
    ];

    // Add static pages
    staticPages.forEach(page => {
      // Add Chinese version
      urls.push({
        loc: `${baseUrl}/${page.path}`,
        lastmod: new Date().toISOString().split('T')[0],
        changefreq: page.changefreq,
        priority: page.priority,
      });

      // Add English version
      urls.push({
        loc: `${baseUrl}/en/${page.path}`,
        lastmod: new Date().toISOString().split('T')[0],
        changefreq: page.changefreq,
        priority: page.priority,
      });
    });

    // Add blog posts by language
    if (posts && posts.length > 0) {
      posts.forEach((post: BlogPost) => {
        const lastmod = new Date(post.updated_at).toISOString().split('T')[0];
        const langPrefix = post.language === 'zh' ? '' : `/${post.language}`;
        
        urls.push({
          loc: `${baseUrl}${langPrefix}/blog/${post.slug}`,
          lastmod: lastmod,
          changefreq: 'weekly',
          priority: '0.7',
        });
      });
    }

    // Generate XML sitemap
    const xmlContent = generateSitemapXML(urls);

    console.log(`Generated sitemap with ${urls.length} URLs`);

    // Return XML response with proper headers
    return new Response(xmlContent, {
      status: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      },
    });

  } catch (error) {
    console.error('Error generating sitemap:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to generate sitemap',
        details: error.message 
      }), 
      {
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        },
      }
    );
  }
});

function generateSitemapXML(urls: SitemapUrl[]): string {
  const urlEntries = urls.map(url => `
  <url>
    <loc>${escapeXml(url.loc)}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">${urlEntries}
</urlset>`;
}

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}
