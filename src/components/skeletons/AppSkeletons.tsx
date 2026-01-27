import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

// 首页骨架屏
export const HomeViewSkeleton = () => (
  <div className="flex-1 bg-secondary/30 px-4 py-5 overflow-y-auto">
    {/* Welcome / Progress Card skeleton */}
    <div className="bg-card rounded-2xl p-5 shadow-sm border border-border/50 mb-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <Skeleton className="w-9 h-9 rounded-xl" />
          <Skeleton className="h-5 w-20" />
        </div>
        <Skeleton className="h-8 w-12" />
      </div>
      <Skeleton className="h-2 w-full mb-5" />
      <div className="grid grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="text-center">
            <Skeleton className="h-6 w-10 mx-auto mb-1" />
            <Skeleton className="h-3 w-14 mx-auto" />
          </div>
        ))}
      </div>
    </div>

    {/* Quick Stats skeleton */}
    <div className="grid grid-cols-2 gap-3 mb-4">
      {[1, 2].map((i) => (
        <div key={i} className="bg-card rounded-xl p-4 shadow-sm border border-border/50">
          <div className="flex items-center gap-3">
            <Skeleton className="w-10 h-10 rounded-xl" />
            <div>
              <Skeleton className="h-5 w-10 mb-1" />
              <Skeleton className="h-3 w-14" />
            </div>
          </div>
        </div>
      ))}
    </div>

    {/* Quick Actions skeleton */}
    <div className="bg-card rounded-2xl p-5 shadow-sm border border-border/50 mb-4">
      <Skeleton className="h-5 w-20 mb-4" />
      <div className="space-y-2.5">
        <Skeleton className="h-16 w-full rounded-xl" />
        <Skeleton className="h-16 w-full rounded-xl" />
      </div>
    </div>
  </div>
);

// 愿望页骨架屏
export const WishesViewSkeleton = () => (
  <div className="flex-1 bg-ios-secondary-background px-4 py-4 overflow-y-auto">
    {/* 按钮骨架 */}
    <div className="flex justify-end items-center mb-4">
      <Skeleton className="h-10 w-28 rounded-ios" />
    </div>

    {/* 愿望卡片骨架 */}
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="p-6 bg-white border-0 shadow-ios rounded-ios">
          <div className="flex items-start space-x-4">
            <Skeleton className="w-12 h-12 rounded-ios flex-shrink-0" />
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-5 w-12 rounded-full" />
              </div>
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-4 w-3/4 mb-3" />
              <div className="flex justify-between items-center">
                <Skeleton className="h-3 w-24" />
                <div className="flex space-x-2">
                  <Skeleton className="h-8 w-20 rounded-ios" />
                  <Skeleton className="h-8 w-16 rounded-ios" />
                </div>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  </div>
);

// 练习页骨架屏
export const PracticeViewSkeleton = () => (
  <div className="flex-1 bg-ios-secondary-background overflow-y-auto">
    <div className="p-4 space-y-4">
      {/* 按钮骨架 */}
      <div className="flex justify-end items-center">
        <div className="flex space-x-2">
          <Skeleton className="h-9 w-24 rounded-md" />
          <Skeleton className="h-9 w-20 rounded-md" />
        </div>
      </div>

      {/* 游戏化状态骨架 */}
      <div className="grid grid-cols-1 gap-4">
        <div className="grid grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <Card key={i} className="p-4 bg-white border-0 shadow-ios rounded-ios">
              <div className="flex items-center space-x-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div>
                  <Skeleton className="h-5 w-16 mb-1" />
                  <Skeleton className="h-3 w-12" />
                </div>
              </div>
            </Card>
          ))}
        </div>
        
        {/* 等级进度骨架 */}
        <Card className="p-4 bg-white border-0 shadow-ios rounded-ios">
          <div className="flex justify-between items-center mb-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-16" />
          </div>
          <Skeleton className="h-2 w-full" />
        </Card>
      </div>

      {/* 统计卡片骨架 */}
      <Card className="p-4 bg-white border-0 shadow-ios rounded-ios">
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="text-center">
              <Skeleton className="h-8 w-12 mx-auto mb-1" />
              <Skeleton className="h-3 w-16 mx-auto" />
            </div>
          ))}
        </div>
      </Card>

      {/* 愿望选择器骨架 */}
      <Card className="p-4 bg-white border-0 shadow-ios rounded-ios">
        <Skeleton className="h-5 w-24 mb-3" />
        <Skeleton className="h-12 w-full rounded-ios" />
      </Card>

      {/* 练习卡片骨架 */}
      <Skeleton className="h-6 w-32 mb-4" />
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-4 bg-white border-0 shadow-ios rounded-ios">
            <div className="flex items-center space-x-4">
              <Skeleton className="w-12 h-12 rounded-ios flex-shrink-0" />
              <div className="flex-1">
                <Skeleton className="h-5 w-24 mb-1" />
                <Skeleton className="h-3 w-32 mb-2" />
                <Skeleton className="h-2 w-full" />
              </div>
              <Skeleton className="h-8 w-16 rounded-ios" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  </div>
);

// 进度页骨架屏
export const ProgressViewSkeleton = () => (
  <div className="flex-1 bg-ios-secondary-background px-4 py-4 overflow-y-auto">
    {/* 今日进度圆形卡片骨架 */}
    <Card className="p-6 bg-white border-0 shadow-ios rounded-ios mb-4">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <Skeleton className="h-5 w-24 mb-2" />
          <div className="flex items-baseline gap-2 mb-3">
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-4 w-12" />
          </div>
          <div className="flex items-center gap-4">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-12" />
          </div>
        </div>
        <Skeleton className="w-20 h-20 rounded-full" />
      </div>
    </Card>

    {/* 横向统计卡片骨架 */}
    <div className="flex gap-3 overflow-x-auto pb-2 mb-4">
      {[1, 2, 3, 4].map((i) => (
        <Card key={i} className="flex-shrink-0 w-32 p-3 bg-white border-0 shadow-ios rounded-ios">
          <div className="flex flex-col items-center text-center">
            <Skeleton className="w-10 h-10 rounded-full mb-2" />
            <Skeleton className="h-6 w-12 mb-1" />
            <Skeleton className="h-3 w-16" />
          </div>
        </Card>
      ))}
    </div>

    {/* 统计卡片骨架 */}
    {[1, 2].map((i) => (
      <Card key={i} className="p-4 bg-white border-0 shadow-ios rounded-ios mb-4">
        <div className="flex items-center justify-between mb-3">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-4 w-16" />
        </div>
        <Skeleton className="h-2 w-full mb-3" />
        <div className="grid grid-cols-3 gap-4 pt-2 border-t border-gray-100">
          {[1, 2, 3].map((j) => (
            <div key={j} className="text-center">
              <Skeleton className="h-5 w-12 mx-auto mb-1" />
              <Skeleton className="h-3 w-16 mx-auto" />
            </div>
          ))}
        </div>
      </Card>
    ))}

    {/* 成就徽章骨架 */}
    <Card className="p-4 bg-white border-0 shadow-ios rounded-ios">
      <Skeleton className="h-5 w-24 mb-3" />
      <div className="grid grid-cols-4 gap-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="text-center">
            <Skeleton className="w-12 h-12 rounded-full mx-auto mb-1.5" />
            <Skeleton className="h-3 w-14 mx-auto" />
          </div>
        ))}
      </div>
    </Card>
  </div>
);

// 社区页骨架屏
export const CommunityViewSkeleton = () => (
  <div className="flex-1 bg-ios-secondary-background px-4 py-4 overflow-y-auto">
    {/* 发布按钮骨架 */}
    <div className="flex justify-end items-center mb-4">
      <Skeleton className="h-10 w-24 rounded-ios" />
    </div>

    {/* 统计卡片骨架 */}
    <div className="grid grid-cols-2 gap-4 mb-6">
      {[1, 2].map((i) => (
        <Card key={i} className="p-4 bg-white border-0 shadow-ios rounded-ios">
          <div className="flex items-center space-x-3">
            <Skeleton className="w-12 h-12 rounded-ios" />
            <div>
              <Skeleton className="h-6 w-16 mb-1" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
        </Card>
      ))}
    </div>

    {/* 热门话题骨架 */}
    <Card className="mb-6 p-6 bg-white border-0 shadow-ios rounded-ios">
      <Skeleton className="h-5 w-24 mb-4" />
      <div className="grid grid-cols-2 gap-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-ios">
            <Skeleton className="w-8 h-8 rounded-ios" />
            <Skeleton className="h-4 w-16" />
          </div>
        ))}
      </div>
    </Card>

    {/* 帖子列表骨架 */}
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="p-6 bg-white border-0 shadow-ios rounded-ios">
          {/* 作者信息骨架 */}
          <div className="flex items-center space-x-3 mb-4">
            <Skeleton className="w-10 h-10 rounded-full" />
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-16 rounded-full" />
              </div>
              <Skeleton className="h-3 w-12" />
            </div>
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>

          {/* 内容骨架 */}
          <div className="space-y-2 mb-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>

          {/* 操作按钮骨架 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <Skeleton className="h-5 w-12" />
              <Skeleton className="h-5 w-12" />
            </div>
            <Skeleton className="h-5 w-5" />
          </div>
        </Card>
      ))}
    </div>
  </div>
);
