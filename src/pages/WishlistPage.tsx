import React, { useState } from 'react';
import { useRoute } from '../context/RouteContext';
import { Button } from '../components/common/Button';
import { Chip } from '../components/common/Chip';
import { Toggle } from '../components/common/Toggle';
import { Modal } from '../components/common/Modal';
import { EmptyState } from '../components/common/EmptyState';
import { OnTheWayPromptBanner } from '../components/navigation/OnTheWayPromptBanner';
import { PitstopRadarRow } from '../components/navigation/PitstopRadarRow';
import {
  WishlistItem,
  ErrandCategory,
} from '../data/wishlistItems';
import {
  ShoppingBag,
  Pill,
  CreditCard,
  Utensils,
  Fuel,
  Droplets,
  Plus,
  Sliders,
  Sparkles,
  Trash2,
  Check,
  Compass,
  Coffee,
} from 'lucide-react';

export const WishlistPage: React.FC = () => {
  const {
    wishlist,
    pinnedWishlistIds,
    toggleWishlistPin,
    addWishlistItem,
    removeWishlistItem,
    wishlistSettings,
    updateWishlistSettings,
    triggerMockOnTheWayPrompt,
  } = useRoute();

  // Category filter
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [showSettingsDrawer, setShowSettingsDrawer] = useState(false);

  // New errand form state
  const [errandTitle, setErrandTitle] = useState('');
  const [category, setCategory] = useState<ErrandCategory>('shop');
  const [landmark, setLandmark] = useState('');
  const [area, setArea] = useState('Lower Parel');
  const [detourBudgetMinutes, setDetourBudgetMinutes] = useState(3);
  const [notes, setNotes] = useState('');

  const filteredItems = wishlist.filter((item) => {
    if (categoryFilter === 'all') return true;
    return item.category === categoryFilter;
  });

  const getCategoryIconComponent = (cat?: string) => {
    const safeCat = (cat || 'shop').toLowerCase();
    switch (safeCat) {
      case 'shop':
        return <ShoppingBag className="w-4 h-4 text-[var(--color-sky-accent)]" />;
      case 'pharmacy':
        return <Pill className="w-4 h-4 text-[var(--color-priority-high)]" />;
      case 'atm':
        return <CreditCard className="w-4 h-4 text-[var(--color-sage-deep)]" />;
      case 'food':
        return <Utensils className="w-4 h-4 text-[#8c5e03]" />;
      case 'fuel':
        return <Fuel className="w-4 h-4 text-[var(--color-priority-high)]" />;
      case 'restroom':
        return <Droplets className="w-4 h-4 text-[var(--color-sage-deep)]" />;
      case 'chai':
      default:
        return <Coffee className="w-4 h-4 text-[#8c5e03]" />;
    }
  };

  const handleCreateErrand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!errandTitle.trim()) return;

    addWishlistItem({
      name: errandTitle.trim(),
      category,
      landmark: landmark.trim() || 'Near delivery corridor',
      area: area.trim() || 'Mumbai Central',
      distanceOffRouteMeters: 250,
      detourMinutes: Math.min(detourBudgetMinutes, 4),
      detourBudgetMinutes,
      note: notes.trim() || 'Personal on-the-way errand',
      isPinned: true,
      coordinates: { lat: 19.018, lng: 72.842 },
    });

    setErrandTitle('');
    setLandmark('');
    setNotes('');
    setIsAddModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 space-y-6">
      {/* 1. PAGE HEADER STRIP */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--color-border)] pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="font-mono text-xs font-semibold text-[#8c5e03] uppercase tracking-wider flex items-center gap-1.5">
              <Compass className="w-4 h-4" />
              Zero Dead-Kilometers Engine
            </span>
            <span className="bg-[var(--color-bg-sunken)] text-[var(--color-ink)] border border-[var(--color-border)] font-mono text-[10px] font-semibold px-2.5 py-0.5 rounded-full">
              {wishlist.length} saved errands
            </span>
          </div>

          <h1 className="font-display font-bold text-3xl text-[var(--color-ink)]">
            On-The-Way Errand Wishlist
          </h1>
          <p className="font-body text-xs sm:text-sm text-[var(--color-ink-secondary)] mt-0.5 max-w-2xl">
            Add personal errands (buy shoes at Puma, pick up medicine, visit an ATM). RouteWala scans your delivery route and alerts you only when you are passing within your detour budget.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Settings Button */}
          <button
            type="button"
            onClick={() => setShowSettingsDrawer(!showSettingsDrawer)}
            className={`min-h-[44px] px-4 rounded-full border border-[var(--color-border)] font-body text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              showSettingsDrawer
                ? 'bg-[#F2B84B] text-[#1F2A27] border-[#E0A11B] font-bold shadow-sm'
                : 'bg-[var(--color-surface)] text-[var(--color-ink)] hover:bg-[var(--color-bg-sunken)]'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Alert Settings</span>
          </button>

          {/* Add Errand Button */}
          <Button
            variant="primary"
            size="md"
            onClick={() => setIsAddModalOpen(true)}
            icon={<Plus className="w-4 h-4" />}
          >
            Add Errand
          </Button>
        </div>
      </div>

      {/* 2. ON-THE-WAY SLIDE-IN PROMPT BANNER (IF ACTIVE) */}
      <OnTheWayPromptBanner />

      {/* 3. PIT-STOP RADAR ROW */}
      <PitstopRadarRow showSimulatorButton={true} />

      {/* 4. SETTINGS DRAWER / PANEL */}
      {showSettingsDrawer && (
        <div className="p-5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl shadow-sm space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-2.5">
            <span className="font-body font-bold text-xs text-[var(--color-ink)] uppercase tracking-wider flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-[var(--color-marigold)]" />
              On-The-Way Alert & Budget Configuration
            </span>
            <span className="font-mono text-[10px] text-[var(--color-sage-deep)] font-semibold">
              AUTOSAVED TO DEVICE
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-body text-xs">
            {/* Slider 1: Detour budget per errand */}
            <div className="p-3.5 bg-[var(--color-bg-sunken)] border border-[var(--color-border)] rounded-xl">
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-body font-semibold text-xs text-[var(--color-ink)]">
                  Detour Budget Per Errand
                </span>
                <span className="font-mono font-bold text-sm text-[#8c5e03]">
                  +{wishlistSettings.detourBudgetPerErrand} min
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={10}
                step={1}
                value={wishlistSettings.detourBudgetPerErrand}
                onChange={(e) =>
                  updateWishlistSettings({
                    detourBudgetPerErrand: Number(e.target.value),
                  })
                }
                className="w-full accent-[var(--color-marigold)] cursor-pointer"
              />
              <div className="flex justify-between font-mono text-[10px] text-[var(--color-ink-muted)] mt-1">
                <span>0m (Exact path)</span>
                <span>5m</span>
                <span>10m max</span>
              </div>
            </div>

            {/* Slider 2: Total Daily Budget */}
            <div className="p-3.5 bg-[var(--color-bg-sunken)] border border-[var(--color-border)] rounded-xl">
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-body font-semibold text-xs text-[var(--color-ink)]">
                  Total Daily Detour Cap
                </span>
                <span className="font-mono font-bold text-sm text-[var(--color-sage-deep)]">
                  {wishlistSettings.totalDailyDetourBudget} min total
                </span>
              </div>
              <input
                type="range"
                min={5}
                max={30}
                step={5}
                value={wishlistSettings.totalDailyDetourBudget}
                onChange={(e) =>
                  updateWishlistSettings({
                    totalDailyDetourBudget: Number(e.target.value),
                  })
                }
                className="w-full accent-[var(--color-sage-deep)] cursor-pointer"
              />
              <div className="flex justify-between font-mono text-[10px] text-[var(--color-ink-muted)] mt-1">
                <span>5m</span>
                <span>15m typical</span>
                <span>30m</span>
              </div>
            </div>

            {/* Slider 3: Max alerts per day */}
            <div className="p-3.5 bg-[var(--color-bg-sunken)] border border-[var(--color-border)] rounded-xl">
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-body font-semibold text-xs text-[var(--color-ink)]">
                  Max Alerts Per Day
                </span>
                <span className="font-mono font-bold text-sm text-[var(--color-ink)]">
                  {wishlistSettings.maxAlertsPerDay} alerts
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={5}
                step={1}
                value={wishlistSettings.maxAlertsPerDay}
                onChange={(e) =>
                  updateWishlistSettings({
                    maxAlertsPerDay: Number(e.target.value),
                  })
                }
                className="w-full accent-[var(--color-ink)] cursor-pointer"
              />
              <div className="flex justify-between font-mono text-[10px] text-[var(--color-ink-muted)] mt-1">
                <span>1 prompt</span>
                <span>3 normal</span>
                <span>5 max</span>
              </div>
            </div>
          </div>

          {/* Quiet mode toggle */}
          <div className="pt-2 border-t border-[var(--color-border)]">
            <Toggle
              id="quiet-mode-toggle"
              checked={wishlistSettings.quietModeMoving}
              onChange={(checked) =>
                updateWishlistSettings({ quietModeMoving: checked })
              }
              label="Quiet Mode While Moving (>25 km/h)"
              sublabel="Suppresses slide-in sound and popups when riding fast to prevent handlebar distractions"
            />
          </div>
        </div>
      )}

      {/* 5. CATEGORY FILTER CHIPS */}
      <div className="flex flex-wrap items-center gap-2">
        <Chip
          label="All Errands"
          count={wishlist.length}
          active={categoryFilter === 'all'}
          onClick={() => setCategoryFilter('all')}
        />
        <Chip
          label="Shopping / Retail"
          icon={<ShoppingBag className="w-3.5 h-3.5" />}
          count={wishlist.filter((w) => w.category === 'shop').length}
          active={categoryFilter === 'shop'}
          onClick={() => setCategoryFilter('shop')}
        />
        <Chip
          label="Pharmacy & Meds"
          icon={<Pill className="w-3.5 h-3.5" />}
          count={wishlist.filter((w) => w.category === 'pharmacy').length}
          active={categoryFilter === 'pharmacy'}
          onClick={() => setCategoryFilter('pharmacy')}
        />
        <Chip
          label="Cash / ATM"
          icon={<CreditCard className="w-3.5 h-3.5" />}
          count={wishlist.filter((w) => w.category === 'atm').length}
          active={categoryFilter === 'atm'}
          onClick={() => setCategoryFilter('atm')}
        />
        <Chip
          label="Snacks & Food"
          icon={<Utensils className="w-3.5 h-3.5" />}
          count={wishlist.filter((w) => w.category === 'food').length}
          active={categoryFilter === 'food'}
          onClick={() => setCategoryFilter('food')}
        />
        <Chip
          label="Petrol / Fuel"
          icon={<Fuel className="w-3.5 h-3.5" />}
          count={wishlist.filter((w) => w.category === 'fuel').length}
          active={categoryFilter === 'fuel'}
          onClick={() => setCategoryFilter('fuel')}
        />
        <Chip
          label="Washrooms"
          icon={<Droplets className="w-3.5 h-3.5" />}
          count={wishlist.filter((w) => w.category === 'restroom').length}
          active={categoryFilter === 'restroom'}
          onClick={() => setCategoryFilter('restroom')}
        />
      </div>

      {/* 6. ERRAND CARDS GRID */}
      {filteredItems.length === 0 ? (
        <EmptyState
          title={!categoryFilter || categoryFilter === 'all' ? 'Your Wishlist is Empty' : `No ${(categoryFilter || '').toUpperCase()} Errands Found`}
          description={
            categoryFilter === 'all'
              ? 'Add personal errands (buy shoes at Puma, pharmacy pickups, ATM visits). RouteWala will alert you when you pass nearby with minimal detour.'
              : `You don't have any saved errands in the "${categoryFilter}" category. Try selecting "All" or create a new errand.`
          }
          actionLabel="Add Personal Errand"
          onAction={() => setIsAddModalOpen(true)}
          illustrationType="scooter"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => {
            const isPinned = pinnedWishlistIds.includes(item.id);
            return (
              <div
                key={item.id}
                className={`p-5 rounded-2xl border bg-[var(--color-surface)] transition-all flex flex-col justify-between ${
                  isPinned
                    ? 'border-[var(--color-marigold)] ring-2 ring-[var(--color-marigold)]/20 shadow-md'
                    : 'border-[var(--color-border)] shadow-sm hover:border-[var(--color-border-strong)]'
                }`}
              >
                <div>
                  {/* Top Badge: Category & Detour Budget Pill */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-sunken)] flex items-center justify-center">
                        {getCategoryIconComponent(item.category)}
                      </div>
                      <span className="font-mono text-[10px] font-semibold uppercase text-[var(--color-ink-muted)]">
                        {item.category}
                      </span>
                    </div>

                    <span className="px-2.5 py-0.5 bg-[var(--color-marigold-tint)] border border-[var(--color-marigold)]/30 rounded-full font-mono text-[11px] font-semibold text-[#8c5e03]">
                      MAX +{item.detourBudgetMinutes}M DETOUR
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-base text-[var(--color-ink)] leading-snug mb-1">
                    {item.name}
                  </h3>

                  <div className="font-body text-xs text-[var(--color-ink-secondary)] mb-2">
                    {item.landmark} · <span className="font-semibold text-[var(--color-ink)]">{item.area}</span>
                  </div>

                  {/* Off-Route Distance Metric */}
                  <div className="p-2.5 bg-[var(--color-bg-sunken)] border border-[var(--color-border)] rounded-xl font-mono text-xs flex items-center justify-between mb-3">
                    <span className="text-[var(--color-ink-muted)]">Proximity:</span>
                    <span className="font-semibold text-[var(--color-ink)]">
                      ~{item.distanceOffRouteMeters}m off route (+{item.detourMinutes} min)
                    </span>
                  </div>

                  {item.note && (
                    <p className="font-body text-xs text-[var(--color-ink-muted)] italic mb-4">
                      "{item.note}"
                    </p>
                  )}
                </div>

                {/* Bottom Actions: Pin Toggle + Delete + Demo Simulator */}
                <div className="pt-3 border-t border-[var(--color-border)] flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => toggleWishlistPin(item.id)}
                    className={`flex-1 min-h-[42px] px-3 py-1.5 rounded-full border font-body text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      isPinned
                        ? 'bg-[var(--color-marigold)] text-[#1F2A27] font-bold border-[var(--color-marigold-hover)] shadow-sm'
                        : 'bg-[var(--color-surface)] hover:bg-[var(--color-bg-sunken)] border-[var(--color-border)] text-[var(--color-ink)]'
                    }`}
                  >
                    {isPinned ? (
                      <>
                        <Check className="w-4 h-4 stroke-[2.5]" />
                        <span>Pinned to Run</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        <span>Pin to Route</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => triggerMockOnTheWayPrompt(item)}
                    className="w-10 h-10 flex items-center justify-center border border-[var(--color-border)] rounded-full bg-[var(--color-surface)] hover:bg-[#1F2A27] hover:text-[#F2B84B] dark:hover:bg-[#2C2415] dark:hover:text-[#F2B84B] text-[var(--color-ink)] transition-colors cursor-pointer"
                    title="Simulate prompt banner for this errand"
                  >
                    <Sparkles className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => removeWishlistItem(item.id)}
                    className="w-10 h-10 flex items-center justify-center border border-[var(--color-border)] rounded-full bg-[var(--color-surface)] hover:bg-[var(--color-priority-high-bg)] hover:text-[var(--color-priority-high)] text-[var(--color-ink-secondary)] transition-colors cursor-pointer"
                    title="Delete errand"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 7. ADD ERRAND MODAL */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add On-The-Way Personal Errand"
        subtitle="No fixed time required · RouteWala will alert you when nearby"
        size="md"
      >
        <form onSubmit={handleCreateErrand} className="space-y-4">
          <div>
            <label className="block font-body font-semibold text-xs text-[var(--color-ink-secondary)] mb-1">
              What do you need to do? *
            </label>
            <input
              type="text"
              required
              value={errandTitle}
              onChange={(e) => setErrandTitle(e.target.value)}
              placeholder="e.g. Buy running shoes at Puma / Pick up BP tablets"
              className="w-full h-11 px-3.5 border border-[var(--color-border)] rounded-xl font-body text-sm bg-[var(--color-surface)] text-[var(--color-ink)] placeholder:text-[var(--color-ink-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-marigold)] transition-all"
            />
          </div>

          <div>
            <label className="block font-body font-semibold text-xs text-[var(--color-ink-secondary)] mb-1">
              Category *
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'shop' as ErrandCategory, label: 'Shopping', icon: ShoppingBag },
                { id: 'pharmacy' as ErrandCategory, label: 'Pharmacy', icon: Pill },
                { id: 'atm' as ErrandCategory, label: 'ATM / Cash', icon: CreditCard },
                { id: 'food' as ErrandCategory, label: 'Food / Snack', icon: Utensils },
                { id: 'fuel' as ErrandCategory, label: 'Fuel / Gas', icon: Fuel },
                { id: 'restroom' as ErrandCategory, label: 'Restroom', icon: Droplets },
              ].map((c) => {
                const Icon = c.icon;
                const isSelected = category === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setCategory(c.id)}
                    className={`h-11 px-2 rounded-xl border font-body text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[var(--color-marigold)] text-[#1F2A27] font-bold border-[#E0A11B] shadow-sm'
                        : 'bg-[var(--color-bg-sunken)] text-[var(--color-ink)] border-[var(--color-border)] hover:bg-[var(--color-surface)]'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span className="truncate">{c.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-body font-semibold text-xs text-[var(--color-ink-secondary)] mb-1">
                Specific Landmark / Store
              </label>
              <input
                type="text"
                value={landmark}
                onChange={(e) => setLandmark(e.target.value)}
                placeholder="e.g. Phoenix Palladium / Gokhale Rd"
                className="w-full h-11 px-3.5 border border-[var(--color-border)] rounded-xl font-body text-sm bg-[var(--color-surface)] text-[var(--color-ink)] placeholder:text-[var(--color-ink-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-marigold)] transition-all"
              />
            </div>

            <div>
              <label className="block font-body font-semibold text-xs text-[var(--color-ink-secondary)] mb-1">
                Area Corridor
              </label>
              <input
                type="text"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                placeholder="e.g. Lower Parel / Dadar"
                className="w-full h-11 px-3.5 border border-[var(--color-border)] rounded-xl font-body text-sm bg-[var(--color-surface)] text-[var(--color-ink)] placeholder:text-[var(--color-ink-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-marigold)] transition-all"
              />
            </div>
          </div>

          <div className="p-3.5 bg-[var(--color-bg-sunken)] border border-[var(--color-border)] rounded-xl">
            <div className="flex items-center justify-between mb-1">
              <span className="font-body font-semibold text-xs text-[var(--color-ink)]">
                Detour Budget for this item
              </span>
              <span className="font-mono font-bold text-sm text-[#8c5e03]">
                Max +{detourBudgetMinutes} min detour
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={10}
              step={1}
              value={detourBudgetMinutes}
              onChange={(e) => setDetourBudgetMinutes(Number(e.target.value))}
              className="w-full accent-[var(--color-marigold)] cursor-pointer"
            />
            <span className="font-body text-[11px] text-[var(--color-ink-muted)] mt-1 block">
              RouteWala will only alert you if the store is reachable under this time budget.
            </span>
          </div>

          <div>
            <label className="block font-body font-semibold text-xs text-[var(--color-ink-secondary)] mb-1">
              Personal Note / Checklist (Optional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Size UK 9, keep order receipt ready"
              className="w-full h-11 px-3.5 border border-[var(--color-border)] rounded-xl font-body text-sm bg-[var(--color-surface)] text-[var(--color-ink)] placeholder:text-[var(--color-ink-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-marigold)] transition-all"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <Button variant="secondary" size="md" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="md" type="submit">
              Save to Errand Wishlist
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};