import React from 'react';
import { Button } from './Button';
import {
  EmptyClipboardIllustration,
  EmptyScooterIllustration,
  OfflineModeIllustration,
} from './TransitIllustrations';

export type EmptyStateIllustrationType = 'clipboard' | 'scooter' | 'offline' | 'custom';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  icon?: React.ReactNode;
  illustrationType?: EmptyStateIllustrationType;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
  icon,
  illustrationType = 'clipboard',
  className = '',
}) => {
  const renderVisual = () => {
    if (icon) {
      return (
        <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-2xl border border-[#E6DECF] dark:border-[#2B3833] bg-[#FBEBC6]/60 text-[#1F2A27] shadow-warm-sm">
          {icon}
        </div>
      );
    }

    switch (illustrationType) {
      case 'scooter':
        return <EmptyScooterIllustration className="mx-auto mb-3" size={130} />;
      case 'offline':
        return <OfflineModeIllustration className="mx-auto mb-3" size={130} />;
      case 'clipboard':
      default:
        return <EmptyClipboardIllustration className="mx-auto mb-3" size={130} />;
    }
  };

  return (
    <div
      role="region"
      aria-label={title}
      className={`p-8 sm:p-10 my-6 text-center border border-dashed border-[#D3C8B4] dark:border-[#384A43] rounded-2xl bg-[#FFFDF9] dark:bg-[#1C2421] shadow-warm max-w-xl mx-auto ${className}`}
    >
      {renderVisual()}

      <h3 className="font-display font-bold text-xl text-[#1F2A27] dark:text-[#FAF6EF] mb-2 tracking-tight">
        {title}
      </h3>
      <p className="font-body text-sm text-[#55625D] dark:text-[#95A39D] max-w-md mx-auto mb-6 leading-relaxed">
        {description}
      </p>

      {(actionLabel || secondaryActionLabel) && (
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          {actionLabel && onAction && (
            <Button
              variant="primary"
              size="md"
              onClick={onAction}
            >
              {actionLabel}
            </Button>
          )}

          {secondaryActionLabel && onSecondaryAction && (
            <Button
              variant="secondary"
              size="md"
              onClick={onSecondaryAction}
            >
              {secondaryActionLabel}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
