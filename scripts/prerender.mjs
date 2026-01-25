#!/usr/bin/env node

/**
 * 预渲染脚本 - Prerendering Script
 * 
 * 使用 Puppeteer 对营销页面和动态博客页面进行预渲染
 * 从 Supabase 获取已发布的博客文章 slug
 * 复用 sitemap 的路由配置，确保一致性
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';
import puppeteer from 'puppeteer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');

// 配置
const PREVIEW_PORT = process.env.PREVIEW_PORT || 4173;
const BASE_URL = `http://127.0.0.1:${PREVIEW_PORT}`;
const SUPPORTED_LOCALES = ['zh', 'en'];
const DEFAULT_LOCALE = 'zh';

// Supabase 配置
const SUPABASE_URL = 'https://hziwbeyokjdswlzzmjem.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh6aXdiZXlva2pkc3dsenptamVtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA2OTcwMDgsImV4cCI6MjA2NjI3MzAwOH0.Gg6MndKGFjMjN7TVClOgCVnVWeWBhpngIaQKtRL0wBQ';

// 营销页面 - 与 src/config/routes.ts 保持同步
const MARKETING_PAGES = [
  { path: '', name: 'landing' },
  { path: 'about', name: 'about' },
  { path: 'faq', name: 'faq' },
  { path: 'method369', name: 'method369' },
  { path: 'blog', name: 'blog' },
  { path: 'user-stories', name: 'user-stories' },
  { path: 'privacy', name: 'privacy' },
  { path: 'terms', name: 'terms' },
];

// 从 Supabase 获取已发布的博客文章
async function fetchBlogPosts() {
  console.log('📡 Fetching blog posts from Supabase...');
  
  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/blog_posts?published=eq.true&select=slug,language`,
      {
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const posts = await response.json();
    console.log(`   ✅ Found ${posts.length} published blog posts`);
    return posts;
  } catch (error) {
    console.error('   ❌ Failed to fetch blog posts:', error.message);
    return [];
  }
}

// 获取所有需要预渲染的路由（包括动态博客页面）
async function getAllRoutesToPrerender() {
  const routes = [];

  // 1. 添加静态营销页面
  MARKETING_PAGES.forEach(page => {
    // 中文版本（默认，不带前缀）
    routes.push({
      url: page.path ? `/${page.path}` : '/',
      locale: 'zh',
      name: page.name,
    });

    // 英文版本（带 /en 前缀）
    routes.push({
      url: page.path ? `/en/${page.path}` : '/en',
      locale: 'en',
      name: `${page.name}-en`,
    });
  });

  // 2. 获取并添加动态博客页面
  const blogPosts = await fetchBlogPosts();
  
  blogPosts.forEach(post => {
    if (post.language === 'zh') {
      // 中文博客文章
      routes.push({
        url: `/blog/${post.slug}`,
        locale: 'zh',
        name: `blog-${post.slug}`,
        dynamic: true,
      });
    } else if (post.language === 'en') {
      // 英文博客文章
      routes.push({
        url: `/en/blog/${post.slug}`,
        locale: 'en',
        name: `blog-${post.slug}-en`,
        dynamic: true,
      });
    }
  });

  return routes;
}

// 启动预览服务器
function startPreviewServer() {
  return new Promise((resolve, reject) => {
    console.log('🚀 Starting preview server...');
    
    const server = spawn('npx', ['vite', 'preview', '--port', PREVIEW_PORT.toString()], {
      cwd: rootDir,
      stdio: ['pipe', 'pipe', 'pipe'],
      shell: true,
    });

    let serverReady = false;

    server.stdout.on('data', (data) => {
      const output = data.toString();
      console.log(`[Server] ${output}`);
      
      if (output.includes('Local:') || output.includes(`${PREVIEW_PORT}`)) {
        serverReady = true;
        // 等待服务器完全启动
        setTimeout(() => resolve(server), 2000);
      }
    });

    server.stderr.on('data', (data) => {
      console.error(`[Server Error] ${data.toString()}`);
    });

    server.on('error', (error) => {
      reject(error);
    });

    // 超时处理
    setTimeout(() => {
      if (!serverReady) {
        console.log('⏳ Server startup timeout, assuming ready...');
        resolve(server);
      }
    }, 10000);
  });
}

// 预渲染单个页面
async function prerenderPage(browser, route) {
  const { url, locale, name } = route;
  const fullUrl = `${BASE_URL}${url}`;
  
  console.log(`📄 Prerendering: ${url} (${locale})`);
  
  const page = await browser.newPage();
  
  try {
    // 设置视口
    await page.setViewport({
      width: 1920,
      height: 1080,
    });

    // 设置用户代理
    await page.setUserAgent('Mozilla/5.0 (compatible; Prerender/1.0; +https://369.heymanifestation.com)');

    // 访问页面
    await page.goto(fullUrl, {
      waitUntil: 'networkidle0',
      timeout: 30000,
    });

    // 等待内容加载
    await page.waitForTimeout(2000);

    // 获取渲染后的 HTML
    let html = await page.content();

    // 清理预渲染标记，避免重复 hydration
    html = html.replace(
      /<script[^>]*>window\.__PRERENDERED__\s*=\s*true;<\/script>/g,
      ''
    );

    // 添加预渲染标记
    html = html.replace(
      '</head>',
      '<script>window.__PRERENDERED__ = true;</script></head>'
    );

    // 确定输出路径
    let outputPath;
    if (url === '/') {
      outputPath = path.join(distDir, 'index.html');
    } else if (url === '/en') {
      outputPath = path.join(distDir, 'en', 'index.html');
    } else {
      outputPath = path.join(distDir, url.slice(1), 'index.html');
    }

    // 确保目录存在
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // 写入文件
    fs.writeFileSync(outputPath, html);
    console.log(`   ✅ Saved: ${outputPath.replace(distDir, 'dist')}`);

    return { success: true, url };
  } catch (error) {
    console.error(`   ❌ Failed: ${url}`, error.message);
    return { success: false, url, error: error.message };
  } finally {
    await page.close();
  }
}

// 主函数
async function main() {
  console.log('\n🔨 369 Manifestation - Prerender Script');
  console.log('========================================\n');

  // 检查 dist 目录是否存在
  if (!fs.existsSync(distDir)) {
    console.error('❌ Error: dist directory not found. Please run "npm run build" first.');
    process.exit(1);
  }

  let server = null;
  let browser = null;

  try {
    // 获取所有路由（包括从数据库获取的动态博客页面）
    const routes = await getAllRoutesToPrerender();
    
    const staticCount = routes.filter(r => !r.dynamic).length;
    const dynamicCount = routes.filter(r => r.dynamic).length;
    
    console.log(`📋 Found ${routes.length} routes to prerender:`);
    console.log(`   - Static pages: ${staticCount}`);
    console.log(`   - Dynamic blog posts: ${dynamicCount}\n`);
    
    routes.forEach(r => console.log(`   ${r.dynamic ? '📝' : '📄'} ${r.url} (${r.locale})`));
    console.log('');

    // 启动预览服务器
    server = await startPreviewServer();
    console.log(`✅ Preview server running at ${BASE_URL}\n`);

    // 启动 Puppeteer
    console.log('🌐 Launching browser...');
    browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
      ],
    });
    console.log('✅ Browser launched\n');

    // 预渲染所有页面
    console.log('📝 Starting prerender...\n');
    const results = [];
    
    for (const route of routes) {
      const result = await prerenderPage(browser, route);
      results.push(result);
    }

    // 打印结果摘要
    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;

    console.log('\n========================================');
    console.log('📊 Prerender Summary');
    console.log('========================================');
    console.log(`   ✅ Successful: ${successful}`);
    console.log(`   ❌ Failed: ${failed}`);
    console.log(`   📁 Output: ${distDir}`);
    console.log('========================================\n');

    if (failed > 0) {
      console.log('Failed pages:');
      results.filter(r => !r.success).forEach(r => {
        console.log(`   - ${r.url}: ${r.error}`);
      });
    }

    console.log('✨ Prerender complete!\n');

  } catch (error) {
    console.error('❌ Prerender failed:', error);
    process.exit(1);
  } finally {
    // 清理
    if (browser) {
      await browser.close();
      console.log('🌐 Browser closed');
    }
    if (server) {
      server.kill();
      console.log('🔌 Preview server stopped');
    }
  }
}

// 运行
main().catch(console.error);
