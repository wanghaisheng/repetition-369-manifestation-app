#!/usr/bin/env node

/**
 * 动态Sitemap测试脚本
 * 
 * 用于验证动态sitemap生成功能是否正常工作
 * 
 * 使用方法:
 * node scripts/test-sitemap.js
 */

const SITEMAP_URL = 'https://hziwbeyokjdswlzzmjem.supabase.co/functions/v1/generate-sitemap';

async function testSitemap() {
  console.log('🧪 开始测试动态Sitemap生成...\n');

  try {
    console.log('📡 正在获取sitemap...');
    const startTime = Date.now();
    
    const response = await fetch(SITEMAP_URL);
    const duration = Date.now() - startTime;

    console.log(`⏱️  响应时间: ${duration}ms`);
    console.log(`📊 HTTP状态: ${response.status} ${response.statusText}`);
    
    // 检查Content-Type
    const contentType = response.headers.get('content-type');
    console.log(`📄 Content-Type: ${contentType}`);
    
    if (contentType && contentType.includes('application/xml')) {
      console.log('✅ Content-Type正确');
    } else {
      console.log('❌ Content-Type不正确，应该是application/xml');
    }

    // 检查缓存设置
    const cacheControl = response.headers.get('cache-control');
    console.log(`💾 Cache-Control: ${cacheControl}`);

    if (response.ok) {
      const xml = await response.text();
      
      // 解析URL数量
      const urlMatches = xml.match(/<url>/g);
      const urlCount = urlMatches ? urlMatches.length : 0;
      console.log(`\n📝 Sitemap统计:`);
      console.log(`   - 总URL数量: ${urlCount}`);
      
      // 检查是否包含关键页面
      const hasHomepage = xml.includes('<loc>https://heymanifestation.com/</loc>');
      const hasBlog = xml.includes('/blog/');
      const hasMethod369 = xml.includes('/method369');
      const hasMultiLang = xml.includes('/en/');
      
      console.log(`\n✅ 内容验证:`);
      console.log(`   - 包含首页: ${hasHomepage ? '✅' : '❌'}`);
      console.log(`   - 包含博客文章: ${hasBlog ? '✅' : '❌'}`);
      console.log(`   - 包含369方法页: ${hasMethod369 ? '✅' : '❌'}`);
      console.log(`   - 包含多语言版本: ${hasMultiLang ? '✅' : '❌'}`);
      
      // 检查XML格式
      const isValidXml = xml.startsWith('<?xml version="1.0"') && 
                         xml.includes('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"');
      console.log(`   - XML格式正确: ${isValidXml ? '✅' : '❌'}`);
      
      // 显示前3个URL示例
      const urlRegex = /<url>[\s\S]*?<\/url>/g;
      const urls = xml.match(urlRegex);
      if (urls && urls.length > 0) {
        console.log(`\n📋 前3个URL示例:`);
        urls.slice(0, 3).forEach((url, index) => {
          const locMatch = url.match(/<loc>(.*?)<\/loc>/);
          const lastmodMatch = url.match(/<lastmod>(.*?)<\/lastmod>/);
          const priorityMatch = url.match(/<priority>(.*?)<\/priority>/);
          
          if (locMatch) {
            console.log(`\n   ${index + 1}. ${locMatch[1]}`);
            console.log(`      更新时间: ${lastmodMatch ? lastmodMatch[1] : 'N/A'}`);
            console.log(`      优先级: ${priorityMatch ? priorityMatch[1] : 'N/A'}`);
          }
        });
      }

      console.log('\n\n✅ 测试完成！Sitemap生成正常。');
      
      console.log('\n📌 下一步操作:');
      console.log('   1. 访问 https://search.google.com/search-console');
      console.log('   2. 选择您的网站资产');
      console.log('   3. 转到"索引" > "站点地图"');
      console.log(`   4. 添加sitemap URL: ${SITEMAP_URL}`);
      
    } else {
      console.error(`\n❌ 请求失败: ${response.status} ${response.statusText}`);
      const errorText = await response.text();
      console.error('错误详情:', errorText);
    }

  } catch (error) {
    console.error('\n❌ 测试失败:', error.message);
    console.error('\n请检查:');
    console.error('   1. Edge Function是否已部署');
    console.error('   2. Supabase项目是否正常运行');
    console.error('   3. 网络连接是否正常');
  }
}

// 运行测试
testSitemap();
