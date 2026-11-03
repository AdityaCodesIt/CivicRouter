import React from 'react';
import { Skeleton } from './Skeleton';

export const PageLoadingFallback: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 md:px-8 py-10 space-y-6 animate-in fade-in duration-200">
      <div className="flex items-center gap-3">
        <Skeleton className="w-10 h-10 rounded-2xl" />
        <div className="space-y-2 flex-1 max-w-sm">
          <Skeleton className="h-6 w-3/4 rounded-lg" />
          <Skeleton className="h-4 w-1/2 rounded-lg" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
        <Skeleton className="h-32 rounded-2xl" />
        <Skeleton className="h-32 rounded-2xl" />
        <Skeleton className="h-32 rounded-2xl" />
      </div>

      <div className="pt-4 space-y-3">
        <Skeleton className="h-20 rounded-2xl w-full" />
        <Skeleton className="h-20 rounded-2xl w-full" />
        <Skeleton className="h-20 rounded-2xl w-full" />
      </div>
    </div>
  );
};
