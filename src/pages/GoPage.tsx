import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRoute } from '../context/RouteContext';
import { Button } from '../components/common/Button';
import { PriorityBadge } from '../components/common/PriorityBadge';
import { TransitLeafletMap } from '../components/route/TransitLeafletMap';
import { HorizontalProgressRail } from '../components/navigation/HorizontalProgressRail';
import { CantDeliverBottomSheet } from '../components/navigation/CantDeliverBottomSheet';
import { EndOfDayCelebration } from '../components/navigation/EndOfDayCelebration';
import { UndoSnackbar } from '../components/navigation/UndoSnackbar';
import { OnTheWayPromptBanner } from '../components/navigation/OnTheWayPromptBanner';
import { PitstopRadarRow } from '../components/navigation/PitstopRadarRow';
import {
  Phone,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Navigation,
  Utensils,
  Sun,
  Eye,
  IndianRupee,
  Clock,
  ChevronLeft,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';

export const GoPage: React.FC = () => {
  const {
    stops,
    activeStopIndex,
    setActiveStopIndex,
    markStopComplete,
    markStopFailed,
    undoLastAction,
    lastAction,
    wishlist,
    highContrast,
    toggleHighContrast,
    resetToMockData,
    stats,
  } = useRoute();

  const navigate = useNavigate();

  // State for modals and animations
  const [isCantDeliverOpen, setIsCantDeliverOpen] = useState(false);
  const [showUndo, setShowUndo] = useState(false);
  const [isSliding, setIsSliding] = useState(false);
  const [navModalOpen, setNavModalOpen] = useState(false);

  // Sync undo snackbar with lastAction from context
  useEffect(() => {
    if (lastAction) {
      setShowUndo(true);
    }
  }, [lastAction]);

  const currentStop = stops[activeStopIndex] || stops[0];
  const isAllDone = stops.length > 0 && stops.every((s) => s.status === 'completed' || s.status === 'skipped');
  const isPickup = currentStop?.type === 'pickup';

  // Check if any pitstop is near current stop
  const nearbyPitstop = wishlist.find((w) => w.nearStopId === currentStop?.id);

  const triggerHaptic = () => {
    if (typeof window !== 'undefined' && 'navigator' in window && navigator.vibrate) {
      try {
        navigator.vibrate([40, 30, 60]);
      } catch {
        // Ignore if restricted
      }
    }
  };

  const handleMarkDelivered = () => {
    if (!currentStop) return;
    triggerHaptic();

    setIsSliding(true);
    setTimeout(() => {
      markStopComplete(currentStop.id);
      setIsSliding(false);
    }, 180);
  };

  const handleConfirmCantDeliver = (reason: string) => {
    if (!currentStop) return;
    triggerHaptic();

    setIsSliding(true);
    setTimeout(() => {
      markStopFailed(currentStop.id, reason);
      setIsSliding(false);
    }, 180);
  };

  const handleUndo = () => {
    undoLastAction();
    setShowUndo(false);
  };

  const googleMapsUrl = currentStop
    ? `https://www.google.com/maps/dir/?api=1&destination=${currentStop.coordinates.lat},${currentStop.coordinates.lng}`
    : '#';

  if (isAllDone || !currentStop) {
    return (
      <div className="min-h-screen bg-[var(--color-bg)] py-8">
        <EndOfDayCelebration
          stops={stops}
          completedCount={stats.completedCount}
          totalKm={stats.totalKm}
          timeSavedMinutes={stats.timeSavedMinutes}
          totalCodAmount={stats.totalCodAmount}
          onReset={resetToMockData}
        />
        {showUndo && lastAction && (
          <UndoSnackbar
            action={lastAction}
            onUndo={handleUndo}
            onDismiss={() => setShowUndo(false)}
          />
        )}
      </div>
    );
  }

  const paddedOrder = String(currentStop.order).padStart(2, '0');

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-bg)] select-none">
      {/* 1. TOP HUD STRIP & PROGRESS TICKER RAIL */}
      <div className="bg-[var(--color-surface)] border-b border-[var(--color-border)] px-4 pt-3 pb-2.5 shrink-0 shadow-sm">
        <div className="max-w-4xl mx-auto">
          {/* Top Info Bar */}
          <div className="flex items-center justify-between mb-2">
            <button
              type="button"
              onClick={() => navigate('/route')}
              className="flex items-center gap-1 font-body text-xs font-semibold text-[var(--color-ink)] hover:text-[#8c5e03] cursor-pointer transition-colors"
            >
              <ChevronLeft className="w-4 h-4 text-[var(--color-marigold)]" />
              <span>Exit to Route Board</span>
            </button>

            <div className="flex items-center gap-2 font-mono text-xs font-semibold text-[var(--color-ink)]">
              <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-sage-deep)] animate-pulse" />
              <span>
                Stop {activeStopIndex + 1} of {stops.length}
              </span>
            </div>

            <button
              type="button"
              onClick={toggleHighContrast}
              title="Toggle High Contrast for Glaring Sun"
              className="w-8 h-8 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] hover:bg-[var(--color-bg-sunken)] flex items-center justify-center text-[var(--color-ink)] cursor-pointer transition-colors"
            >
              {highContrast ? <Eye className="w-4 h-4 text-[#8c5e03]" /> : <Sun className="w-4 h-4" />}
            </button>
          </div>

          {/* Thin Horizontal Progress Rail */}
          <HorizontalProgressRail
            stops={stops}
            activeIndex={activeStopIndex}
            onSelectIndex={(idx) => setActiveStopIndex(idx)}
          />
        </div>
      </div>

      {/* 2. LARGE "NEXT STOP" CARD AT TOP (BIKE HANDLEBAR OPTIMIZED) */}
      <div className="max-w-4xl mx-auto w-full px-4 pt-4">
        {/* On The Way Slide-In Banner */}
        <OnTheWayPromptBanner className="mb-3" />

        <div
          className={`soft-card p-5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl shadow-sm transition-all duration-200 ${
            isSliding ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'
          }`}
        >
          {/* Top Bar: Stop number token + Pickup/Drop badge + Priority badge + ETA */}
          <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-3 mb-3">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-[var(--color-marigold)] text-[var(--color-ink)] font-mono font-bold text-2xl flex items-center justify-center shadow-sm">
                {paddedOrder}
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-[10px] font-semibold text-[var(--color-ink-muted)] uppercase tracking-wide">
                    Target Stop
                  </span>

                  {/* Pickup vs Drop Indicator */}
                  <span
                    className={`px-2 py-0.5 rounded-full font-body font-semibold text-[10px] uppercase flex items-center gap-1 ${
                      isPickup
                        ? 'bg-[var(--color-marigold-tint)] text-[#8c5e03]'
                        : 'bg-[var(--color-sky-tint)] text-[var(--color-ink)]'
                    }`}
                  >
                    {isPickup ? (
                      <>
                        <ArrowUpRight className="w-3 h-3 stroke-[2.5]" />
                        <span>Pickup</span>
                      </>
                    ) : (
                      <>
                        <ArrowDownRight className="w-3 h-3 stroke-[2.5]" />
                        <span>Drop</span>
                      </>
                    )}
                  </span>
                </div>

                <h2 className="font-display font-bold text-xl sm:text-2xl text-[var(--color-ink)] leading-tight mt-0.5 truncate max-w-[220px] sm:max-w-md">
                  {currentStop.recipientName}
                </h2>
              </div>
            </div>

            {/* Priority & Distance/ETA */}
            <div className="flex flex-col items-end gap-1">
              <PriorityBadge priority={currentStop.priority} size="md" />
              <div className="font-mono font-bold text-sm sm:text-base text-[var(--color-ink)] tabular-nums mt-0.5">
                {currentStop.distanceKm} km · +{currentStop.etaMinutes}m
              </div>
            </div>
          </div>

          {/* Location & Landmark Clue */}
          <div className="p-3.5 bg-[var(--color-bg-sunken)] border border-[var(--color-border)] rounded-xl mb-3">
            <p className="font-body font-semibold text-sm sm:text-base text-[var(--color-ink)] leading-snug">
              {currentStop.address}
            </p>
            <div className="mt-1 flex items-center gap-2 text-xs font-body text-[var(--color-ink-secondary)]">
              <span className="font-semibold text-[#8c5e03]">Landmark:</span>
              <span className="truncate">{currentStop.landmark} ({currentStop.area})</span>
            </div>
          </div>

          {/* Optional COD / Notes Strip */}
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            {currentStop.codAmount && currentStop.codAmount > 0 ? (
              <div className="px-3 py-1 bg-[var(--color-marigold-tint)] border border-[var(--color-marigold)]/30 rounded-full font-mono text-xs font-semibold text-[#8c5e03] flex items-center gap-1">
                <span>Collect COD:</span>
                <IndianRupee className="w-3.5 h-3.5" />
                <span>{currentStop.codAmount}</span>
              </div>
            ) : (
              <span className="font-body text-xs font-semibold text-[var(--color-sage-deep)] bg-[var(--color-sage-tint)] px-3 py-1 rounded-full border border-[var(--color-sage)]/30">
                ✓ Prepaid / No Cash
              </span>
            )}

            {currentStop.deadline && (
              <div className="font-mono text-xs font-semibold text-[var(--color-priority-high)] flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>Deliver by {currentStop.deadline}</span>
              </div>
            )}
          </div>

          {/* Quick Action Buttons Row (56px touch hitboxes) */}
          <div className="grid grid-cols-3 gap-2">
            {/* 1. Call Button */}
            {currentStop.phone ? (
              <a
                href={`tel:${currentStop.phone.replace(/\s+/g, '')}`}
                className="min-h-[52px] px-2 flex items-center justify-center gap-1.5 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-ink)] hover:bg-[var(--color-bg-sunken)] active:scale-95 font-body font-semibold text-xs transition-all shadow-sm"
              >
                <Phone className="w-4 h-4 text-[var(--color-sage-deep)]" />
                <span>Call</span>
              </a>
            ) : (
              <button
                disabled
                className="min-h-[52px] px-2 flex items-center justify-center gap-1.5 rounded-full border border-[var(--color-border)]/50 bg-[var(--color-bg-sunken)] text-[var(--color-ink-muted)] font-body font-medium text-xs opacity-60"
              >
                <Phone className="w-4 h-4" />
                <span>No Tel</span>
              </button>
            )}

            {/* 2. Open in Google Maps */}
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-[52px] px-2 flex items-center justify-center gap-1.5 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-ink)] hover:bg-[var(--color-bg-sunken)] active:scale-95 font-body font-semibold text-xs transition-all shadow-sm"
            >
              <ExternalLink className="w-4 h-4 text-[var(--color-sky-accent)]" />
              <span>G-Maps</span>
            </a>

            {/* 3. In-App Navigate */}
            <button
              type="button"
              onClick={() => setNavModalOpen(true)}
              className="min-h-[52px] px-2 flex items-center justify-center gap-1.5 rounded-full bg-[#1F2A27] text-[#FAF6EF] hover:bg-[#2C3B37] dark:bg-[#25322D] dark:text-[#FAF6EF] dark:border dark:border-[#384A43] dark:hover:bg-[#2E3D37] active:scale-95 font-body font-semibold text-xs transition-all shadow-sm"
            >
              <Navigation className="w-4 h-4 text-[#F2B84B]" />
              <span>Navigate</span>
            </button>
          </div>
        </div>

        {/* Nearby Pitstop Callout if Available */}
        {nearbyPitstop && (
          <div className="mt-2.5 p-3 bg-[var(--color-marigold-tint)] border border-[var(--color-marigold)]/30 rounded-xl shadow-sm flex items-center justify-between text-xs font-body">
            <div className="flex items-center gap-2">
              <Utensils className="w-4 h-4 text-[#8c5e03]" />
              <span className="font-semibold text-[var(--color-ink)]">
                150m Pitstop: {nearbyPitstop.name}
              </span>
            </div>
            <span className="bg-[var(--color-sage-tint)] text-[var(--color-sage-deep)] px-2.5 py-0.5 rounded-full font-semibold font-mono text-[10px]">
              0 km detour
            </span>
          </div>
        )}

        {/* Pit-stop Quick Radar */}
        <PitstopRadarRow className="mt-3" showSimulatorButton={true} />
      </div>

      {/* 3. MAP TAKES THE MIDDLE */}
      <div className="max-w-4xl mx-auto w-full px-4 py-3 flex-1 min-h-[260px] sm:min-h-[340px]">
        <div className="w-full h-full min-h-[260px] sm:min-h-[340px] rounded-2xl overflow-hidden border border-[var(--color-border)] shadow-sm">
          <TransitLeafletMap
            stops={stops}
            activeStopId={currentStop.id}
            onSelectStop={(s) => {
              const idx = stops.findIndex((item) => item.id === s.id);
              if (idx !== -1) setActiveStopIndex(idx);
            }}
            className="w-full h-full"
          />
        </div>
      </div>

      {/* 4. BOTTOM TWO GIANT BUTTONS (HANDLEBAR OPERABLE) */}
      <div className="sticky bottom-0 left-0 right-0 z-40 bg-[var(--color-surface)]/95 backdrop-blur-md border-t border-[var(--color-border)] p-3.5 pb-[max(1rem,env(safe-area-inset-bottom,0px))] shadow-lg">
        <div className="max-w-md mx-auto space-y-2">
          {/* Giant Primary Button: "Delivered / Next" (72px Tall, Full Width, Marigold Pill) */}
          <button
            type="button"
            onClick={handleMarkDelivered}
            className="w-full h-[72px] px-6 rounded-full bg-[var(--color-marigold)] hover:bg-[var(--color-marigold-hover)] text-[#1F2A27] font-display font-bold text-xl tracking-tight shadow-md active:scale-[0.98] flex items-center justify-center gap-3 transition-all cursor-pointer select-none"
          >
            <CheckCircle2 className="w-7 h-7 stroke-[2.5]" />
            <span>Delivered / Next Stop</span>
          </button>

          {/* Secondary Giant Button: "Can't deliver" */}
          <button
            type="button"
            onClick={() => setIsCantDeliverOpen(true)}
            className="w-full h-12 px-4 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] hover:bg-[var(--color-bg-sunken)] text-[var(--color-ink-secondary)] font-body font-semibold text-xs tracking-wide flex items-center justify-center gap-2 transition-all cursor-pointer select-none active:scale-[0.99]"
          >
            <XCircle className="w-4 h-4 text-[var(--color-priority-high)]" />
            <span>Can't Deliver (Choose Reason)</span>
          </button>
        </div>
      </div>

      {/* 5. UNDO SNACKBAR */}
      {showUndo && lastAction && (
        <UndoSnackbar
          action={lastAction}
          onUndo={handleUndo}
          onDismiss={() => setShowUndo(false)}
        />
      )}

      {/* 6. CAN'T DELIVER BOTTOM SHEET */}
      <CantDeliverBottomSheet
        isOpen={isCantDeliverOpen}
        onClose={() => setIsCantDeliverOpen(false)}
        stopName={currentStop.recipientName}
        stopNumber={currentStop.order}
        onConfirmReason={handleConfirmCantDeliver}
      />

      {/* 7. NAVIGATION HUD GUIDANCE MODAL */}
      {navModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl shadow-xl max-w-sm w-full p-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-2.5 mb-3">
              <span className="font-body font-bold text-xs text-[var(--color-ink)] uppercase tracking-wide flex items-center gap-1.5">
                <Navigation className="w-4 h-4 text-[var(--color-marigold)]" />
                Rider Radar Guidance
              </span>
              <span className="font-mono text-[10px] font-semibold bg-[var(--color-marigold-tint)] text-[#8c5e03] px-2 py-0.5 rounded-full">
                LIVE
              </span>
            </div>

            <div className="space-y-3 font-body text-xs">
              <div className="p-3 bg-[var(--color-bg-sunken)] border border-[var(--color-border)] rounded-xl">
                <div className="font-mono text-[10px] text-[var(--color-ink-muted)] uppercase">
                  Current Corridor Leg:
                </div>
                <div className="font-body font-bold text-sm text-[var(--color-ink)] mt-0.5">
                  Heading to {currentStop.landmark}
                </div>
                <div className="font-mono text-xs text-[var(--color-sage-deep)] font-semibold mt-1">
                  Straight on main road · ~{currentStop.etaMinutes} mins
                </div>
              </div>

              <div className="p-3 bg-[var(--color-marigold-tint)]/60 border border-[var(--color-marigold)]/30 rounded-xl">
                <div className="font-mono text-[10px] text-[#8c5e03] uppercase font-semibold">
                  Traffic Hint:
                </div>
                <div className="text-[var(--color-ink)] font-medium mt-0.5">
                  Keep left before the flyover signal to avoid auto-rickshaw queue.
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 min-h-[44px] flex items-center justify-center gap-1.5 bg-[var(--color-marigold)] hover:bg-[var(--color-marigold-hover)] text-[var(--color-ink)] rounded-full font-body font-semibold text-xs shadow-sm transition-all"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Launch Google Maps GPS</span>
                </a>

                <Button
                  variant="secondary"
                  size="md"
                  onClick={() => setNavModalOpen(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};