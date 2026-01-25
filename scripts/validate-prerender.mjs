#!/usr/bin/env node

/**
 * 预渲染验证脚本 - Prerender Validation Script
 * 
 * 检查预渲染的 HTML 文件是否包含正确的 SEO 元素：
 * - Title 标签
 * - Meta Description
 * - Canonical URL
 * - Hreflang 标签
 * - Open Graph 标签
 * - 结构化数据 (JSON-LD)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');

// 配置
const BASE_URL = 'https://369.heymanifestation.com';
const REQUIRED_HREFLANG = ['zh-CN', 'en', 'x-default'];

// SEO 检查规则
const SEO_RULES = {
  title: {
    required: true,
    maxLength: 60,
    minLength: 10,
    pattern: null,
  },
  metaDescription: {
    required: true,
    maxLength: 160,
    minLength: 50,
  },
  canonical: {
    required: true,
    mustBeAbsolute: true,
    mustMatchBaseUrl: true,
  },
  hreflang: {
    required: true,
    requiredLanguages: REQUIRED_HREFLANG,
  },
  openGraph: {
    required: true,
    requiredProperties: ['og:title', 'og:description', 'og:url', 'og:type'],
  },
  structuredData: {
    required: false, // 推荐但不强制
  },
};

// 验证结果统计
const stats = {
  totalFiles: 0,
  passed: 0,
  failed: 0,
  warnings: 0,
  errors: [],
};

// 颜色输出
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// 解析 HTML 获取 SEO 元素
function extractSEOElements(html, filePath) {
  const elements = {
    title: null,
    metaDescription: null,
    canonical: null,
    hreflang: [],
    openGraph: {},
    structuredData: [],
    h1: [],
    issues: [],
    warnings: [],
  };

  // 提取 Title
  const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
  if (titleMatch) {
    elements.title = titleMatch[1].trim();
  }

  // 提取 Meta Description
  const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["'][^>]*>/i)
    || html.match(/<meta[^>]*content=["']([^"']*)["'][^>]*name=["']description["'][^>]*>/i);
  if (descMatch) {
    elements.metaDescription = descMatch[1].trim();
  }

  // 提取 Canonical
  const canonicalMatch = html.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']*)["'][^>]*>/i)
    || html.match(/<link[^>]*href=["']([^"']*)["'][^>]*rel=["']canonical["'][^>]*>/i);
  if (canonicalMatch) {
    elements.canonical = canonicalMatch[1].trim();
  }

  // 提取 Hreflang
  const hreflangRegex = /<link[^>]*rel=["']alternate["'][^>]*hreflang=["']([^"']*)["'][^>]*href=["']([^"']*)["'][^>]*>/gi;
  let hreflangMatch;
  while ((hreflangMatch = hreflangRegex.exec(html)) !== null) {
    elements.hreflang.push({
      lang: hreflangMatch[1],
      href: hreflangMatch[2],
    });
  }

  // 备用 hreflang 匹配模式
  const hreflangRegex2 = /<link[^>]*hreflang=["']([^"']*)["'][^>]*href=["']([^"']*)["'][^>]*rel=["']alternate["'][^>]*>/gi;
  while ((hreflangMatch = hreflangRegex2.exec(html)) !== null) {
    const existing = elements.hreflang.find(h => h.lang === hreflangMatch[1]);
    if (!existing) {
      elements.hreflang.push({
        lang: hreflangMatch[1],
        href: hreflangMatch[2],
      });
    }
  }

  // 提取 Open Graph
  const ogRegex = /<meta[^>]*property=["'](og:[^"']*)["'][^>]*content=["']([^"']*)["'][^>]*>/gi;
  let ogMatch;
  while ((ogMatch = ogRegex.exec(html)) !== null) {
    elements.openGraph[ogMatch[1]] = ogMatch[2];
  }

  // 提取结构化数据 (JSON-LD)
  const jsonLdRegex = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let jsonLdMatch;
  while ((jsonLdMatch = jsonLdRegex.exec(html)) !== null) {
    try {
      const data = JSON.parse(jsonLdMatch[1]);
      elements.structuredData.push(data);
    } catch (e) {
      elements.warnings.push('Invalid JSON-LD structured data');
    }
  }

  // 提取 H1
  const h1Regex = /<h1[^>]*>([^<]*)<\/h1>/gi;
  let h1Match;
  while ((h1Match = h1Regex.exec(html)) !== null) {
    elements.h1.push(h1Match[1].trim());
  }

  return elements;
}

// 验证 SEO 元素
function validateSEOElements(elements, filePath, relativePath) {
  const result = {
    path: relativePath,
    passed: true,
    issues: [],
    warnings: [],
  };

  // 验证 Title
  if (!elements.title) {
    result.issues.push('Missing <title> tag');
    result.passed = false;
  } else {
    if (elements.title.length > SEO_RULES.title.maxLength) {
      result.warnings.push(`Title too long (${elements.title.length}/${SEO_RULES.title.maxLength} chars)`);
    }
    if (elements.title.length < SEO_RULES.title.minLength) {
      result.warnings.push(`Title too short (${elements.title.length}/${SEO_RULES.title.minLength} chars)`);
    }
    if (elements.title.includes('undefined') || elements.title.includes('null')) {
      result.issues.push('Title contains undefined/null values');
      result.passed = false;
    }
  }

  // 验证 Meta Description
  if (!elements.metaDescription) {
    result.issues.push('Missing meta description');
    result.passed = false;
  } else {
    if (elements.metaDescription.length > SEO_RULES.metaDescription.maxLength) {
      result.warnings.push(`Meta description too long (${elements.metaDescription.length}/${SEO_RULES.metaDescription.maxLength} chars)`);
    }
    if (elements.metaDescription.length < SEO_RULES.metaDescription.minLength) {
      result.warnings.push(`Meta description too short (${elements.metaDescription.length}/${SEO_RULES.metaDescription.minLength} chars)`);
    }
  }

  // 验证 Canonical
  if (!elements.canonical) {
    result.issues.push('Missing canonical URL');
    result.passed = false;
  } else {
    if (!elements.canonical.startsWith('https://')) {
      result.issues.push('Canonical URL must be absolute (https://)');
      result.passed = false;
    }
    if (!elements.canonical.startsWith(BASE_URL)) {
      result.warnings.push(`Canonical URL doesn't match base URL: ${elements.canonical}`);
    }
  }

  // 验证 Hreflang
  if (elements.hreflang.length === 0) {
    result.issues.push('Missing hreflang tags');
    result.passed = false;
  } else {
    const foundLangs = elements.hreflang.map(h => h.lang);
    REQUIRED_HREFLANG.forEach(lang => {
      if (!foundLangs.includes(lang)) {
        result.issues.push(`Missing hreflang for: ${lang}`);
        result.passed = false;
      }
    });
  }

  // 验证 Open Graph
  const ogKeys = Object.keys(elements.openGraph);
  if (ogKeys.length === 0) {
    result.warnings.push('Missing Open Graph tags');
  } else {
    SEO_RULES.openGraph.requiredProperties.forEach(prop => {
      if (!elements.openGraph[prop]) {
        result.warnings.push(`Missing Open Graph property: ${prop}`);
      }
    });
  }

  // 验证 H1
  if (elements.h1.length === 0) {
    result.warnings.push('Missing H1 tag');
  } else if (elements.h1.length > 1) {
    result.warnings.push(`Multiple H1 tags found (${elements.h1.length})`);
  }

  // 验证结构化数据
  if (elements.structuredData.length === 0) {
    result.warnings.push('No JSON-LD structured data found');
  }

  return result;
}

// 递归查找所有 HTML 文件
function findHtmlFiles(dir, files = []) {
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      // 跳过 assets 目录
      if (item !== 'assets') {
        findHtmlFiles(fullPath, files);
      }
    } else if (item === 'index.html') {
      files.push(fullPath);
    }
  }
  
  return files;
}

// 主函数
async function main() {
  console.log('\n🔍 SEO Validation - Prerendered HTML Files');
  console.log('==========================================\n');

  // 检查 dist 目录
  if (!fs.existsSync(distDir)) {
    log('❌ Error: dist directory not found. Please run prerender first.', 'red');
    process.exit(1);
  }

  // 查找所有 HTML 文件
  const htmlFiles = findHtmlFiles(distDir);
  stats.totalFiles = htmlFiles.length;

  log(`📁 Found ${htmlFiles.length} HTML files to validate\n`, 'cyan');

  const results = [];

  // 验证每个文件
  for (const filePath of htmlFiles) {
    const relativePath = filePath.replace(distDir, '').replace(/\\/g, '/');
    const html = fs.readFileSync(filePath, 'utf-8');
    
    const elements = extractSEOElements(html, filePath);
    const result = validateSEOElements(elements, filePath, relativePath);
    
    results.push({
      ...result,
      elements,
    });

    // 输出单个文件结果
    if (result.passed && result.warnings.length === 0) {
      log(`✅ ${relativePath}`, 'green');
      stats.passed++;
    } else if (result.passed && result.warnings.length > 0) {
      log(`⚠️  ${relativePath}`, 'yellow');
      result.warnings.forEach(w => log(`   └─ ${w}`, 'yellow'));
      stats.passed++;
      stats.warnings += result.warnings.length;
    } else {
      log(`❌ ${relativePath}`, 'red');
      result.issues.forEach(i => log(`   └─ ❌ ${i}`, 'red'));
      result.warnings.forEach(w => log(`   └─ ⚠️ ${w}`, 'yellow'));
      stats.failed++;
      stats.errors.push({ path: relativePath, issues: result.issues });
    }
  }

  // 输出汇总
  console.log('\n==========================================');
  log('📊 Validation Summary', 'cyan');
  console.log('==========================================');
  log(`   Total files:   ${stats.totalFiles}`, 'reset');
  log(`   ✅ Passed:     ${stats.passed}`, 'green');
  log(`   ❌ Failed:     ${stats.failed}`, stats.failed > 0 ? 'red' : 'reset');
  log(`   ⚠️  Warnings:   ${stats.warnings}`, stats.warnings > 0 ? 'yellow' : 'reset');
  console.log('==========================================\n');

  // 如果有失败，输出详细信息
  if (stats.failed > 0) {
    log('❌ Failed Files:', 'red');
    stats.errors.forEach(err => {
      log(`\n   ${err.path}:`, 'red');
      err.issues.forEach(i => log(`      - ${i}`, 'red'));
    });
    console.log('');
  }

  // 生成报告文件
  const reportPath = path.join(rootDir, 'seo-validation-report.json');
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      totalFiles: stats.totalFiles,
      passed: stats.passed,
      failed: stats.failed,
      warnings: stats.warnings,
    },
    results: results.map(r => ({
      path: r.path,
      passed: r.passed,
      issues: r.issues,
      warnings: r.warnings,
      title: r.elements.title,
      metaDescription: r.elements.metaDescription?.substring(0, 50) + '...',
      canonical: r.elements.canonical,
      hreflangCount: r.elements.hreflang.length,
      h1Count: r.elements.h1.length,
      hasStructuredData: r.elements.structuredData.length > 0,
    })),
  };
  
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  log(`📄 Report saved to: seo-validation-report.json\n`, 'cyan');

  // 退出码
  if (stats.failed > 0) {
    log('❌ Validation failed! Please fix the issues above.\n', 'red');
    process.exit(1);
  } else {
    log('✨ All SEO validations passed!\n', 'green');
    process.exit(0);
  }
}

// 运行
main().catch(err => {
  console.error('Validation error:', err);
  process.exit(1);
});
