
import React from 'react';
import { Card } from '@/components/ui/card';
import { BookOpen, Plus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  type: 'loading' | 'noWishes' | 'noPractices';
  onCreateWish?: () => void;
}

export const EmptyState = ({ type, onCreateWish }: EmptyStateProps) => {
  if (type === 'loading') {
    return (
      <div className="flex-1 bg-ios-secondary-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-ios-blue mx-auto mb-4" />
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  if (type === 'noWishes') {
    return (
      <div className="flex-1 bg-ios-secondary-background flex items-center justify-center p-4">
        <Card className="p-8 text-center max-w-md bg-white border-0 shadow-ios rounded-ios">
          <div className="w-16 h-16 bg-gradient-to-br from-manifest-warm-gold to-manifest-lavender rounded-ios flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">开始您的显化之旅</h3>
          <p className="text-gray-600 mb-6">创建您的第一个愿望，开始369练习法，让梦想成真。</p>
          <Button 
            onClick={onCreateWish}
            className="bg-gradient-to-r from-manifest-warm-gold to-manifest-lavender text-white rounded-ios"
          >
            <Plus className="w-4 h-4 mr-2" />
            创建愿望
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-ios-secondary-background flex items-center justify-center p-4">
      <Card className="p-8 text-center max-w-md bg-white border-0 shadow-ios rounded-ios">
        <div className="w-16 h-16 bg-gray-100 rounded-ios flex items-center justify-center mx-auto mb-4">
          <BookOpen className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">暂无练习记录</h3>
        <p className="text-gray-600">选择一个愿望开始今天的369练习。</p>
      </Card>
    </div>
  );
};
