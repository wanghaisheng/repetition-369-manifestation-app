#!/bin/bash

# ==========================================
# 369 Manifestation - 预渲染构建脚本
# Prerender Build Script
# ==========================================

set -e  # 遇到错误立即退出

echo ""
echo "🔨 369 Manifestation - Prerender Build"
echo "========================================"
echo ""

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Error: Node.js is not installed"
    exit 1
fi

# 步骤 1: 构建应用
echo "📦 Step 1: Building application..."
npm run build

if [ ! -d "dist" ]; then
    echo "❌ Error: Build failed - dist directory not found"
    exit 1
fi

echo "✅ Build completed"
echo ""

# 步骤 2: 运行预渲染脚本
echo "🖼️  Step 2: Starting prerendering..."

# 使用新的 Puppeteer 预渲染脚本
node scripts/prerender.mjs

echo ""

# 步骤 3: 验证 SEO 元素
echo "🔍 Step 3: Validating SEO elements..."
node scripts/validate-prerender.mjs

echo ""
echo "========================================"
echo "✨ Build, prerender, and validation complete!"
echo "📁 Output directory: dist/"
echo "========================================"
echo ""

# 列出预渲染的文件
echo "📋 Prerendered files:"
find dist -name "index.html" -type f | head -20

echo ""
echo "🚀 Ready to deploy!"
