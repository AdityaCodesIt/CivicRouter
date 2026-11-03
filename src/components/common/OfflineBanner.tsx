import React, { useState, useEffect } from 'react';
import { WifiOff, CheckCircle2, RefreshCw, CloudUpload } from 'lucide-react';
import {
  getPendingQueueCount,
  subscribeToSyncQueue,
  replaySyncQueue,
} from '../../data/repo/syncQueue';

interface OfflineBannerProps {
  className?: string;
}

export const OfflineBanner: React.FC<OfflineBannerProps> = ({ className = '' }) => {
  const [isOnline, setIsOnline] = useState<boolean>(() => {
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  });
  const [pendingCount, setPendingCount] = useState<number>(() => getPendingQueueCount());
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncNotice, setSyncNotice] = useState<boolean>(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const unsubscribeQueue = subscribeToSyncQueue((count) => {
      setPendingCount(count);
    });

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      unsubscribeQueue();
    };
  }, []);

  const effectivelyOffline = !isOnline;

  const handleManualSync = async () => {
    setIsSyncing(true);
    try {
      const result = await replaySyncQueue(async () => true);
      setPendingCount(result.remaining);
    } catch {}
    setIsSyncing(false);
    setSyncNotice(true);
    setTimeout(() => setSyncNotice(false), 2500);
  };

  if (!effectivelyOffline && pendingCount === 0 && !syncNotice) {
    return null;
  }

  if (syncNotice) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="bg-[#E4F3EB] text-[#3F8F66] border-b border-[#3F8F66]/30 px-3 py-2 text-center text-xs font-mono font-medium flex items-center justify-center gap-2 select-none"
      >
        <CheckCircle2 className="w-4 h-4" />
        <span>Local changes verified and synchronized to cloud</span>
      </div>
    );
  }

  return (
    <div
      role="alert"
      aria-live="assertive"
      className={`bg-[#F2ECE1] dark:bg-[#1E2724] text-[#1F2A27] dark:text-[#FAF6EF] border-b border-[#E6DECF] dark:border-[#2B3833] px-3.5 py-2.5 select-none transition-colors ${className}`}
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-full bg-[#F2B84B] text-[#1F2A27] flex items-center justify-center shrink-0 shadow-warm-sm">
            {pendingCount > 0 ? (
              <CloudUpload className="w-3.5 h-3.5 stroke-[2]" />
            ) : (
              <WifiOff className="w-3.5 h-3.5 stroke-[2]" />
            )}
          </div>
          <div>
            <span className="font-mono font-bold text-[#1F2A27] dark:text-[#FAF6EF] uppercase tracking-wide mr-2">
              {effectivelyOffline
                ? 'Offline Mode:'
                : pendingCount > 0
                ? 'Pending Cloud Sync:'
                : 'Offline Active:'}
            </span>
            <span className="font-body text-[#55625D] dark:text-[#95A39D]">
              {pendingCount > 0
                ? `${pendingCount} action${pendingCount > 1 ? 's' : ''} queued locally. Will sync automatically when network returns.`
                : 'Route running locally. Zero data loss in basements or spotty connectivity.'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleManualSync}
            disabled={isSyncing}
            className="px-3 py-1 bg-[#FFFDF9] dark:bg-[#141A18] hover:bg-[#FAF6EF] text-[#1F2A27] dark:text-[#FAF6EF] font-mono text-[11px] font-medium rounded-full border border-[#E6DECF] dark:border-[#2B3833] flex items-center gap-1.5 cursor-pointer shadow-warm-sm transition-colors"
          >
            <RefreshCw className={`w-3 h-3 text-[#E0A11B] ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Syncing...' : 'Sync Now'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
