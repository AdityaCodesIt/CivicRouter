import React, { useEffect, useState } from 'react';
import { RotateCcw, X } from 'lucide-react';

interface UndoSnackbarProps {
  action: {
    type: 'completed' | 'skipped' | 'failed';
    stopId: string;
    stopName: string;
    prevIndex: number;
    failureReason?: string;
  } | null;
  onUndo: () => void;
  onDismiss: () => void;
}

export const UndoSnackbar: React.FC<UndoSnackbarProps> = ({
  action,
  onUndo,
  onDismiss,
}) => {
  const [timeLeft, setTimeLeft] = useState(6);

  useEffect(() => {
    if (!action) return;
    setTimeLeft(6);

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onDismiss();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [action, onDismiss]);

  if (!action) return null;

  const actionText =
    action.type === 'completed'
      ? 'Marked as Delivered'
      : action.type === 'failed'
      ? `Undelivered (${action.failureReason || 'Skipped'})`
      : 'Skipped';

  return (
    <div className="fixed bottom-[calc(9rem+env(safe-area-inset-bottom,0px))] sm:bottom-28 left-4 right-4 max-w-md mx-auto z-50 animate-in fade-in slide-in-from-bottom-2 duration-150">
      <div className="bg-[#1F2A27] text-[#FAF6EF] dark:bg-[#101514] border border-white/10 dark:border-[#2B3833] rounded-2xl shadow-xl p-3 flex items-center justify-between gap-3">
        <div className="min-w-0 flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-marigold)] shrink-0 animate-pulse" />
          <div className="truncate text-xs font-body">
            <span className="font-semibold text-[var(--color-marigold)]">{action.stopName}:</span>{' '}
            <span className="text-white/85">{actionText}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onUndo}
            className="h-8 px-3 bg-[var(--color-marigold)] hover:bg-[var(--color-marigold-hover)] text-[#1F2A27] rounded-full font-mono text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm transition-all active:scale-95"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Undo ({timeLeft}s)</span>
          </button>

          <button
            type="button"
            onClick={onDismiss}
            className="w-7 h-7 rounded-full flex items-center justify-center text-white/60 hover:text-white transition-colors"
            title="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};