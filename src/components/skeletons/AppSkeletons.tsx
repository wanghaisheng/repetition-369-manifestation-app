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
  <div className="flex-1 bg-secondary/30 px-4 py-5 overflow-y-auto">
    {/* Header skeleton */}
    <div className="flex justify-end items-center mb-5">
      <Skeleton className="h-10 w-28 rounded-xl" />
    </div>

    {/* Wish cards skeleton */}
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="relative overflow-hidden bg-card border-0 shadow-md rounded-2xl">
          {/* Gradient accent bar */}
          <Skeleton className="absolute top-0 left-0 right-0 h-1" />
          
          <div className="p-5">
            <div className="flex items-start gap-4">
              {/* Category icon skeleton */}
              <Skeleton className="w-14 h-14 rounded-2xl shrink-0" />
              
              {/* Content skeleton */}
              <div className="flex-1 min-w-0">
                {/* Title & badge */}
                <div className="flex items-center gap-2 mb-2">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-5 w-14 rounded-full" />
                </div>
                
                {/* Affirmation */}
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-3/4 mb-4" />
                
                {/* Footer */}
                <div className="flex items-center justify-between">
                  <Skeleton className="h-3 w-20" />
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-8 w-24 rounded-xl" />
                    <Skeleton className="h-8 w-16 rounded-xl" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  </div>
);

// Practice View Skeleton - Apple Mindfulness inspired
export const PracticeViewSkeleton = () => (
  <div className="flex-1 bg-background overflow-y-auto">
    <div className="p-4 space-y-4">
      {/* Header actions skeleton */}
      <div className="flex justify-end items-center gap-2">
        <Skeleton className="h-9 w-20 rounded-xl" />
        <Skeleton className="h-9 w-20 rounded-xl" />
      </div>

      {/* Hero Card Skeleton */}
      <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-primary/30 via-accent/30 to-primary/20 p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-2">
              <Skeleton className="w-5 h-5 rounded" />
              <Skeleton className="h-5 w-24" />
            </div>
            <div className="space-y-3">
              <div className="flex items-baseline gap-3">
                <Skeleton className="h-10 w-16" />
                <Skeleton className="h-5 w-10" />
              </div>
              <div className="flex items-center gap-4">
                <Skeleton className="h-6 w-24 rounded-full" />
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
            </div>
          </div>
          <Skeleton className="w-[100px] h-[100px] rounded-full" />
        </div>
      </Card>

      {/* Quick Stats Skeleton */}
      <div className="grid grid-cols-2 gap-3">
        {[1, 2].map((i) => (
          <Card key={i} className="p-3 border-0 shadow-md">
            <div className="flex items-center gap-3">
              <Skeleton className="w-8 h-8 rounded-xl" />
              <div>
                <Skeleton className="h-5 w-14 mb-1" />
                <Skeleton className="h-3 w-10" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Wish Selector Skeleton */}
      <Card className="p-4 border-0 shadow-md">
        <Skeleton className="h-5 w-24 mb-3" />
        <Skeleton className="h-12 w-full rounded-xl" />
      </Card>

      {/* Time Slot Cards Skeleton */}
      <div className="space-y-3">
        <Skeleton className="h-4 w-28" />
        {[1, 2, 3].map((i) => (
          <Card key={i} className="border-0 shadow-lg p-4">
            <div className="flex items-start gap-4">
              <Skeleton className="w-14 h-14 rounded-2xl flex-shrink-0" />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-5 w-16 rounded-full" />
                </div>
                <Skeleton className="h-4 w-full mb-2" />
                <div className="flex items-center gap-2 mb-3">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-3 w-16" />
                </div>
                <Skeleton className="h-2 w-full mb-1" />
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <Skeleton className="h-9 w-28 rounded-xl" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  </div>
);

// Progress View Skeleton - Matching new modular component structure
export const ProgressViewSkeleton = () => (
  <div className="flex-1 bg-background px-4 py-4 overflow-y-auto space-y-4">
    {/* Hero Progress Card Skeleton */}
    <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-primary/30 via-accent/30 to-primary/20 p-6 shadow-xl">
      <div className="flex items-center justify-between">
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-2">
            <Skeleton className="w-5 h-5 rounded" />
            <Skeleton className="h-5 w-24" />
          </div>
          <div className="flex items-baseline gap-3">
            <Skeleton className="h-10 w-20" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
          <div className="flex items-center gap-5">
            <Skeleton className="h-4 w-14" />
            <Skeleton className="h-4 w-14" />
          </div>
        </div>
        <Skeleton className="w-[88px] h-[88px] rounded-full" />
      </div>
    </Card>

    {/* Stats Carousel Skeleton */}
    <div className="flex gap-3 overflow-x-auto pb-1 -mx-4 px-4">
      {[1, 2, 3, 4].map((i) => (
        <Card key={i} className="flex-shrink-0 w-[100px] min-w-[100px] p-3 border-0 shadow-md">
          <div className="flex flex-col items-center text-center space-y-2">
            <Skeleton className="w-8 h-8 rounded-xl" />
            <Skeleton className="h-5 w-8" />
            <Skeleton className="h-3 w-12" />
          </div>
        </Card>
      ))}
    </div>

    {/* Weekly Progress Card Skeleton */}
    <Card className="border-0 shadow-lg">
      <div className="p-4 border-b border-border/50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Skeleton className="w-8 h-8 rounded-xl" />
            <Skeleton className="h-5 w-20" />
          </div>
          <Skeleton className="h-4 w-10" />
        </div>
        <Skeleton className="h-2.5 w-full mb-4" />
        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="text-center p-2">
              <Skeleton className="h-5 w-8 mx-auto mb-1" />
              <Skeleton className="h-3 w-10 mx-auto" />
            </div>
          ))}
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Skeleton className="w-8 h-8 rounded-xl" />
            <Skeleton className="h-5 w-20" />
          </div>
          <Skeleton className="h-3 w-12" />
        </div>
        <Skeleton className="h-2 w-full" />
      </div>
    </Card>

    {/* Wish Completion Card Skeleton */}
    <Card className="border-0 shadow-lg bg-gradient-to-br from-amber-50/50 to-orange-50/50 dark:from-amber-950/10 dark:to-orange-950/10">
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Skeleton className="w-8 h-8 rounded-xl" />
            <Skeleton className="h-5 w-24" />
          </div>
          <Skeleton className="h-3 w-10" />
        </div>
        <Skeleton className="h-2 w-full mb-3" />
        <div className="flex justify-between pt-2 border-t border-border/30">
          <div className="flex-1 text-center">
            <Skeleton className="h-5 w-6 mx-auto mb-1" />
            <Skeleton className="h-3 w-10 mx-auto" />
          </div>
          <div className="flex-1 text-center">
            <Skeleton className="h-5 w-6 mx-auto mb-1" />
            <Skeleton className="h-3 w-10 mx-auto" />
          </div>
        </div>
      </div>
    </Card>

    {/* Monthly Trend Chart Skeleton */}
    <Card className="border-0 shadow-lg">
      <div className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <Skeleton className="w-8 h-8 rounded-xl" />
          <Skeleton className="h-5 w-20" />
        </div>
        <Skeleton className="h-[140px] w-full rounded-lg" />
      </div>
    </Card>

    {/* Achievements Grid Skeleton */}
    <Card className="border-0 shadow-lg">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Skeleton className="w-8 h-8 rounded-xl" />
            <Skeleton className="h-5 w-20" />
          </div>
          <Skeleton className="h-5 w-10 rounded-full" />
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="text-center">
              <Skeleton className="w-14 h-14 rounded-2xl mx-auto mb-2" />
              <Skeleton className="h-3 w-12 mx-auto" />
            </div>
          ))}
        </div>
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
