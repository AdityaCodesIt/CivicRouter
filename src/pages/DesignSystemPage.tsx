import React, { useState } from 'react';
import { Button } from '../components/common/Button';
import { PriorityBadge } from '../components/common/PriorityBadge';
import { StopCard } from '../components/common/StopCard';
import { Chip } from '../components/common/Chip';
import { Toggle } from '../components/common/Toggle';
import { Modal } from '../components/common/Modal';
import { EmptyState } from '../components/common/EmptyState';
import { DeliveryStop } from '../data/mockStops';
import {
  Palette,
  Type,
  Layers,
  Component,
  Plus,
  ArrowRight,
  Trash2,
} from 'lucide-react';

export const DesignSystemPage: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [toggleState1, setToggleState1] = useState(true);
  const [toggleState2, setToggleState2] = useState(false);
  const [activeChip, setActiveChip] = useState('all');

  // Sample stop for card demo
  const sampleStop: DeliveryStop = {
    id: 'demo-stop',
    order: 3,
    recipientName: 'Kunal Singhania (TechFin Corp)',
    phone: '+91 98334 11209',
    address: 'Tower 4, 11th Floor, One World Center, Senapati Bapat Marg',
    area: 'Lower Parel',
    landmark: 'Opposite High Street Phoenix entrance',
    priority: 'high',
    type: 'drop',
    deadline: '01:45 PM',
    parcelCount: 3,
    codAmount: 1250,
    status: 'pending',
    etaMinutes: 38,
    distanceKm: 7.2,
    notes: 'ID proof needed at security reception gate 3',
    coordinates: { lat: 18.9953, lng: 72.8288 },
  };

  const [completedDemo, setCompletedDemo] = useState(false);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-12">
      {/* Page Header */}
      <div className="border-b border-[var(--color-border)] pb-6">
        <div className="flex items-center gap-2 text-xs font-mono font-semibold text-[var(--color-ink-muted)] uppercase tracking-wider mb-2">
          <Component className="w-4 h-4 text-[var(--color-marigold)]" />
          <span>RouteWala Design Specification</span>
        </div>
        <h1 className="font-display font-bold text-3xl sm:text-4xl text-[var(--color-ink)]">
          "Soft Mumbai Morning" Design System
        </h1>
        <p className="font-body text-base text-[var(--color-ink-secondary)] max-w-2xl mt-1 leading-relaxed">
          Warm, calm, human, and trustworthy. Soft paper canvas #FAF6EF, morning haze contrast, marigold #F2B84B accents, sage #A9C4B0, soft ticket stubs, and 56px touch ergonomics.
        </p>
      </div>

      {/* 1. COLOR TOKENS */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <Palette className="w-5 h-5 text-[var(--color-ink)]" />
          <h2 className="font-display font-bold text-2xl text-[var(--color-ink)]">
            01. Color Palette Tokens
          </h2>
        </div>
        <p className="font-body text-sm text-[var(--color-ink-secondary)] mb-6">
          Soft morning tones paired with gentle ink contrast adhering to WCAG AA guidelines.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
          {[
            { name: 'Paper Cream', hex: '#FAF6EF', bg: 'bg-[#FAF6EF]', text: 'text-[#1F2A27]', role: 'Background Canvas' },
            { name: 'Raised Surface', hex: '#FFFDF9', bg: 'bg-[#FFFDF9]', text: 'text-[#1F2A27]', role: 'Cards & Sheets' },
            { name: 'Gentle Ink', hex: '#1F2A27', bg: 'bg-[#1F2A27]', text: 'text-white', role: 'Headlines & Body' },
            { name: 'Marigold', hex: '#F2B84B', bg: 'bg-[#F2B84B]', text: 'text-[#1F2A27]', role: 'Primary Accent & CTAs' },
            { name: 'Sage Green', hex: '#A9C4B0', bg: 'bg-[#A9C4B0]', text: 'text-[#1F2A27]', role: 'Optimal & Completed' },
            { name: 'Dusty Sky', hex: '#A8C5DA', bg: 'bg-[#A8C5DA]', text: 'text-[#1F2A27]', role: 'Secondary Accent' },
            { name: 'Terracotta', hex: '#D9604C', bg: 'bg-[#D9604C]', text: 'text-white', role: 'High Priority Urgency' },
          ].map((c) => (
            <div
              key={c.name}
              className="border border-[var(--color-border)] rounded-2xl shadow-sm overflow-hidden bg-[var(--color-surface)]"
            >
              <div className={`h-20 ${c.bg} flex items-center justify-center p-2 border-b border-[var(--color-border)]`}>
                <span className={`font-mono font-bold text-xs ${c.text}`}>{c.hex}</span>
              </div>
              <div className="p-3">
                <div className="font-body font-bold text-xs text-[var(--color-ink)]">{c.name}</div>
                <div className="font-body text-[11px] text-[var(--color-ink-muted)] mt-0.5">{c.role}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 2. TYPOGRAPHY TOKENS */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <Type className="w-5 h-5 text-[var(--color-ink)]" />
          <h2 className="font-display font-bold text-2xl text-[var(--color-ink)]">
            02. Self-Hosted Typography Scale
          </h2>
        </div>

        <div className="border border-[var(--color-border)] rounded-2xl shadow-sm bg-[var(--color-surface)] p-6 space-y-6">
          <div className="border-b border-[var(--color-border)] pb-4">
            <span className="font-mono text-xs font-semibold text-[var(--color-ink-muted)] uppercase">
              Display & Headings: Fraunces (Variable, 500–700)
            </span>
            <div className="font-display font-bold text-3xl sm:text-4xl text-[var(--color-ink)] mt-1">
              Dadar Central → Lower Parel Corridor
            </div>
          </div>

          <div className="border-b border-[var(--color-border)] pb-4">
            <span className="font-mono text-xs font-semibold text-[var(--color-ink-muted)] uppercase">
              Body & UI: Figtree (400–700)
            </span>
            <p className="font-body text-base text-[var(--color-ink-secondary)] mt-1 max-w-2xl leading-relaxed">
              Turn 15 chaotic WhatsApp delivery addresses into a sequenced, prioritized run. With on-the-way chai and vada pav stops that never add dead kilometers.
            </p>
          </div>

          <div className="border-b border-[var(--color-border)] pb-4">
            <span className="font-mono text-xs font-semibold text-[var(--color-ink-muted)] uppercase">
              Numerals & Data: DM Mono (400, 500 with tabular numbers)
            </span>
            <div className="font-mono font-medium text-lg text-[var(--color-ink)] mt-1 flex flex-wrap gap-6 tabular-nums">
              <span>STOP: #04</span>
              <span>ETA: +38m</span>
              <span>DIST: 7.2 KM</span>
              <span>COD: ₹1,250</span>
            </div>
          </div>

          <div>
            <span className="font-mono text-xs font-semibold text-[var(--color-ink-muted)] uppercase">
              Hindi & Marathi: Noto Serif / Sans Devanagari (1.6 line-height)
            </span>
            <div className="font-devanagari text-lg text-[var(--color-ink)] mt-1 leading-[1.6]">
              मुंबई डिलिव्हरी रूट प्लॅनर · वेळेवर वितरण आणि योग्य मार्गदर्शन
            </div>
          </div>
        </div>
      </section>

      {/* 3. SHAPE LANGUAGE & SOFT TICKET STUB */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <Layers className="w-5 h-5 text-[var(--color-ink)]" />
          <h2 className="font-display font-bold text-2xl text-[var(--color-ink)]">
            03. Shape Language & Ticket Stubs
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 border border-[var(--color-border)] rounded-2xl shadow-sm bg-[var(--color-surface)]">
            <div className="font-mono text-xs font-semibold text-[var(--color-ink-muted)] uppercase mb-2">
              WARM LAYERED SHADOW
            </div>
            <div className="font-display font-bold text-lg mb-2 text-[var(--color-ink)]">rgba(60, 45, 20, 0.08)</div>
            <p className="font-body text-xs text-[var(--color-ink-secondary)] leading-relaxed">
              Soft, layered, warm tinted shadow with zero harsh pure-black outlines. Gives depth like layered paper.
            </p>
          </div>

          <div className="soft-card ticket-stub p-5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl shadow-sm">
            <div className="font-mono text-xs font-semibold text-[var(--color-ink-muted)] uppercase mb-2">
              SOFT TICKET NOTCHES
            </div>
            <div className="font-display font-bold text-lg mb-2 text-[var(--color-ink)]">Circular Cutouts</div>
            <p className="font-body text-xs text-[var(--color-ink-secondary)] leading-relaxed">
              Curved pseudo-element notches on the left edge echoing physical parcel receipt stubs and bus tickets.
            </p>
          </div>

          <div className="p-5 border border-[var(--color-border)] rounded-2xl shadow-sm bg-[var(--color-surface)]">
            <div className="font-mono text-xs font-semibold text-[var(--color-ink-muted)] uppercase mb-2">
              PILL RADIUS SYSTEM
            </div>
            <div className="font-display font-bold text-lg mb-2 text-[var(--color-ink)]">rounded-full & 16px Cards</div>
            <p className="font-body text-xs text-[var(--color-ink-secondary)] leading-relaxed">
              Tactile, smooth, organic shapes designed for comfortable one-handed thumbs on mobile bikes.
            </p>
          </div>
        </div>
      </section>

      {/* 4. COMPONENT LIBRARY SANDBOX */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <Component className="w-5 h-5 text-[var(--color-ink)]" />
          <h2 className="font-display font-bold text-2xl text-[var(--color-ink)]">
            04. Component Library Sandbox
          </h2>
        </div>

        {/* Buttons */}
        <div className="border border-[var(--color-border)] rounded-2xl shadow-sm bg-[var(--color-surface)] p-6 mb-8">
          <div className="font-mono text-xs font-semibold text-[var(--color-ink-muted)] uppercase mb-4">
            BUTTON VARIANTS (Pill shapes with ripple press)
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <Button variant="primary" icon={<Plus className="w-5 h-5" />}>
              Primary Marigold (56px)
            </Button>
            <Button variant="secondary" icon={<ArrowRight className="w-5 h-5" />}>
              Secondary Outline
            </Button>
            <Button variant="danger" icon={<Trash2 className="w-5 h-5" />}>
              Danger Action
            </Button>
            <Button variant="ghost">Ghost Button</Button>
            <Button variant="primary" size="sm">
              Small (36px)
            </Button>
            <Button variant="primary" disabled>
              Disabled
            </Button>
          </div>
        </div>

        {/* Priority Badges with Distinct Geometric Shapes & Icons */}
        <div className="border border-[var(--color-border)] rounded-2xl shadow-sm bg-[var(--color-surface)] p-6 mb-8">
          <div className="font-mono text-xs font-semibold text-[var(--color-ink-muted)] uppercase mb-2">
            PRIORITY BADGES (Color + Icon + Shape)
          </div>
          <p className="font-body text-xs text-[var(--color-ink-secondary)] mb-4">
            High (Flame / Terracotta), Medium (CircleDot / Marigold), Low (Circle / Sage). Accessible for color-blind riders.
          </p>
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-3">
              <PriorityBadge priority="high" size="lg" />
              <PriorityBadge priority="high" size="md" />
              <PriorityBadge priority="high" size="sm" />
            </div>

            <div className="flex items-center gap-3">
              <PriorityBadge priority="medium" size="lg" />
              <PriorityBadge priority="medium" size="md" />
              <PriorityBadge priority="medium" size="sm" />
            </div>

            <div className="flex items-center gap-3">
              <PriorityBadge priority="low" size="lg" />
              <PriorityBadge priority="low" size="md" />
              <PriorityBadge priority="low" size="sm" />
            </div>
          </div>
        </div>

        {/* StopCard Demo */}
        <div className="border border-[var(--color-border)] rounded-2xl shadow-sm bg-[var(--color-surface)] p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="font-mono text-xs font-semibold text-[var(--color-ink-muted)] uppercase">
              STOPCARD COMPONENT (Ticket-stub with swipe-to-delete)
            </div>
            <button
              onClick={() => setCompletedDemo(!completedDemo)}
              className="font-body text-xs font-semibold text-[#8c5e03] underline cursor-pointer"
            >
              Toggle Delivered State ({completedDemo ? 'Completed' : 'Pending'})
            </button>
          </div>

          <div className="max-w-xl">
            <StopCard
              stop={{
                ...sampleStop,
                status: completedDemo ? 'completed' : 'pending',
              }}
              isCurrent={!completedDemo}
              onComplete={() => setCompletedDemo(true)}
            />
          </div>
        </div>

        {/* Interactive Chips & Toggles */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Chips */}
          <div className="border border-[var(--color-border)] rounded-2xl shadow-sm bg-[var(--color-surface)] p-6">
            <div className="font-mono text-xs font-semibold text-[var(--color-ink-muted)] uppercase mb-4">
              INTERACTIVE CHIPS
            </div>
            <div className="flex flex-wrap gap-2">
              <Chip
                label="All Drops"
                count={14}
                active={activeChip === 'all'}
                onClick={() => setActiveChip('all')}
              />
              <Chip
                label="Urgent High"
                count={3}
                active={activeChip === 'high'}
                onClick={() => setActiveChip('high')}
              />
              <Chip
                label="Chai Pitstops"
                count={4}
                active={activeChip === 'pitstops'}
                onClick={() => setActiveChip('pitstops')}
              />
              <Chip
                label="Dadar Corridor"
                count={6}
                active={activeChip === 'dadar'}
                onClick={() => setActiveChip('dadar')}
              />
            </div>
          </div>

          {/* Toggles */}
          <div className="border border-[var(--color-border)] rounded-2xl shadow-sm bg-[var(--color-surface)] p-6">
            <div className="font-mono text-xs font-semibold text-[var(--color-ink-muted)] uppercase mb-2">
              TOGGLE SWITCHES
            </div>
            <div className="space-y-3">
              <Toggle
                id="toggle-demo-1"
                checked={toggleState1}
                onChange={setToggleState1}
                label="High-Contrast Sunlight Mode"
                sublabel="Maximizes border weight and turns backgrounds pure white for midday riding"
              />
              <Toggle
                id="toggle-demo-2"
                checked={toggleState2}
                onChange={setToggleState2}
                label="Audio Milestone Alert"
                sublabel="Chimes when approaching within 200m of a pinned pitstop"
              />
            </div>
          </div>
        </div>

        {/* Modal / BottomSheet Trigger */}
        <div className="border border-[var(--color-border)] rounded-2xl shadow-sm bg-[var(--color-surface)] p-6 mb-8">
          <div className="font-mono text-xs font-semibold text-[var(--color-ink-muted)] uppercase mb-2">
            MODAL & MOBILE BOTTOM SHEET
          </div>
          <p className="font-body text-xs text-[var(--color-ink-secondary)] mb-4">
            Slides up from bottom on mobile; centers with warm blur dialog on desktop.
          </p>
          <Button variant="secondary" onClick={() => setModalOpen(true)}>
            Open Sample Transit Dialog
          </Button>

          <Modal
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            title="Confirm Express Reordering"
            subtitle="Corridor optimization will shift Stop #03 to First"
            footer={
              <>
                <Button variant="secondary" size="md" onClick={() => setModalOpen(false)}>
                  Cancel
                </Button>
                <Button variant="primary" size="md" onClick={() => setModalOpen(false)}>
                  Confirm Reorder
                </Button>
              </>
            }
          >
            <p className="text-sm text-[var(--color-ink-secondary)] mb-3 leading-relaxed">
              RouteWala detected an urgent prescription medicine at <strong className="text-[var(--color-ink)]">Kothari Heights, Dadar West</strong> that has a 11:30 AM deadline.
            </p>
            <div className="p-3 bg-[var(--color-bg-sunken)] border border-[var(--color-border)] rounded-xl font-mono text-xs text-[#8c5e03] font-semibold">
              ESTIMATED TIME SAVED: 18 MINUTES
            </div>
          </Modal>
        </div>

        {/* Empty State Demo */}
        <div className="border border-[var(--color-border)] rounded-2xl shadow-sm bg-[var(--color-surface)] p-6">
          <div className="font-mono text-xs font-semibold text-[var(--color-ink-muted)] uppercase mb-4">
            EMPTY STATE COMPONENT
          </div>
          <EmptyState
            title="No Pending Deliveries in Manifest"
            description="Add your first delivery parcel or import from WhatsApp to begin sequencing your day."
            actionLabel="Add First Stop"
            onAction={() => alert('Quick Add triggered!')}
            illustrationType="clipboard"
          />
        </div>
      </section>
    </div>
  );
};