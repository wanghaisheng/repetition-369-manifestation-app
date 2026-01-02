import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom"],
  },
  optimizeDeps: {
    include: ["react", "react-dom", "react/jsx-runtime"],
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(mode),
  },
  build: {
    // 代码分割优化
    rollupOptions: {
      output: {
        manualChunks: {
          // 核心React库
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          // UI组件库
          'ui-vendor': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-tabs'],
          // 工具库
          'utils-vendor': ['date-fns', 'clsx', 'tailwind-merge'],
          // 图表库（按需加载）
          'chart-vendor': ['recharts'],
        },
      },
    },
    // 压缩优化
    minify: 'esbuild',
    // 目标浏览器
    target: 'es2020',
    // 生成源码映射（生产环境关闭）
    sourcemap: mode !== 'production',
    // chunk大小警告阈值
    chunkSizeWarningLimit: 500,
    // CSS代码分割
    cssCodeSplit: true,
  },
}));
