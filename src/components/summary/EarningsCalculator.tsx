import React, { useState } from 'react';
import { IndianRupee, Calculator, TrendingUp } from 'lucide-react';

interface EarningsCalculatorProps {
  completedStopsCount: number;
  totalKm: number;
  collectedCodAmount: number;
  ratePerStop: number;
  onUpdateRatePerStop: (val: number) => void;
  codBonusPercent: number;
  onUpdateCodBonusPercent: (val: number) => void;
  fuelAllowancePerKm: number;
  onUpdateFuelAllowancePerKm: (val: number) => void;
  className?: string;
}

export const EarningsCalculator: React.FC<EarningsCalculatorProps> = ({
  completedStopsCount,
  totalKm,
  collectedCodAmount,
  ratePerStop,
  onUpdateRatePerStop,
  codBonusPercent,
  onUpdateCodBonusPercent,
  fuelAllowancePerKm,
  onUpdateFuelAllowancePerKm,
  className = '',
}) => {
  const [isEditingRates, setIsEditingRates] = useState<boolean>(false);

  // Computed values
  const basePay = completedStopsCount * ratePerStop;
  const codIncentive = Math.round((collectedCodAmount * codBonusPercent) / 100);
  const fuelAllowance = Math.round(totalKm * fuelAllowancePerKm);
  const grandTotal = basePay + codIncentive + fuelAllowance;

  // Preset quick adjustments
  const applyPreset = (rate: number, codPct: number, fuelRate: number) => {
    onUpdateRatePerStop(rate);
    onUpdateCodBonusPercent(codPct);
    onUpdateFuelAllowancePerKm(fuelRate);
  };

  return (
    <div className={`p-4 sm:p-5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl shadow-sm ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-[var(--color-border)]">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[var(--color-sage-tint)] text-[var(--color-sage-deep)] border border-[var(--color-sage)]/30 flex items-center justify-center">
            <IndianRupee className="w-4 h-4 stroke-[2.5]" />
          </div>
          <div>
            <h3 className="font-display font-bold text-lg text-[var(--color-ink)] leading-tight">
              Shift Earnings & Fuel Allowance
            </h3>
            <p className="font-body text-xs text-[var(--color-ink-muted)]">
              Transparent Mumbai rider payout breakdown
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsEditingRates(!isEditingRates)}
          className="px-3 py-1.5 rounded-full border border-[var(--color-border)] bg-[var(--color-bg-sunken)] hover:bg-[var(--color-surface)] text-[var(--color-ink)] font-body text-xs font-medium cursor-pointer flex items-center gap-1.5 transition-colors"
        >
          <Calculator className="w-3.5 h-3.5" />
          <span>{isEditingRates ? 'Done' : 'Adjust Rates'}</span>
        </button>
      </div>

      {/* Hero Grand Total Fare Meter */}
      <div className="p-5 bg-gradient-to-br from-[var(--color-marigold-tint)] to-[var(--color-marigold)]/30 border border-[var(--color-marigold)]/40 rounded-2xl shadow-sm mb-4 text-[var(--color-ink)]">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-mono text-xs font-semibold uppercase tracking-wider text-[#8c5e03]">
              Estimated Shift Take-Home
            </div>
            <div className="font-mono font-bold text-3xl sm:text-4xl tracking-tight flex items-center mt-0.5 tabular-nums">
              <span>₹</span>
              <span>{grandTotal.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div className="text-right">
            <div className="font-mono text-xs font-semibold bg-[#1F2A27] text-[#F2B84B] dark:bg-[#2C2415] dark:text-[#F2B84B] dark:border dark:border-[#F2B84B]/30 px-2.5 py-1 rounded-full inline-flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              <span>₹{(totalKm > 0 ? (grandTotal / totalKm).toFixed(1) : '0')}/km</span>
            </div>
            <div className="font-body text-xs text-[var(--color-ink-secondary)] mt-1.5">
              {completedStopsCount} of {completedStopsCount} stops credited
            </div>
          </div>
        </div>
      </div>

      {/* 3 Component Breakdown Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        {/* 1. Base Pay */}
        <div className="p-3.5 bg-[var(--color-bg-sunken)] border border-[var(--color-border)] rounded-xl">
          <div className="font-mono text-[10px] font-semibold text-[var(--color-ink-muted)] uppercase tracking-wide">
            Base Stop Pay
          </div>
          <div className="font-mono font-bold text-xl text-[var(--color-ink)] mt-0.5 tabular-nums">
            ₹{basePay.toLocaleString('en-IN')}
          </div>
          <div className="font-body text-[11px] text-[var(--color-ink-secondary)] mt-1">
            {completedStopsCount} stops × ₹{ratePerStop}
          </div>
        </div>

        {/* 2. COD Handling Incentive */}
        <div className="p-3.5 bg-[var(--color-bg-sunken)] border border-[var(--color-border)] rounded-xl">
          <div className="font-mono text-[10px] font-semibold text-[var(--color-ink-muted)] uppercase tracking-wide">
            COD Incentive ({codBonusPercent}%)
          </div>
          <div className="font-mono font-bold text-xl text-[var(--color-sage-deep)] mt-0.5 tabular-nums">
            +₹{codIncentive.toLocaleString('en-IN')}
          </div>
          <div className="font-body text-[11px] text-[var(--color-ink-secondary)] mt-1">
            On ₹{collectedCodAmount.toLocaleString('en-IN')} cash
          </div>
        </div>

        {/* 3. Fuel / EV Allowance */}
        <div className="p-3.5 bg-[var(--color-bg-sunken)] border border-[var(--color-border)] rounded-xl">
          <div className="font-mono text-[10px] font-semibold text-[var(--color-ink-muted)] uppercase tracking-wide">
            Fuel Allowance
          </div>
          <div className="font-mono font-bold text-xl text-[#8c5e03] mt-0.5 tabular-nums">
            +₹{fuelAllowance.toLocaleString('en-IN')}
          </div>
          <div className="font-body text-[11px] text-[var(--color-ink-secondary)] mt-1">
            {totalKm} km × ₹{fuelAllowancePerKm}/km
          </div>
        </div>
      </div>

      {/* Editable Rate Inputs (Toggleable) */}
      {isEditingRates && (
        <div className="p-4 bg-[var(--color-bg-sunken)] border border-[var(--color-border)] rounded-xl space-y-3 mb-2 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <span className="font-body text-xs font-semibold text-[var(--color-ink)]">
              Contract Rates Preset:
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => applyPreset(45, 2, 4)}
                className="px-2.5 py-1 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] text-xs font-body hover:bg-[var(--color-bg-sunken)] transition-colors"
              >
                Standard (₹45)
              </button>
              <button
                type="button"
                onClick={() => applyPreset(60, 3, 5)}
                className="px-2.5 py-1 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] text-xs font-body hover:bg-[var(--color-bg-sunken)] transition-colors"
              >
                Express (₹60)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-body text-xs">
            <div>
              <label htmlFor="rate-per-stop" className="block text-xs font-medium text-[var(--color-ink-secondary)] mb-1">
                Per-Stop Pay (₹)
              </label>
              <input
                id="rate-per-stop"
                type="number"
                min={20}
                max={150}
                value={ratePerStop}
                onChange={(e) => onUpdateRatePerStop(Number(e.target.value))}
                className="w-full h-10 px-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl font-mono font-semibold text-[var(--color-ink)] focus:outline-none focus:ring-2 focus:ring-[var(--color-marigold)]"
              />
            </div>

            <div>
              <label htmlFor="cod-bonus" className="block text-xs font-medium text-[var(--color-ink-secondary)] mb-1">
                COD Commission (%)
              </label>
              <input
                id="cod-bonus"
                type="number"
                min={0}
                max={10}
                step={0.5}
                value={codBonusPercent}
                onChange={(e) => onUpdateCodBonusPercent(Number(e.target.value))}
                className="w-full h-10 px-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl font-mono font-semibold text-[var(--color-ink)] focus:outline-none focus:ring-2 focus:ring-[var(--color-marigold)]"
              />
            </div>

            <div>
              <label htmlFor="fuel-rate" className="block text-xs font-medium text-[var(--color-ink-secondary)] mb-1">
                Fuel Allowance (₹/km)
              </label>
              <input
                id="fuel-rate"
                type="number"
                min={0}
                max={15}
                step={0.5}
                value={fuelAllowancePerKm}
                onChange={(e) => onUpdateFuelAllowancePerKm(Number(e.target.value))}
                className="w-full h-10 px-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl font-mono font-semibold text-[var(--color-ink)] focus:outline-none focus:ring-2 focus:ring-[var(--color-marigold)]"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};