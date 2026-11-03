import React, { useState, useRef } from 'react';
import { DeliveryStop } from '../../data/mockStops';
import { PriorityBadge } from './PriorityBadge';
import {
  Phone,
  CheckCircle2,
  Navigation,
  AlertCircle,
  GripVertical,
  Trash2,
  Edit3,
  ArrowUpRight,
  ArrowDownRight,
  IndianRupee,
  Link as LinkIcon,
  Clock,
  Package,
} from 'lucide-react';

interface StopCardProps {
  stop: DeliveryStop;
  isCurrent?: boolean;
  draggable?: boolean;
  dragIndex?: number;
  onDragStart?: (e: React.DragEvent<HTMLDivElement>, index: number) => void;
  onDragOver?: (e: React.DragEvent<HTMLDivElement>, index: number) => void;
  onDragEnd?: (e: React.DragEvent<HTMLDivElement>) => void;
  onComplete?: (id: string) => void;
  onSkip?: (id: string) => void;
  onNavigate?: (stop: DeliveryStop) => void;
  onSelect?: (stop: DeliveryStop) => void;
  onEdit?: (stop: DeliveryStop) => void;
  onDelete?: (id: string) => void;
  onMoveUp?: (index: number) => void;
  onMoveDown?: (index: number) => void;
  isFirst?: boolean;
  isLast?: boolean;
}

export const StopCard: React.FC<StopCardProps> = ({
  stop,
  isCurrent = false,
  draggable = false,
  dragIndex = 0,
  onDragStart,
  onDragOver,
  onDragEnd,
  onComplete,
  onSkip,
  onNavigate,
  onSelect,
  onEdit,
  onDelete,
  onMoveUp,
  onMoveDown,
  isFirst = false,
  isLast = false,
}) => {
  const isCompleted = stop.status === 'completed';
  const isSkipped = stop.status === 'skipped';
  const isPickup = stop.type === 'pickup';

  const paddedOrder = String(stop.order).padStart(2, '0');

  // Swipe-to-delete touch state
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [swipeOffset, setSwipeOffset] = useState<number>(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
    setIsSwiping(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const currentX = e.touches[0].clientX;
    const diff = currentX - touchStartX;
    if (diff < 0 && diff > -120) {
      setSwipeOffset(diff);
    }
  };

  const handleTouchEnd = () => {
    if (swipeOffset < -80 && onDelete) {
      setSwipeOffset(-300);
      setTimeout(() => {
        onDelete(stop.id);
      }, 150);
    } else {
      setSwipeOffset(0);
    }
    setTouchStartX(null);
    setIsSwiping(false);
  };

  return (
    <div className="relative overflow-hidden rounded-2xl group">
      {/* Background delete reveal action for swipe-to-delete */}
      <div className="absolute inset-0 bg-[#D9604C] rounded-2xl flex items-center justify-end px-6 text-white font-mono font-medium text-xs gap-2">
        <Trash2 className="w-5 h-5" />
        <span>Swipe to remove</span>
      </div>

      {/* Front ticket card */}
      <div
        ref={cardRef}
        draggable={draggable}
        onDragStart={(e) => onDragStart?.(e, dragIndex)}
        onDragOver={(e) => onDragOver?.(e, dragIndex)}
        onDragEnd={onDragEnd}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          transform: `translateX(${swipeOffset}px)`,
          transition: isSwiping ? 'none' : 'transform 0.25s cubic-bezier(0.22, 1, 0.36, 1)',
        }}
        onClick={() => onSelect?.(stop)}
        className={`ticket-stub relative p-4.5 rounded-2xl transition-all duration-200 select-none ${
          isCurrent
            ? 'ring-2 ring-[#F2B84B] ring-offset-2 ring-offset-[#FAF6EF] shadow-warm-md bg-[#FFFDF9] dark:bg-[#1C2421]'
            : isCompleted
            ? 'opacity-70 bg-[#F2ECE1]/60 dark:bg-[#101514] shadow-warm-sm'
            : 'bg-[#FFFDF9] dark:bg-[#1C2421] shadow-warm hover:shadow-warm-md hover:-translate-y-0.5'
        }`}
      >
        {/* Top Bar: Reorder Handle + Big Mono Stop Number + Type Badge + Priority */}
        <div className="flex items-center justify-between border-b border-dashed border-[#E6DECF] dark:border-[#2B3833] pb-3 mb-3">
          <div className="flex items-center gap-3">
            {/* Drag Handle on Desktop */}
            {draggable && (
              <div
                className="cursor-grab active:cursor-grabbing p-1 text-[#8A948F] hover:text-[#1F2A27] dark:hover:text-[#FAF6EF] transition-colors touch-none"
                title="Drag to reorder"
              >
                <GripVertical className="w-4 h-4 stroke-[1.75]" />
              </div>
            )}

            {/* Soft Circular Stop Number */}
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full font-mono font-semibold text-sm shadow-warm-sm transition-colors ${
                isCurrent
                  ? 'bg-[#F2B84B] text-[#1F2A27]'
                  : isCompleted
                  ? 'bg-[#3F8F66] text-white'
                  : 'bg-[#F2ECE1] dark:bg-[#25302C] text-[#1F2A27] dark:text-[#FAF6EF] border border-[#E6DECF] dark:border-[#384A43]'
              }`}
            >
              {paddedOrder}
            </div>

            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                {/* Pickup vs Drop Type Badge */}
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-medium flex items-center gap-1 ${
                    isPickup
                      ? 'bg-[#FBEBC6] text-[#E0A11B] border border-[#E0A11B]/30'
                      : 'bg-[#E3EEE6] text-[#4F7A66] border border-[#4F7A66]/30'
                  }`}
                >
                  {isPickup ? (
                    <>
                      <ArrowUpRight className="w-3 h-3 stroke-[2.5]" />
                      <span>PICKUP</span>
                    </>
                  ) : (
                    <>
                      <ArrowDownRight className="w-3 h-3 stroke-[2.5]" />
                      <span>DROP</span>
                    </>
                  )}
                </span>

                {/* Current / Next Tag */}
                {isCurrent && (
                  <span className="bg-[#F2B84B] text-[#1F2A27] px-2 py-0.5 text-[10px] font-mono font-bold rounded-full shadow-warm-sm">
                    NEXT STOP
                  </span>
                )}

                {/* Paired Stop Indicator */}
                {stop.pairedStopId && (
                  <span className="bg-[#A8C5DA]/30 text-[#385566] dark:text-[#A8C5DA] px-2 py-0.5 text-[10px] font-mono font-medium rounded-full flex items-center gap-1">
                    <LinkIcon className="w-2.5 h-2.5" />
                    <span>PAIRED</span>
                  </span>
                )}
              </div>

              <h3 className="font-display font-bold text-base text-[#1F2A27] dark:text-[#FAF6EF] leading-snug mt-1">
                {stop.recipientName}
              </h3>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1 shrink-0">
            <PriorityBadge priority={stop.priority} size="sm" />
            {stop.deadline && (
              <span className="inline-flex items-center gap-1 font-mono text-[11px] font-medium text-[#D9604C]">
                <Clock className="w-3 h-3" />
                <span>by {stop.deadline}</span>
              </span>
            )}
          </div>
        </div>

        {/* Main Delivery Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm mb-3">
          <div>
            <p className="font-medium text-[#1F2A27] dark:text-[#FAF6EF] leading-snug text-xs sm:text-sm">
              {stop.address}
            </p>
            <div className="mt-1 flex items-center gap-1.5 text-xs text-[#55625D] dark:text-[#95A39D]">
              <span className="font-semibold text-[#1F2A27] dark:text-[#FAF6EF]">{stop.area}</span>
              <span>·</span>
              <span className="truncate max-w-[200px]">{stop.landmark}</span>
            </div>
          </div>

          {/* Metrics in Mono: ETA, Parcels & COD Amount */}
          <div className="flex items-center justify-between md:justify-end gap-2.5 font-mono text-xs border-t md:border-t-0 border-[#E6DECF]/60 dark:border-[#2B3833] pt-2 md:pt-0">
            {stop.codAmount && stop.codAmount > 0 ? (
              <div className="text-left md:text-right px-2.5 py-1 bg-[#FBEBC6]/60 dark:bg-[#2A2416] border border-[#E0A11B]/30 rounded-lg">
                <div className="text-[9px] text-[#55625D] dark:text-[#95A39D] uppercase font-bold">CASH ON DELIVERY</div>
                <div className="font-bold text-[#1F2A27] dark:text-[#FAF6EF] text-xs flex items-center gap-0.5">
                  <IndianRupee className="w-3 h-3 text-[#E0A11B]" />
                  <span>{stop.codAmount.toLocaleString('en-IN')}</span>
                </div>
              </div>
            ) : null}

            <div className="text-right flex items-center gap-1 px-2.5 py-1 bg-[#F2ECE1]/60 dark:bg-[#1E2724] border border-[#E6DECF] dark:border-[#2B3833] rounded-lg">
              <Package className="w-3.5 h-3.5 text-[#55625D]" />
              <span className="font-bold text-[#1F2A27] dark:text-[#FAF6EF] text-xs tabular-nums">
                {stop.parcelCount} PKG
              </span>
            </div>
          </div>
        </div>

        {/* Delivery Note */}
        {stop.notes && (
          <div className="mb-3 px-3 py-2 bg-[#F2ECE1]/50 dark:bg-[#18221E] border border-[#E6DECF] dark:border-[#2B3833] rounded-xl text-xs text-[#55625D] dark:text-[#95A39D] flex items-start gap-2">
            <AlertCircle className="w-3.5 h-3.5 text-[#E0A11B] shrink-0 mt-0.5" />
            <span className="leading-relaxed">{stop.notes}</span>
          </div>
        )}

        {/* Bottom Actions Row (>= 44px min hitboxes) */}
        <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#E6DECF] dark:border-[#2B3833]">
          <div className="flex items-center gap-2">
            {stop.phone && (
              <a
                href={`tel:${stop.phone.replace(/\s+/g, '')}`}
                onClick={(e) => e.stopPropagation()}
                className="min-h-[44px] px-3.5 py-2 flex items-center gap-1.5 rounded-full border border-[#E6DECF] dark:border-[#2B3833] bg-[#FFFDF9] dark:bg-[#1C2421] text-[#1F2A27] dark:text-[#FAF6EF] text-xs font-mono font-medium hover:bg-[#F2ECE1] dark:hover:bg-[#25302C] transition-colors"
                title={`Call ${stop.recipientName}`}
              >
                <Phone className="w-3.5 h-3.5 text-[#3F8F66]" />
                <span className="hidden sm:inline">{stop.phone}</span>
                <span className="sm:hidden">Call</span>
              </a>
            )}

            {onEdit && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(stop);
                }}
                className="min-h-[44px] px-3 py-2 flex items-center gap-1 rounded-full border border-[#E6DECF] dark:border-[#2B3833] bg-[#FFFDF9] dark:bg-[#1C2421] hover:bg-[#F2ECE1] dark:hover:bg-[#25302C] text-[#1F2A27] dark:text-[#FAF6EF] text-xs font-mono font-medium transition-colors cursor-pointer"
                title="Edit stop"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
            )}

            {onDelete && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(stop.id);
                }}
                className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full border border-[#E6DECF] dark:border-[#2B3833] bg-[#FFFDF9] dark:bg-[#1C2421] hover:bg-[#FBE1DB] hover:text-[#D9604C] text-[#8A948F] transition-colors cursor-pointer"
                title="Remove stop"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            {onMoveUp && !isFirst && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onMoveUp(dragIndex);
                }}
                className="w-8 h-8 flex items-center justify-center rounded-full border border-[#E6DECF] dark:border-[#2B3833] bg-[#FAF6EF] dark:bg-[#141A18] hover:bg-[#F2ECE1] text-xs font-mono font-semibold"
                title="Move up"
              >
                ↑
              </button>
            )}
            {onMoveDown && !isLast && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onMoveDown(dragIndex);
                }}
                className="w-8 h-8 flex items-center justify-center rounded-full border border-[#E6DECF] dark:border-[#2B3833] bg-[#FAF6EF] dark:bg-[#141A18] hover:bg-[#F2ECE1] text-xs font-mono font-semibold"
                title="Move down"
              >
                ↓
              </button>
            )}

            {onNavigate && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigate(stop);
                }}
                className="min-h-[44px] px-3.5 py-2 flex items-center gap-1.5 rounded-full bg-[#1F2A27] text-[#FAF6EF] text-xs font-mono font-semibold hover:bg-[#2C3B37] shadow-warm-sm transition-colors"
              >
                <Navigation className="w-3.5 h-3.5 text-[#F2B84B]" />
                <span>Nav</span>
              </button>
            )}

            {isCompleted ? (
              <span className="min-h-[44px] px-3.5 py-2 flex items-center gap-1.5 rounded-full bg-[#E4F3EB] dark:bg-[#1B3327] text-[#3F8F66] text-xs font-mono font-semibold border border-[#3F8F66]/30">
                <CheckCircle2 className="w-4 h-4" />
                <span>Delivered</span>
              </span>
            ) : (
              onComplete && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onComplete(stop.id);
                  }}
                  className="min-h-[44px] px-4 py-2 flex items-center gap-1.5 rounded-full bg-[#F2B84B] hover:bg-[#E9A92F] text-[#1F2A27] text-xs font-display font-bold shadow-warm-sm active:scale-95 transition-all"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Done</span>
                </button>
              )
            )}
          </div>
        </div>

        {/* Soft Delivered / Skipped Watermark Stamp */}
        {isCompleted && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none rotate-[-8deg] border-2 border-[#3F8F66]/40 text-[#3F8F66] px-3 py-1 rounded-lg font-display font-extrabold text-sm tracking-wider opacity-60 uppercase">
            Delivered
          </div>
        )}
        {isSkipped && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none rotate-[-8deg] border-2 border-[#D9604C]/40 text-[#D9604C] px-3 py-1 rounded-lg font-display font-extrabold text-sm tracking-wider opacity-60 uppercase">
            Skipped
          </div>
        )}
      </div>
    </div>
  );
};
