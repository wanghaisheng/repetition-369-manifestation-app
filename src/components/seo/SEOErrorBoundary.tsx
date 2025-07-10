
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class SEOErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    console.warn('SEO component error:', error);
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.warn('SEO Error Boundary caught an error:', error, errorInfo);
    // 不让SEO错误影响整个应用，只记录警告
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <>
          {/* 基础SEO降级方案 */}
          <title>显化369 - 愿望成真的神奇力量</title>
          <meta name="description" content="基于特斯拉369显化法则的智能练习应用，帮助您系统化实现愿望目标。" />
        </>
      );
    }

    return this.props.children;
  }
}
