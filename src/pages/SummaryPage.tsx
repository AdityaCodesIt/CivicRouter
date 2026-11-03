import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useRoute } from '../context/RouteContext';
import { Button } from '../components/common/Button';
import { DayReplayMap } from '../components/summary/DayReplayMap';
import { EarningsCalculator } from '../components/summary/EarningsCalculator';
import { EmptyState } from '../components/common/EmptyState';
import { Skeleton } from '../components/common/Skeleton';
import * as repo from '../data/repo';
import {
  CheckCircle2,
  XCircle,
  Share2,
  RotateCcw,
  Clock,
  Printer,
  Calendar,
  AlertTriangle,
  Download,
  History,
} from 'lucide-react';

export const SummaryPage: React.FC = () => {
  const {
    stops,
    completedStopIds,
    stats,
    riderPayPerStop,
    setRiderPayPerStop,
    codBonusPercent,
    setCodBonusPercent,
    fuelAllowancePerKm,
    setFuelAllowancePerKm,
    resetToMockData,
  } = useRoute();

  const navigate = useNavigate();
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);

  // Fetch past route plans using TanStack Query
  const {
    data: pastPlans = [],
    isLoading: plansLoading,
  } = useQuery({
    queryKey: ['route_plans'],
    queryFn: () => repo.listPlans(),
  });

  if (stops.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 page-fade-in">
        <EmptyState
          title="No Active Manifest to Summarize"
          description="You haven't planned or completed any stops yet today. Add delivery addresses or load the Mumbai demo day run to explore the summary."
          actionLabel="Plan New Manifest"
          onAction={() => navigate('/plan')}
          secondaryActionLabel="Load Mumbai Demo"
          onSecondaryAction={() => {
            resetToMockData();
            navigate('/route');
          }}
          illustrationType="clipboard"
        />
      </div>
    );
  }

  const completionRate = Math.round((completedStopIds.length / Math.max(stops.length, 1)) * 100);

  const getStopTimestamp = (idx: number) => {
    const baseHour = 9;
    const minutes = idx * 28 + 15;
    const hour = baseHour + Math.floor(minutes / 60);
    const minute = minutes % 60;
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${String(minute).padStart(2, '0')} ${period}`;
  };

  const handleCopyWhatsApp = () => {
    const text = `*ROUTEWALA MUMBAI SHIFT REPORT* 📦
📅 Date: ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
👤 Courier Run: Dadar - Byculla - Colaba Corridor

✅ *DELIVERY RECORD:*
• Completed: ${stats.completedCount} / ${stats.totalStops} (${completionRate}%)
• Failed/Returned: ${stats.failedCount}
• Total Distance: ${stats.totalKm} KM
• Shift Time: ~${Math.floor(stats.totalMinutes / 60)}h ${stats.totalMinutes % 60}m

💵 *CASH ON DELIVERY (COD):*
• Cash Collected to Hand Over: ₹${stats.collectedCodAmount.toLocaleString('en-IN')}

💰 *ESTIMATED PAYOUT:*
• Base + Incentive + Fuel: ₹${stats.estimatedEarnings.toLocaleString('en-IN')}

_Generated via RouteWala Transit Engine_`;

    navigator.clipboard.writeText(text);
    setCopyFeedback('WhatsApp Report Copied!');
    setTimeout(() => setCopyFeedback(null), 3000);
  };

  const handleCopyReceipt = () => {
    const divider = '========================================';
    const lines = [
      divider,
      '     ROUTEWALA MUMBAI TRANSIT RECEIPT    ',
      divider,
      `DATE: ${new Date().toLocaleDateString('en-IN')} | DEPOT: MUMBAI CENTRAL`,
      `TOTAL DROPS: ${stats.totalStops} | COMPLETED: ${stats.completedCount} | FAILED: ${stats.failedCount}`,
      `TOTAL RUN: ${stats.totalKm} KM | TIME SAVED: ~${stats.timeSavedMinutes} MIN`,
      divider,
      'COD REMITTANCE DUE TO HUB:',
      `CASH IN HAND: Rs. ${stats.collectedCodAmount.toLocaleString('en-IN')}`,
      divider,
      'STOP TIMELINE LOG:',
      ...stops.map((s, idx) => {
        const isDone = completedStopIds.includes(s.id);
        const status = isDone ? '[DELIVERED]' : '[FAILED]';
        return `${String(idx + 1).padStart(2, '0')}. ${getStopTimestamp(idx)} ${status} ${s.recipientName} (${s.area}) COD: Rs.${s.codAmount || 0}`;
      }),
      divider,
      `ESTIMATED RIDER PAYOUT: Rs. ${stats.estimatedEarnings.toLocaleString('en-IN')}`,
      divider,
    ];

    navigator.clipboard.writeText(lines.join('\n'));
    setCopyFeedback('Printable Slip Copied to Clipboard!');
    setTimeout(() => setCopyFeedback(null), 3000);
  };

  const handleExportJSON = () => {
    const data = {
      exportDate: new Date().toISOString(),
      summaryStats: stats,
      manifest: stops,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `routewala-shift-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-6 space-y-6 page-fade-in">
      {/* 1. TOP RECEIPT CARD */}
      <div className="soft-card p-6 sm:p-8 bg-[var(--color-surface)] shadow-sm border border-[var(--color-border)] rounded-2xl">
        {/* Receipt Header */}
        <div className="text-center border-b border-[var(--color-border)] pb-6 mb-6">
          <div className="w-12 h-12 mx-auto mb-3 bg-[var(--color-marigold)] text-[#1F2A27] rounded-2xl flex items-center justify-center font-display font-bold text-xl shadow-sm">
            RW
          </div>
          <div className="font-mono text-xs font-semibold text-[var(--color-ink-muted)] uppercase tracking-wider">
            Mumbai Courier Transit Receipt & Closeout
          </div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-[var(--color-ink)] mt-1">
            End of Shift Summary
          </h1>
          <div className="font-body text-xs text-[var(--color-ink-secondary)] mt-1.5 flex items-center justify-center gap-2 flex-wrap">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
            <span>·</span>
            <span>Corridor: South-Central Mumbai</span>
            <span>·</span>
            <span className="font-semibold text-[var(--color-sage-deep)]">{completionRate}% Success Rate</span>
          </div>
        </div>

        {/* 4 Hero KPI Number Tiles */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {/* 1. Drops Completed vs Failed */}
          <div className="p-3.5 bg-[var(--color-bg-sunken)] border border-[var(--color-border)] rounded-xl text-center">
            <div className="font-mono text-[10px] font-semibold text-[var(--color-ink-muted)] uppercase tracking-wide">
              Deliveries
            </div>
            <div className="font-mono font-bold text-2xl text-[var(--color-ink)] mt-0.5 tabular-nums">
              {stats.completedCount} / {stats.totalStops}
            </div>
            <div className="font-mono text-[10px] text-[var(--color-sage-deep)] font-semibold mt-0.5">
              {stats.failedCount > 0 ? `${stats.failedCount} RETURNED` : '0 RETURNS'}
            </div>
          </div>

          {/* 2. Total COD Handover */}
          <div className="p-3.5 bg-[var(--color-marigold-tint)]/60 border border-[var(--color-marigold)]/30 rounded-xl text-center">
            <div className="font-mono text-[10px] font-semibold text-[#8c5e03] uppercase tracking-wide">
              COD To Remit
            </div>
            <div className="font-mono font-bold text-2xl text-[var(--color-ink)] mt-0.5 flex items-center justify-center tabular-nums">
              <span>₹</span>
              <span>{stats.collectedCodAmount.toLocaleString('en-IN')}</span>
            </div>
            <div className="font-body text-[10px] text-[var(--color-ink-secondary)] font-medium mt-0.5">
              Deposit at depot
            </div>
          </div>

          {/* 3. Distance Covered */}
          <div className="p-3.5 bg-[var(--color-bg-sunken)] border border-[var(--color-border)] rounded-xl text-center">
            <div className="font-mono text-[10px] font-semibold text-[var(--color-ink-muted)] uppercase tracking-wide">
              Distance
            </div>
            <div className="font-mono font-bold text-2xl text-[var(--color-ink)] mt-0.5 tabular-nums">
              {stats.totalKm} km
            </div>
            <div className="font-body text-[10px] text-[var(--color-ink-muted)] mt-0.5">Odometer total</div>
          </div>

          {/* 4. Time Saved */}
          <div className="p-3.5 bg-[var(--color-bg-sunken)] border border-[var(--color-border)] rounded-xl text-center">
            <div className="font-mono text-[10px] font-semibold text-[var(--color-ink-muted)] uppercase tracking-wide">
              Time Saved
            </div>
            <div className="font-mono font-bold text-2xl text-[var(--color-sage-deep)] mt-0.5 tabular-nums">
              ~{stats.timeSavedMinutes}m
            </div>
            <div className="font-body text-[10px] text-[var(--color-ink-muted)] mt-0.5">vs Standard Maps</div>
          </div>
        </div>

        {/* 2. RIDER EARNINGS CALCULATOR CARD */}
        <EarningsCalculator
          completedStopsCount={stats.completedCount}
          totalKm={stats.totalKm}
          collectedCodAmount={stats.collectedCodAmount}
          ratePerStop={riderPayPerStop}
          onUpdateRatePerStop={setRiderPayPerStop}
          codBonusPercent={codBonusPercent}
          onUpdateCodBonusPercent={setCodBonusPercent}
          fuelAllowancePerKm={fuelAllowancePerKm}
          onUpdateFuelAllowancePerKm={setFuelAllowancePerKm}
          className="mb-6"
        />

        {/* 3. INTERACTIVE DAY REPLAY MAP */}
        <div className="mb-6">
          <DayReplayMap stops={stops} completedStopIds={completedStopIds} />
        </div>

        {/* 4. CHRONOLOGICAL PER-STOP TIMELINE */}
        <div className="border-t border-b border-[var(--color-border)] py-5 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="font-body font-bold text-xs text-[var(--color-ink)] uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-4 h-4 text-[var(--color-marigold)]" />
              <span>Chronological Delivery Timeline</span>
            </div>
            <span className="font-mono text-[11px] text-[var(--color-ink-muted)]">
              {stops.length} stops recorded
            </span>
          </div>

          <div className="space-y-3 font-body text-xs">
            {stops.map((stop, idx) => {
              const isDone = completedStopIds.includes(stop.id);
              const isFailed = stop.status === 'skipped' || (stop.notes && stop.notes.includes('[Failed:'));
              const timestamp = getStopTimestamp(idx);

              return (
                <div
                  key={stop.id}
                  className="p-3.5 bg-[var(--color-bg-sunken)] border border-[var(--color-border)] rounded-xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-2.5"
                >
                  <div className="flex items-start sm:items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-[#1F2A27] text-[#F2B84B] dark:bg-[#FAF6EF] dark:text-[#1F2A27] flex items-center justify-center font-mono font-bold text-xs shrink-0">
                      {String(idx + 1).padStart(2, '0')}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-sm text-[var(--color-ink)]">
                          {stop.recipientName}
                        </span>
                        <span className="text-[11px] text-[var(--color-ink-muted)] font-mono">
                          ({stop.area})
                        </span>
                      </div>
                      <div className="text-[11px] text-[var(--color-ink-secondary)] truncate max-w-sm mt-0.5">
                        {stop.address}
                      </div>

                      {isFailed && stop.notes && (
                        <div className="mt-1 text-[11px] font-semibold text-[var(--color-priority-high)] flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>{stop.notes}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right side: Timestamp + COD + Status badge */}
                  <div className="flex items-center gap-2.5 self-end sm:self-auto shrink-0">
                    <span className="text-[var(--color-ink-secondary)] font-mono font-medium text-[11px]">
                      {timestamp}
                    </span>

                    {stop.codAmount && stop.codAmount > 0 ? (
                      <span className="px-2 py-0.5 rounded-full bg-[var(--color-marigold-tint)] text-[#8c5e03] font-mono font-semibold text-[10px]">
                        ₹{stop.codAmount} COD
                      </span>
                    ) : null}

                    <span
                      className={`px-2.5 py-1 rounded-full font-body font-semibold text-[10px] uppercase flex items-center gap-1 ${
                        isDone
                          ? 'bg-[var(--color-sage-tint)] text-[var(--color-sage-deep)]'
                          : isFailed
                          ? 'bg-[var(--color-priority-high-bg)] text-[var(--color-priority-high)]'
                          : 'bg-[var(--color-marigold-tint)] text-[#8c5e03]'
                      }`}
                    >
                      {isDone ? (
                        <>
                          <CheckCircle2 className="w-3 h-3 stroke-[2.5]" />
                          <span>Delivered</span>
                        </>
                      ) : isFailed ? (
                        <>
                          <XCircle className="w-3 h-3 stroke-[2.5]" />
                          <span>Returned</span>
                        </>
                      ) : (
                        <span>Pending</span>
                      )}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 5. PAST DELIVERY RUNS LIST (route_plans) */}
        <div className="border-b border-[var(--color-border)] pb-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="font-body font-bold text-xs text-[var(--color-ink)] uppercase tracking-wider flex items-center gap-2">
              <History className="w-4 h-4 text-[var(--color-marigold)]" />
              <span>Past Delivery Run Archive</span>
            </div>
            <span className="font-mono text-[11px] text-[var(--color-ink-muted)]">
              {pastPlans.length} saved runs
            </span>
          </div>

          {plansLoading ? (
            <div className="space-y-2.5">
              <Skeleton className="h-14 w-full" />
              <Skeleton className="h-14 w-full" />
            </div>
          ) : pastPlans.length === 0 ? (
            <div className="p-4 bg-[var(--color-bg-sunken)] border border-[var(--color-border)] rounded-xl text-center font-body text-xs text-[var(--color-ink-muted)]">
              No previous delivery runs recorded yet.
            </div>
          ) : (
            <div className="space-y-2.5">
              {pastPlans.map((plan) => (
                <div
                  key={plan.id}
                  className="p-3.5 bg-[var(--color-bg-sunken)] border border-[var(--color-border)] rounded-xl shadow-sm flex items-center justify-between gap-3 text-xs font-body"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-ink)]">
                      <Calendar className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="font-body font-bold text-sm text-[var(--color-ink)]">
                        {plan.title || 'Mumbai Corridor Run'}
                      </div>
                      <div className="text-[11px] text-[var(--color-ink-secondary)]">
                        Date: {plan.plan_date} · Status: <span className="uppercase font-semibold">{plan.status}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="font-mono font-semibold text-[var(--color-ink)]">
                        {plan.total_km ? `${plan.total_km} KM` : '18.5 KM'}
                      </div>
                      <div className="text-[10px] text-[var(--color-sage-deep)] font-semibold font-mono">
                        ₹{plan.earnings || 580} EST.
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 6. MULTI-ACTION EXPORT & SHIFT CLOSEOUT BAR */}
        <div className="space-y-3">
          {copyFeedback && (
            <div className="p-3 bg-[var(--color-sage-tint)] text-[var(--color-sage-deep)] border border-[var(--color-sage)] rounded-xl font-body text-xs font-semibold text-center">
              ✓ {copyFeedback}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Button
              variant="primary"
              size="md"
              onClick={handleCopyWhatsApp}
              icon={<Share2 className="w-4 h-4 stroke-[2.5]" />}
            >
              Share WhatsApp Report
            </Button>

            <Button
              variant="secondary"
              size="md"
              onClick={handleCopyReceipt}
              icon={<Printer className="w-4 h-4" />}
            >
              Copy Printable Receipt
            </Button>

            <Button
              variant="secondary"
              size="md"
              onClick={handleExportJSON}
              icon={<Download className="w-4 h-4" />}
            >
              Export Route JSON
            </Button>
          </div>

          <div className="pt-2 flex justify-center">
            <Button
              variant="danger"
              size="sm"
              onClick={() => {
                resetToMockData();
                navigate('/plan');
              }}
              icon={<RotateCcw className="w-4 h-4" />}
            >
              Reset Manifest for Tomorrow
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};