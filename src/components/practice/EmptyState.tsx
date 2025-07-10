
import React from 'react';
import { Card } from '@/components/ui/card';
import { BookOpen, Plus, Loader2, Sparkles } from 'lucide-react';
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
          <p className="text-sm text-gray-500 mt-2">正在同步您的数据</p>
        </div>
      </div>
    );
  }

  if (type === 'noWishes') {
    return (
      <div className="flex-1 bg-ios-secondary-background flex items-center justify-center p-4">
        <Card className="p-8 text-center max-w-md bg-white border-0 shadow-ios rounded-ios">
          <div className="w-16 h-16 bg-gradient-to-br from-manifest-warm-gold to-manifest-lavender rounded-ios flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">开始您的显化之旅</h3>
          <p className="text-gray-600 mb-2">369显化法是实现愿望的强大工具</p>
          <p className="text-sm text-gray-500 mb-6">每天书写3次、6次、9次您的愿望，让宇宙帮您实现梦想</p>
          <Button 
            onClick={onCreateWish}
            className="bg-gradient-to-r from-manifest-warm-gold to-manifest-lavender text-white rounded-ios px-6 py-3 shadow-ios"
          >
            <Plus className="w-4 h-4 mr-2" />
            创建第一个愿望
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
        <h3 className="text-lg font-semibold text-gray-800 mb-2">准备开始练习</h3>
        <p className="text-gray-600 mb-4">选择一个愿望开始今天的369练习</p>
        <p className="text-sm text-gray-500">坚持每日练习，让愿望成真</p>
      </Card>
    </div>
  );
};
