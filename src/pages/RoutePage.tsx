import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRoute } from '../context/RouteContext';
import { Button } from '../components/common/Button';
import { StopCard } from '../components/common/StopCard';
import { EmptyState } from '../components/common/EmptyState';
import { TransitLeafletMap } from '../components/route/TransitLeafletMap';
import { OnTheWayPromptBanner } from '../components/navigation/OnTheWayPromptBanner';
import { PitstopRadarRow } from '../components/navigation/PitstopRadarRow';
import { PriorityLevel } from '../data/mockStops';
import {
  Navigation,
  AlertTriangle,
  ChevronUp,
  ChevronDown,
  GripVertical,
} from 'lucide-react';

export const RoutePage: React.FC = () => {
  const {
    stops,
    reorderStops,
    markStopComplete,
    setActiveStopIndex,
    resetToMockData,
    stats,
  } = useRoute();

  const navigate = useNavigate();

  // Mode Toggles
  const [priorityMode, setPriorityMode] = useState<'smart' | 'strict'>('smart');
  const [manualReorderMode, setManualReorderMode] = useState(false);
  const [mobileSheetExpanded, setMobileSheetExpanded] = useState(false);
  const [selectedStopId, setSelectedStopId] = useState<string>(stops[0]?.id || '');
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  // Calculate sorted stops based on selected Priority Mode
  const sequencedStops = useMemo(() => {
    if (manualReorderMode) {
      return stops;
    }

    const priorityRank: Record<PriorityLevel, number> = {
      high: 1,
      medium: 2,
      low: 3,
    };

    if (priorityMode === 'strict') {
      return [...stops].sort((a, b) => {
        if (priorityRank[a.priority] !== priorityRank[b.priority]) {
          return priorityRank[a.priority] - priorityRank[b.priority];
        }
        return b.coordinates.lat - a.coordinates.lat;
      }).map((s, idx) => ({
        ...s,
        order: idx + 1,
        etaMinutes: 10 + idx * 16,
        distanceKm: Number((1.8 + idx * 2.5).toFixed(1)),
      }));
    } else {
      return [...stops].sort((a, b) => {
        if (a.priority === 'high' && b.priority !== 'high') return -1;
        if (b.priority === 'high' && a.priority !== 'high') return 1;
        if (a.type !== b.type) return a.type === 'pickup' ? -1 : 1;
        return b.coordinates.lat - a.coordinates.lat;
      }).map((s, idx) => ({
        ...s,
        order: idx + 1,
        etaMinutes: 10 + idx * 13,
        distanceKm: Number((1.6 + idx * 2.1).toFixed(1)),
      }));
    }
  }, [stops, priorityMode, manualReorderMode]);

  const selectedStop = sequencedStops.find((s) => s.id === selectedStopId) || sequencedStops[0];

  const savedKm = priorityMode === 'smart' ? '6.2 km' : '4.4 km';
  const totalKm = sequencedStops.reduce((acc, s) => Math.max(acc, s.distanceKm), 0);
  const totalMinutes = sequencedStops.reduce((acc, s) => Math.max(acc, s.etaMinutes), 0);
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  const formattedDuration = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;

  const evaluateDeadlineRisk = (deadline?: string, etaMinutes: number = 0) => {
    if (!deadline || typeof deadline !== 'string') return { isRisk: false, text: '' };
    const match = deadline.match(/(\d+):(\d+)\s*(AM|PM)?/i);
    if (!match) return { isRisk: false, text: '' };
    let h = parseInt(match[1], 10);
    const m = parseInt(match[2] || '0', 10);
    const period = match[3] ? match[3].toUpperCase() : h >= 12 ? 'PM' : 'AM';
    const isPM = period === 'PM';
    if (isPM && h !== 12) h += 12;
    if (!isPM && h === 12) h = 0;

    const deadlineMinutesFromStart = (h - 10) * 60 + m;
    if (deadlineMinutesFromStart <= 0) {
      return { isRisk: true, text: `Overdue (deadline was ${deadline})` };
    }
    if (etaMinutes > deadlineMinutesFromStart) {
      const over = etaMinutes - deadlineMinutesFromStart;
      return { isRisk: true, text: `LATE RISK: +${over}m past deadline (${deadline})` };
    }
    if (deadlineMinutesFromStart - etaMinutes <= 15) {
      return { isRisk: true, text: `TIGHT BUFFER: ${deadlineMinutesFromStart - etaMinutes}m buffer before ${deadline}` };
    }
    return { isRisk: false, text: '' };
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    reorderStops(draggedIndex, index);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleStartDay = () => {
    setActiveStopIndex(0);
    navigate('/go');
  };

  if (stops.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 page-fade-in">
        <EmptyState
          title="No Stops in Active Route"
          description="Your route manifest is currently empty. Add delivery stops in Plan mode or load the 8-stop Mumbai demo day."
          actionLabel="Plan Deliveries"
          onAction={() => navigate('/plan')}
          secondaryActionLabel="Load Mumbai Demo Run"
          onSecondaryAction={() => {
            resetToMockData();
          }}
          illustrationType="clipboard"
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-5">
      {/* 1. TOP SUMMARY STRIP (METRICS & TOGGLE CONTROLS) */}
      <div className="soft-card bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl shadow-sm p-4 sm:p-5 mb-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Left: Headline & Saved Metric Badge */}
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1.5">
              <span className="font-mono text-xs font-semibold bg-[var(--color-bg-sunken)] text-[var(--color-ink)] px-3 py-1 rounded-full border border-[var(--color-border)]">
                {sequencedStops.length} STOPS · {stats.highPriorityCount} HIGH PRIORITY
              </span>

              {/* Saved vs Your Order Badge */}
              <span className="font-mono text-xs font-semibold bg-[var(--color-sage-tint)] text-[var(--color-sage-deep)] border border-[var(--color-sage)] px-3 py-1 rounded-full flex items-center gap-1">
                <span>SAVED VS YOUR ORDER: {savedKm}</span>
              </span>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono font-medium text-[var(--color-ink)] mt-2">
              <span className="text-base font-bold font-display">
                TOTAL: {totalKm} KM
              </span>
              <span className="text-[var(--color-ink-muted)]">·</span>
              <span className="text-base font-bold font-display text-[var(--color-sage-deep)]">
                ~{formattedDuration}
              </span>
              <span className="text-[var(--color-ink-muted)]">·</span>
              <span className="text-[var(--color-ink-secondary)]">
                Avg. Stop: ~14 mins
              </span>
            </div>
          </div>

          {/* Right: Strict vs Smart Priority Toggle & Reorder Mode */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Priority Mode Selector Segmented Control */}
            <div className="flex items-center border border-[var(--color-border)] rounded-full bg-[var(--color-bg-sunken)] p-1 font-body text-xs font-semibold">
              <button
                type="button"
                onClick={() => {
                  setPriorityMode('smart');
                  setManualReorderMode(false);
                }}
                className={`h-9 px-3.5 rounded-full transition-all cursor-pointer ${
                  priorityMode === 'smart' && !manualReorderMode
                    ? 'bg-[var(--color-marigold)] text-[#1F2A27] shadow-sm font-bold'
                    : 'text-[var(--color-ink-secondary)] hover:text-[var(--color-ink)]'
                }`}
              >
                Smart Priority
              </button>

              <button
                type="button"
                onClick={() => {
                  setPriorityMode('strict');
                  setManualReorderMode(false);
                }}
                className={`h-9 px-3.5 rounded-full transition-all cursor-pointer ${
                  priorityMode === 'strict' && !manualReorderMode
                    ? 'bg-[#FBE1DB] dark:bg-[#2C1917] text-[#D9604C] dark:text-[#F4A58A] border border-[#D9604C]/40 shadow-sm font-bold'
                    : 'text-[var(--color-ink-secondary)] hover:text-[var(--color-ink)]'
                }`}
              >
                Strict Priority
              </button>
            </div>

            {/* Reorder Manually Button */}
            <button
              type="button"
              onClick={() => setManualReorderMode(!manualReorderMode)}
              className={`h-11 px-3.5 rounded-full border border-[var(--color-border)] font-body text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                manualReorderMode
                  ? 'bg-[#F2B84B] text-[#1F2A27] border-[#E0A11B] font-bold shadow-sm'
                  : 'bg-[var(--color-surface)] text-[var(--color-ink)] hover:bg-[var(--color-bg-sunken)]'
              }`}
            >
              <GripVertical className="w-4 h-4" />
              <span>{manualReorderMode ? 'Lock Order' : 'Reorder Manually'}</span>
            </button>

            {/* Primary Action Button: "Start Day" */}
            <Button
              variant="primary"
              size="md"
              onClick={handleStartDay}
              icon={<Navigation className="w-4 h-4 text-[#1F2A27]" />}
            >
              Start Day
            </Button>
          </div>
        </div>

        {/* Priority Mode Advisory Info */}
        <div className="mt-3.5 pt-3 border-t border-[var(--color-border)] flex items-center justify-between text-xs font-body text-[var(--color-ink-secondary)]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[var(--color-marigold)]" />
            <span>
              {priorityMode === 'smart'
                ? 'Smart Priority active: Groups North-to-South drops along Mumbai arterials while honoring critical deadlines.'
                : 'Strict Priority active: Every urgent high-priority stop is serviced before standard deliveries regardless of distance.'}
            </span>
          </div>

          {manualReorderMode && (
            <span className="font-mono text-xs font-semibold text-[#8c5e03]">
              Manual reorder active: Drag cards below to set custom sequence.
            </span>
          )}
        </div>
      </div>

      {/* On-The-Way Slide-In Prompt Banner */}
      <OnTheWayPromptBanner className="mb-4" />

      {/* Pitstop Radar Row along Corridor */}
      <PitstopRadarRow className="mb-4" showSimulatorButton={true} />

      {/* 2. TWO-PANE LAYOUT: LIST (LEFT) & LEAFLET MAP (RIGHT) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT PANE: ORDER LIST & LATE WARNINGS */}
        <div className="hidden lg:block lg:col-span-5 space-y-4 max-h-[calc(100vh-220px)] overflow-y-auto pr-2">
          <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-2">
            <span className="font-body font-bold text-xs text-[var(--color-ink)] uppercase tracking-wider">
              Delivery Sequence Timeline ({sequencedStops.length} Stops)
            </span>
            <span className="font-mono text-[10px] text-[var(--color-sage-deep)] font-semibold">
              ETA CALCULATED
            </span>
          </div>

          <div className="space-y-3">
            {sequencedStops.map((stop, idx) => {
              const risk = evaluateDeadlineRisk(stop.deadline, stop.etaMinutes);

              return (
                <div key={stop.id} className="relative">
                  {idx > 0 && (
                    <div className="w-0.5 h-3 ml-7 border-l-2 border-dashed border-[var(--color-border)]" />
                  )}

                  {risk.isRisk && (
                    <div className="mb-1.5 p-2 bg-[var(--color-priority-high-bg)] border border-[var(--color-priority-high)] rounded-xl font-mono text-xs font-semibold text-[var(--color-priority-high)] flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      <span>{risk.text}</span>
                    </div>
                  )}

                  <StopCard
                    stop={stop}
                    isCurrent={idx === 0}
                    draggable={manualReorderMode}
                    dragIndex={idx}
                    onDragStart={handleDragStart}
                    onDragOver={handleDragOver}
                    onDragEnd={handleDragEnd}
                    onSelect={(s) => setSelectedStopId(s.id)}
                    onComplete={markStopComplete}
                    onNavigate={() => {
                      setActiveStopIndex(idx);
                      navigate('/go');
                    }}
                  />
                </div>
              );
            })}
          </div>

          {/* Bottom Start Day Action Banner */}
          <div className="pt-4 sticky bottom-0 bg-gradient-to-t from-[var(--color-bg)] via-[var(--color-bg)] to-transparent -mx-2 px-2 pb-2">
            <Button
              variant="primary"
              size="touch"
              fullWidth
              onClick={handleStartDay}
              icon={<Navigation className="w-5 h-5 text-[var(--color-ink)] stroke-[2.5]" />}
            >
              Start Day (Driver Mode)
            </Button>
          </div>
        </div>

        {/* RIGHT PANE: LEAFLET MAP */}
        <div className="lg:col-span-7 h-[420px] lg:h-[calc(100vh-220px)] sticky top-20 rounded-2xl overflow-hidden border border-[var(--color-border)] shadow-sm">
          <TransitLeafletMap
            stops={sequencedStops}
            activeStopId={selectedStopId}
            onSelectStop={(s) => setSelectedStopId(s.id)}
            className="w-full h-full"
          />
        </div>
      </div>

      {/* 3. MOBILE COLLAPSIBLE BOTTOM SHEET */}
      <div className="lg:hidden fixed bottom-[calc(3.5rem+env(safe-area-inset-bottom,0px))] left-0 right-0 z-30 bg-[var(--color-surface)] border-t border-[var(--color-border)] rounded-t-2xl shadow-xl transition-all duration-200">
        {/* Drag Pill Affordance */}
        <div className="w-10 h-1 bg-[var(--color-border-strong)]/60 rounded-full mx-auto mt-2" />

        <div
          onClick={() => setMobileSheetExpanded(!mobileSheetExpanded)}
          className="p-3 bg-[var(--color-bg-sunken)] border-b border-[var(--color-border)] rounded-t-xl flex items-center justify-between cursor-pointer select-none"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[var(--color-marigold)] text-[#1F2A27] font-mono font-bold text-xs flex items-center justify-center">
              {sequencedStops.length}
            </div>
            <div>
              <div className="font-body font-bold text-sm text-[var(--color-ink)]">
                Route Order & Milestones
              </div>
              <div className="font-mono text-[11px] text-[var(--color-ink-secondary)]">
                {totalKm} km · {formattedDuration} · saved {savedKm}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-body text-xs font-semibold text-[var(--color-ink)]">
              {mobileSheetExpanded ? 'Collapse' : 'Expand Order'}
            </span>
            {mobileSheetExpanded ? (
              <ChevronDown className="w-5 h-5 text-[var(--color-ink)]" />
            ) : (
              <ChevronUp className="w-5 h-5 text-[var(--color-ink)]" />
            )}
          </div>
        </div>

        {mobileSheetExpanded && (
          <div className="max-h-[55vh] overflow-y-auto p-3.5 space-y-3 font-body bg-[var(--color-bg-sunken)]">
            {sequencedStops.map((stop, idx) => {
              const risk = evaluateDeadlineRisk(stop.deadline, stop.etaMinutes);
              return (
                <div key={stop.id} className="relative">
                  {risk.isRisk && (
                    <div className="mb-1 p-2 bg-[var(--color-priority-high-bg)] border border-[var(--color-priority-high)] rounded-xl font-mono text-[11px] font-semibold text-[var(--color-priority-high)] flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                      <span>{risk.text}</span>
                    </div>
                  )}

                  <StopCard
                    stop={stop}
                    isCurrent={idx === 0}
                    draggable={manualReorderMode}
                    dragIndex={idx}
                    onSelect={(s) => {
                      setSelectedStopId(s.id);
                      setMobileSheetExpanded(false);
                    }}
                    onComplete={markStopComplete}
                    onNavigate={() => {
                      setActiveStopIndex(idx);
                      navigate('/go');
                    }}
                  />
                </div>
              );
            })}
          </div>
        )}

        <div className="p-3 bg-[var(--color-surface)] border-t border-[var(--color-border)]">
          <Button
            variant="primary"
            size="touch"
            fullWidth
            onClick={handleStartDay}
            icon={<Navigation className="w-5 h-5 text-[#1F2A27]" />}
          >
            Start Day (Driver Mode)
          </Button>
        </div>
      </div>
    </div>
  );
};