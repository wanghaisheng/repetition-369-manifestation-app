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

const BASE_URL = 'https://369.heymanifestation.com';
const SUPABASE_FUNCTION_URL = 'https://hziwbeyokjdswlzzmjem.supabase.co/functions/v1';

// 分阶段暴露配置 - 控制哪些Sitemap被包含在Index中
// Phase 1: 核心页面 + 博客
// Phase 2: 增加用户故事
// Phase 3: 增加应用页面（可选，应用页面通常不需要索引）
const SITEMAP_PHASES = {
  current_phase: 2, // 当前阶段：1-3
  phase_config: {
    1: ['sitemap-core', 'sitemap-blog'],
    2: ['sitemap-core', 'sitemap-blog', 'sitemap-stories'],
    3: ['sitemap-core', 'sitemap-blog', 'sitemap-stories', 'sitemap-app'],
  }
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const sitemapType = url.searchParams.get('type') || 'index';
    
    console.log(`Generating sitemap type: ${sitemapType}`);

    // 根据请求类型生成不同的Sitemap
    switch (sitemapType) {
      case 'index':
        return generateSitemapIndex();
      case 'core':
        return generateCoreSitemap();
      case 'blog':
        return generateBlogSitemap();
      case 'stories':
        return generateStoriesSitemap();
      case 'app':
        return generateAppSitemap();
      default:
        return generateSitemapIndex();
    }
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to generate sitemap', details: error.message }), 
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

// 生成Sitemap Index（主索引）
function generateSitemapIndex(): Response {
  const currentDate = new Date().toISOString().split('T')[0];
  const currentPhase = SITEMAP_PHASES.current_phase;
  const activeSitemaps = SITEMAP_PHASES.phase_config[currentPhase as keyof typeof SITEMAP_PHASES.phase_config];
  
  console.log(`Phase ${currentPhase}: Active sitemaps:`, activeSitemaps);
  
  const sitemapEntries = activeSitemaps.map(sitemap => {
    const type = sitemap.replace('sitemap-', '');
    return `
  <sitemap>
    <loc>${SUPABASE_FUNCTION_URL}/generate-sitemap?type=${type}</loc>
    <lastmod>${currentDate}</lastmod>
  </sitemap>`;
  }).join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${sitemapEntries}
</sitemapindex>`;

  return new Response(xml, {
    status: 200,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}

// 生成核心页面Sitemap（P0优先级）
function generateCoreSitemap(): Response {
  const currentDate = new Date().toISOString().split('T')[0];
  const urls: SitemapUrl[] = [];

  // 核心静态页面 - 最高优先级
  const corePages = [
    { path: '', priority: '1.0', changefreq: 'daily' }, // 首页
    { path: 'about', priority: '0.9', changefreq: 'weekly' },
    { path: 'method369', priority: '0.9', changefreq: 'weekly' },
    { path: 'faq', priority: '0.8', changefreq: 'weekly' },
    { path: 'blog', priority: '0.9', changefreq: 'daily' }, // 博客列表页
    { path: 'user-stories', priority: '0.8', changefreq: 'daily' },
    { path: 'privacy', priority: '0.3', changefreq: 'yearly' },
    { path: 'terms', priority: '0.3', changefreq: 'yearly' },
  ];

  // 双语版本
  corePages.forEach(page => {
    // 中文版本
    urls.push({
      loc: page.path ? `${BASE_URL}/${page.path}` : BASE_URL,
      lastmod: currentDate,
      changefreq: page.changefreq,
      priority: page.priority,
    });
    // 英文版本
    urls.push({
      loc: page.path ? `${BASE_URL}/en/${page.path}` : `${BASE_URL}/en`,
      lastmod: currentDate,
      changefreq: page.changefreq,
      priority: page.priority,
    });
  });

  const xml = generateSitemapXML(urls);
  console.log(`Core sitemap: ${urls.length} URLs`);

  return new Response(xml, {
    status: 200,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}

// 生成博客文章Sitemap
async function generateBlogSitemap(): Promise<Response> {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
  const supabase = createClient(supabaseUrl, supabaseKey);
  const currentDate = new Date().toISOString().split('T')[0];
  const urls: SitemapUrl[] = [];

  const { data: posts, error } = await supabase
    .from('blog_posts')
    .select('slug, updated_at, language')
    .eq('published', true)
    .order('updated_at', { ascending: false });

  if (error) {
    console.error('Error fetching blog posts:', error);
    throw error;
  }

  if (posts && posts.length > 0) {
    posts.forEach((post: BlogPost) => {
      const postDate = post.updated_at ? new Date(post.updated_at).toISOString().split('T')[0] : currentDate;
      
      if (post.language === 'zh') {
        urls.push({
          loc: `${BASE_URL}/blog/${post.slug}`,
          lastmod: postDate,
          changefreq: 'weekly',
          priority: '0.7',
        });
      } else if (post.language === 'en') {
        urls.push({
          loc: `${BASE_URL}/en/blog/${post.slug}`,
          lastmod: postDate,
          changefreq: 'weekly',
          priority: '0.7',
        });
      }
    });
  }

  const xml = generateSitemapXML(urls);
  console.log(`Blog sitemap: ${urls.length} URLs`);

  return new Response(xml, {
    status: 200,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}

// 生成用户故事Sitemap（P1优先级 - 第二阶段暴露）
async function generateStoriesSitemap(): Promise<Response> {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
  const supabase = createClient(supabaseUrl, supabaseKey);
  const currentDate = new Date().toISOString().split('T')[0];
  const urls: SitemapUrl[] = [];

  // 获取已批准的用户故事
  const { data: stories, error } = await supabase
    .from('user_stories')
    .select('id, updated_at')
    .eq('is_approved', true)
    .order('updated_at', { ascending: false });

  if (error) {
    console.error('Error fetching user stories:', error);
  }

  // 如果有独立的用户故事详情页，可以在这里添加
  // 目前用户故事在列表页展示，所以这里主要是占位
  if (stories && stories.length > 0) {
    // 可以为每个故事创建独立URL（如果有详情页的话）
    // stories.forEach((story) => { ... });
  }

  // 至少包含用户故事列表页
  urls.push({
    loc: `${BASE_URL}/user-stories`,
    lastmod: currentDate,
    changefreq: 'daily',
    priority: '0.7',
  });
  urls.push({
    loc: `${BASE_URL}/en/user-stories`,
    lastmod: currentDate,
    changefreq: 'daily',
    priority: '0.7',
  });

  const xml = generateSitemapXML(urls);
  console.log(`Stories sitemap: ${urls.length} URLs`);

  return new Response(xml, {
    status: 200,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}

// 生成应用页面Sitemap（P2优先级 - 第三阶段暴露，通常不建议索引）
function generateAppSitemap(): Response {
  const currentDate = new Date().toISOString().split('T')[0];
  const urls: SitemapUrl[] = [];

  // 应用页面通常不需要被搜索引擎索引
  // 但如果需要，可以添加一些公开的应用入口页
  const appPages = [
    { path: 'auth', priority: '0.4', changefreq: 'monthly' },
  ];

  appPages.forEach(page => {
    urls.push({
      loc: `${BASE_URL}/${page.path}`,
      lastmod: currentDate,
      changefreq: page.changefreq,
      priority: page.priority,
    });
  });

  const xml = generateSitemapXML(urls);
  console.log(`App sitemap: ${urls.length} URLs`);

  return new Response(xml, {
    status: 200,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}

function generateSitemapXML(urls: SitemapUrl[]): string {
  const urlEntries = urls.map((url) => {
    // 提取路径用于生成hreflang
    const pathWithoutLang = url.loc
      .replace(`${BASE_URL}/en/`, '/')
      .replace(`${BASE_URL}/en`, '/')
      .replace(BASE_URL, '');
    
    const zhUrl = pathWithoutLang ? `${BASE_URL}${pathWithoutLang}` : BASE_URL;
    const enUrl = pathWithoutLang === '/' || pathWithoutLang === '' ? `${BASE_URL}/en` : `${BASE_URL}/en${pathWithoutLang}`;
    
    return `
  <url>
    <loc>${escapeXml(url.loc)}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
    <xhtml:link rel="alternate" hreflang="zh-CN" href="${escapeXml(zhUrl)}" />
    <xhtml:link rel="alternate" hreflang="en" href="${escapeXml(enUrl)}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(zhUrl)}" />
  </url>`;
  }).join('');

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
