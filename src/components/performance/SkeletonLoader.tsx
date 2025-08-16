import React from 'react';
import { cn } from '@/lib/utils';

interface SkeletonLoaderProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'card';
  width?: string | number;
  height?: string | number;
  lines?: number;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  className,
  variant = 'rectangular',
  width,
  height,
  lines = 1,
}) => {
  const baseClasses = 'animate-pulse bg-gradient-to-r from-muted via-muted-foreground/20 to-muted bg-[length:200%_100%]';
  
  const variantClasses = {
    text: 'h-4 rounded',
    circular: 'rounded-full aspect-square',
    rectangular: 'rounded-md',
    card: 'rounded-lg',
  };

  const style = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  };

  if (variant === 'text' && lines > 1) {
    return (
      <div className={cn('space-y-2', className)}>
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={cn(baseClasses, variantClasses[variant])}
            style={index === lines - 1 ? { ...style, width: '80%' } : style}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(baseClasses, variantClasses[variant], className)}
      style={style}
    />
  );
};

// 预设骨架屏组件
export const CardSkeleton = () => (
  <div className="p-6 space-y-4">
    <SkeletonLoader variant="text" width="60%" />
    <SkeletonLoader variant="text" lines={3} />
    <div className="flex space-x-2">
      <SkeletonLoader variant="circular" width={32} height={32} />
      <SkeletonLoader variant="text" width="40%" />
    </div>
  </div>
);

export const ListSkeleton = ({ items = 5 }: { items?: number }) => (
  <div className="space-y-4">
    {Array.from({ length: items }).map((_, index) => (
      <div key={index} className="flex items-center space-x-4 p-4">
        <SkeletonLoader variant="circular" width={48} height={48} />
        <div className="flex-1 space-y-2">
          <SkeletonLoader variant="text" width="80%" />
          <SkeletonLoader variant="text" width="60%" />
        </div>
      </div>
    ))}
  </div>
);

export const ImageSkeleton = ({ width, height }: { width?: number; height?: number }) => (
  <SkeletonLoader 
    variant="rectangular" 
    width={width} 
    height={height}
    className="bg-gradient-to-br from-muted to-muted-foreground/10"
  />
);