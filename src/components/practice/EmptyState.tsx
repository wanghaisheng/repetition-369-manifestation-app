
import { Circle } from 'lucide-react';

interface EmptyStateProps {
  type: 'loading' | 'noWishes';
}

export const EmptyState = ({ type }: EmptyStateProps) => {
  if (type === 'loading') {
    return (
      <div className="flex-1 bg-ios-secondary-background px-4 py-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ios-blue mx-auto mb-4"></div>
          <p className="text-gray-600">加载练习数据中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-ios-secondary-background px-4 py-6 flex items-center justify-center">
      <div className="text-center">
        <Circle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-600 mb-2">还没有愿望</h3>
        <p className="text-gray-500 mb-6">请先创建一个愿望来开始369练习</p>
      </div>
    </div>
  );
};
