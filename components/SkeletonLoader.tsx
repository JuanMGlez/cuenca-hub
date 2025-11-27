'use client';

import clsx from 'clsx';

interface SkeletonLoaderProps {
  className?: string;
  variant?: 'card' | 'chart' | 'kpi' | 'text';
}

export default function SkeletonLoader({ className, variant = 'card' }: SkeletonLoaderProps) {
  const baseClasses = "animate-pulse bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%] rounded-xl";
  
  const variants = {
    card: "h-32 w-full",
    chart: "h-64 w-full",
    kpi: "h-20 w-full",
    text: "h-4 w-3/4"
  };

  return (
    <div className={clsx(baseClasses, variants[variant], className)}>
      <div className="h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-white/60 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <SkeletonLoader className="w-12 h-12 rounded-xl" />
            <div className="space-y-2">
              <SkeletonLoader variant="text" className="w-48" />
              <SkeletonLoader variant="text" className="w-32" />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <SkeletonLoader className="w-32 h-10" />
            <SkeletonLoader className="w-24 h-10" />
          </div>
        </div>
      </div>

      {/* KPIs Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white/60 backdrop-blur-sm rounded-2xl border border-white/60 p-6">
            <div className="flex items-center justify-between mb-4">
              <SkeletonLoader variant="text" className="w-24" />
              <SkeletonLoader className="w-5 h-5" />
            </div>
            <SkeletonLoader variant="kpi" />
          </div>
        ))}
      </div>

      {/* Charts Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="bg-white/60 backdrop-blur-sm rounded-2xl border border-white/60 p-6">
            <div className="flex items-center justify-between mb-6">
              <SkeletonLoader variant="text" className="w-32" />
              <SkeletonLoader className="w-5 h-5" />
            </div>
            <SkeletonLoader variant="chart" />
          </div>
        ))}
      </div>
    </div>
  );
}