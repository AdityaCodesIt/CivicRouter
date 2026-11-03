import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRoute } from '../context/RouteContext';
import { Button } from '../components/common/Button';
import { StopCard } from '../components/common/StopCard';
import { EmptyState } from '../components/common/EmptyState';
import { MapPickerModal } from '../components/plan/MapPickerModal';
import { PasteListModal } from '../components/plan/PasteListModal';
import { EditStopBottomSheet } from '../components/plan/EditStopBottomSheet';
import {
  DeliveryStop,
  PriorityLevel,
  StopType,
  mumbaiPlacesDatabase,
  MumbaiPlaceSuggestion,
  quickAddLandmarks,
} from '../data/mockStops';
import {
  Plus,
  Sparkles,
  MapPin,
  Clipboard,
  Building,
  Clock,
  Phone,
  IndianRupee,
  Search,
  ArrowDownRight,
  ArrowUpRight,
  Flame,
  CircleDot,
  Circle,
} from 'lucide-react';

export const PlanPage: React.FC = () => {
  const {
    stops,
    addStop,
    addMultipleStops,
    removeStop,
    updateStop,
    reorderStops,
    loadDemoDay,
    optimizeRoute,
    stats,
    t,
  } = useRoute();

  const navigate = useNavigate();

  // Form State
  const [recipient, setRecipient] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [area, setArea] = useState('Dadar West');
  const [landmark, setLandmark] = useState('');
  const [priority, setPriority] = useState<PriorityLevel>('medium');
  const [type, setType] = useState<StopType>('drop');
  const [deadline, setDeadline] = useState('');
  const [codAmount, setCodAmount] = useState<number | ''>('');
  const [notes, setNotes] = useState('');
  const [parcels, setParcels] = useState(1);
  const [coords, setCoords] = useState<{ lat: number; lng: number }>({
    lat: 19.0178,
    lng: 72.8428,
  });

  // Autocomplete state
  const [addressQuery, setAddressQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const autocompleteRef = useRef<HTMLDivElement>(null);

  // Modals state
  const [isMapPickerOpen, setIsMapPickerOpen] = useState(false);
  const [isPasteModalOpen, setIsPasteModalOpen] = useState(false);
  const [editingStop, setEditingStop] = useState<DeliveryStop | null>(null);
  const [demoLoadedNotification, setDemoLoadedNotification] = useState(false);

  // Drag and drop state
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  // Filter autocomplete suggestions based on query
  const suggestions = mumbaiPlacesDatabase.filter((place) => {
    if (!addressQuery.trim()) return false;
    const q = addressQuery.toLowerCase();
    return (
      place.name.toLowerCase().includes(q) ||
      place.address.toLowerCase().includes(q) ||
      place.area.toLowerCase().includes(q) ||
      place.landmark.toLowerCase().includes(q)
    );
  });

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (autocompleteRef.current && !autocompleteRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectSuggestion = (place: MumbaiPlaceSuggestion) => {
    setAddress(place.address);
    setAddressQuery(place.name);
    setArea(place.area);
    setLandmark(place.landmark);
    setCoords({ lat: place.lat, lng: place.lng });
    if (!recipient.trim()) {
      setRecipient(place.name);
    }
    setShowSuggestions(false);
  };

  const handleMapPinSelected = (loc: {
    name: string;
    address: string;
    area: string;
    landmark: string;
    coordinates: { lat: number; lng: number };
  }) => {
    setAddress(loc.address);
    setAddressQuery(loc.name);
    setArea(loc.area);
    setLandmark(loc.landmark);
    setCoords(loc.coordinates);
    if (!recipient.trim()) {
      setRecipient(loc.name);
    }
  };

  const handleAddStopSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipient.trim() || !address.trim()) return;

    addStop({
      recipientName: recipient.trim(),
      phone: phone.trim() || '+91 98200 ' + Math.floor(10000 + Math.random() * 90000),
      address: address.trim(),
      area: area.trim() || 'Mumbai Central',
      landmark: landmark.trim() || 'Near local junction',
      priority,
      type,
      parcelCount: Number(parcels) || 1,
      deadline: deadline.trim() || undefined,
      codAmount: typeof codAmount === 'number' && codAmount > 0 ? codAmount : 0,
      notes: notes.trim() || undefined,
      etaMinutes: 20 + stops.length * 12,
      distanceKm: Number((2.5 + stops.length * 2.1).toFixed(1)),
      coordinates: coords,
    });

    // Reset Form
    setRecipient('');
    setPhone('');
    setAddress('');
    setAddressQuery('');
    setLandmark('');
    setDeadline('');
    setCodAmount('');
    setNotes('');
  };

  const handleQuickAdd = (lm: typeof quickAddLandmarks[0]) => {
    addStop({
      recipientName: `Drop at ${lm.name}`,
      phone: '+91 98200 ' + Math.floor(10000 + Math.random() * 90000),
      address: `Courier Bay, ${lm.name}`,
      area: lm.area,
      landmark: `Main delivery reception point`,
      priority: 'medium',
      type: 'drop',
      parcelCount: 1,
      codAmount: 0,
      etaMinutes: 25,
      distanceKm: 3.5,
      coordinates: { lat: lm.lat, lng: lm.lng },
    });
  };

  const handleLoadDemoDay = () => {
    loadDemoDay();
    setDemoLoadedNotification(true);
    setTimeout(() => setDemoLoadedNotification(false), 2500);
  };

  // Drag and Drop handlers
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

  const handleMoveUp = (index: number) => {
    if (index > 0) {
      reorderStops(index, index - 1);
    }
  };

  const handleMoveDown = (index: number) => {
    if (index < stops.length - 1) {
      reorderStops(index, index + 1);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 pb-28 md:pb-16">
      {/* 1. TOP HEADER & COUNTER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--color-border)] pb-5 mb-6">
        <div>
          {/* Manifest Count Badge */}
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="px-3 py-1 bg-[var(--color-surface)] text-[var(--color-ink)] font-mono text-xs font-semibold uppercase rounded-full border border-[var(--color-border)] shadow-sm">
              {stops.length} STOPS · {stats.highPriorityCount} HIGH PRIORITY
            </span>

            {demoLoadedNotification && (
              <span className="px-3 py-1 bg-[var(--color-sage-tint)] text-[var(--color-sage-deep)] border border-[var(--color-sage)] font-body text-xs font-semibold rounded-full animate-in fade-in">
                ✓ 8 Mumbai Stops Loaded!
              </span>
            )}
          </div>

          <h1 className="font-display font-bold text-2xl sm:text-3xl text-[var(--color-ink)]">
            Multi-Stop Manifest & Input
          </h1>
          <p className="font-body text-xs sm:text-sm text-[var(--color-ink-secondary)] mt-0.5">
            Type with Mumbai autocomplete, drop a map pin, or paste a WhatsApp list. Reorder and set priorities before dispatching.
          </p>
        </div>

        {/* Action Buttons: Try Demo Day & Paste List & Drop Pin */}
        <div className="grid grid-cols-3 gap-2 w-full sm:w-auto sm:flex sm:items-center sm:gap-2.5">
          <Button
            variant="primary"
            size="md"
            onClick={handleLoadDemoDay}
            icon={<Sparkles className="w-4 h-4 text-[#1F2A27]" />}
          >
            <span className="truncate">Demo Day</span>
          </Button>

          <Button
            variant="secondary"
            size="md"
            onClick={() => setIsPasteModalOpen(true)}
            icon={<Clipboard className="w-4 h-4" />}
          >
            <span className="truncate">Paste List</span>
          </Button>

          <Button
            variant="secondary"
            size="md"
            onClick={() => setIsMapPickerOpen(true)}
            icon={<MapPin className="w-4 h-4 text-[var(--color-priority-high)]" />}
          >
            <span className="truncate">Drop Pin</span>
          </Button>
        </div>
      </div>

      {/* 2. QUICK ADD MUMBAI HUBS STRIP */}
      <div className="mb-6">
        <div className="font-body text-xs font-semibold text-[var(--color-ink-muted)] uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Building className="w-3.5 h-3.5 text-[var(--color-ink-muted)]" />
          <span>Quick Add Popular Mumbai Hubs:</span>
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap">
          {quickAddLandmarks.map((lm) => (
            <button
              key={lm.name}
              type="button"
              onClick={() => handleQuickAdd(lm)}
              className="px-3 py-1.5 bg-[var(--color-surface)] hover:bg-[var(--color-marigold-tint)] border border-[var(--color-border)] rounded-full font-body text-xs font-medium text-[var(--color-ink)] shadow-sm hover:border-[var(--color-marigold)] transition-all cursor-pointer flex items-center gap-1 active:scale-95 shrink-0 whitespace-nowrap"
            >
              <Plus className="w-3 h-3 text-[var(--color-marigold)]" />
              <span>{lm.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 3. TWO-PANE LAYOUT: INPUT FORM (LEFT) & DRAGGABLE STOPCARDS LIST (RIGHT) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT PANE: INPUT FORM */}
        <div className="lg:col-span-5 soft-card bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl shadow-sm p-5 sm:p-6">
          <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-3 mb-4">
            <span className="font-body font-bold text-xs text-[var(--color-ink)] uppercase tracking-wider">
              Add Single Stop
            </span>
            <span className="font-mono text-xs text-[var(--color-ink-muted)]">
              Corridor: South-Central Run
            </span>
          </div>

          <form onSubmit={handleAddStopSubmit} className="space-y-4">
            {/* Pickup vs Drop Type Selector */}
            <div>
              <label className="block font-body font-semibold text-xs text-[var(--color-ink-muted)] uppercase mb-1.5">
                Stop Type *
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setType('drop')}
                  className={`h-11 px-3 rounded-xl border font-body font-semibold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    type === 'drop'
                      ? 'bg-[#E3EEE6] dark:bg-[#1E2B25] text-[#4F7A66] dark:text-[#A9C4B0] border-[#4F7A66] dark:border-[#A9C4B0] font-bold shadow-sm'
                      : 'bg-[var(--color-surface)] text-[var(--color-ink-secondary)] border-[var(--color-border)] hover:bg-[var(--color-bg-sunken)]'
                  }`}
                >
                  <ArrowDownRight className={`w-4 h-4 ${type === 'drop' ? 'text-[#4F7A66] dark:text-[#A9C4B0]' : 'text-[var(--color-ink-muted)]'}`} />
                  <span>Delivery / Drop</span>
                </button>

                <button
                  type="button"
                  onClick={() => setType('pickup')}
                  className={`h-11 px-3 rounded-xl border font-body font-semibold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    type === 'pickup'
                      ? 'bg-[#FBEBC6] dark:bg-[#2C2415] text-[#8c5e03] dark:text-[#F2B84B] border-[#8c5e03] dark:border-[#F2B84B] font-bold shadow-sm'
                      : 'bg-[var(--color-surface)] text-[var(--color-ink-secondary)] border-[var(--color-border)] hover:bg-[var(--color-bg-sunken)]'
                  }`}
                >
                  <ArrowUpRight className={`w-4 h-4 ${type === 'pickup' ? 'text-[#8c5e03] dark:text-[#F2B84B]' : 'text-[var(--color-ink-muted)]'}`} />
                  <span>Pickup / Return</span>
                </button>
              </div>
            </div>

            {/* Recipient / Business Name */}
            <div>
              <label className="block font-body font-semibold text-xs text-[var(--color-ink-muted)] uppercase mb-1">
                Recipient / Firm Name *
              </label>
              <input
                type="text"
                required
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="e.g. Dr. Suresh Mehta / WeWork Reception"
                className="w-full h-11 px-3.5 border border-[var(--color-border)] rounded-xl font-body text-sm bg-[var(--color-surface)] text-[var(--color-ink)] placeholder:text-[var(--color-ink-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-marigold)] focus:border-transparent transition-all"
              />
            </div>

            {/* Address with Mock Autocomplete */}
            <div className="relative" ref={autocompleteRef}>
              <div className="flex items-center justify-between mb-1">
                <label className="block font-body font-semibold text-xs text-[var(--color-ink-muted)] uppercase">
                  Address / Search Location *
                </label>
                <button
                  type="button"
                  onClick={() => setIsMapPickerOpen(true)}
                  className="font-body text-xs font-semibold text-[#8c5e03] hover:underline flex items-center gap-1"
                >
                  <MapPin className="w-3 h-3 text-[var(--color-priority-high)]" />
                  <span>Drop Pin on Map</span>
                </button>
              </div>

              <div className="relative">
                <input
                  type="text"
                  required
                  value={addressQuery}
                  onChange={(e) => {
                    setAddressQuery(e.target.value);
                    setAddress(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  placeholder="Type landmark or street (e.g. Dadar Portuguese, BKC Jio, Lower Parel)"
                  className="w-full h-11 pl-10 pr-3.5 border border-[var(--color-border)] rounded-xl font-body text-sm bg-[var(--color-surface)] text-[var(--color-ink)] placeholder:text-[var(--color-ink-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-marigold)] focus:border-transparent transition-all"
                />
                <Search className="w-4 h-4 text-[var(--color-ink-muted)] absolute left-3.5 top-3.5" />
              </div>

              {/* Autocomplete Dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute left-0 right-0 top-full mt-1 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl shadow-lg z-30 max-h-56 overflow-y-auto">
                  <div className="p-2 bg-[var(--color-bg-sunken)] text-[var(--color-ink-muted)] font-mono text-[10px] font-semibold uppercase border-b border-[var(--color-border)]">
                    Mumbai Locality Autocomplete ({suggestions.length} matches)
                  </div>
                  {suggestions.map((place) => (
                    <div
                      key={place.name}
                      onClick={() => handleSelectSuggestion(place)}
                      className="p-3 hover:bg-[var(--color-marigold-tint)] border-b border-[var(--color-border)] last:border-b-0 cursor-pointer transition-colors"
                    >
                      <div className="font-body font-semibold text-xs text-[var(--color-ink)]">{place.name}</div>
                      <div className="font-body text-[11px] text-[var(--color-ink-secondary)]">
                        {place.address} · {place.landmark} ({place.area})
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Area & Landmark */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-body font-semibold text-xs text-[var(--color-ink-muted)] uppercase mb-1">
                  Area / Zone *
                </label>
                <input
                  type="text"
                  required
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  placeholder="e.g. Dadar West"
                  className="w-full h-11 px-3.5 border border-[var(--color-border)] rounded-xl font-body text-sm bg-[var(--color-surface)] text-[var(--color-ink)] placeholder:text-[var(--color-ink-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-marigold)] focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block font-body font-semibold text-xs text-[var(--color-ink-muted)] uppercase mb-1">
                  Landmark
                </label>
                <input
                  type="text"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  placeholder="e.g. Opp. Plaza Cinema"
                  className="w-full h-11 px-3.5 border border-[var(--color-border)] rounded-xl font-body text-sm bg-[var(--color-surface)] text-[var(--color-ink)] placeholder:text-[var(--color-ink-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-marigold)] focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Priority Selector (3 Distinct Buttons with Icon + Shape) */}
            <div>
              <label className="block font-body font-semibold text-xs text-[var(--color-ink-muted)] uppercase mb-1.5">
                Priority Tier *
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPriority('high')}
                  className={`min-h-[50px] p-2 rounded-xl border font-body text-xs font-semibold transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5 ${
                    priority === 'high'
                      ? 'bg-[var(--color-priority-high-bg)] text-[var(--color-priority-high)] border-[var(--color-priority-high)] ring-2 ring-[var(--color-priority-high)]/20 shadow-sm'
                      : 'bg-[var(--color-surface)] text-[var(--color-ink-secondary)] border-[var(--color-border)] hover:bg-[var(--color-bg-sunken)]'
                  }`}
                >
                  <div className="flex items-center gap-1 font-bold">
                    <Flame className="w-3.5 h-3.5 fill-current" />
                    <span>High</span>
                  </div>
                  <span className="text-[10px] opacity-80 font-normal">Urgent</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPriority('medium')}
                  className={`min-h-[50px] p-2 rounded-xl border font-body text-xs font-semibold transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5 ${
                    priority === 'medium'
                      ? 'bg-[var(--color-priority-med-bg)] text-[#8c5e03] border-[var(--color-priority-med)] ring-2 ring-[var(--color-priority-med)]/20 shadow-sm'
                      : 'bg-[var(--color-surface)] text-[var(--color-ink-secondary)] border-[var(--color-border)] hover:bg-[var(--color-bg-sunken)]'
                  }`}
                >
                  <div className="flex items-center gap-1 font-bold">
                    <CircleDot className="w-3.5 h-3.5 fill-current" />
                    <span>Medium</span>
                  </div>
                  <span className="text-[10px] opacity-80 font-normal">Scheduled</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPriority('low')}
                  className={`min-h-[50px] p-2 rounded-xl border font-body text-xs font-semibold transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5 ${
                    priority === 'low'
                      ? 'bg-[var(--color-priority-low-bg)] text-[var(--color-priority-low)] border-[var(--color-priority-low)] ring-2 ring-[var(--color-priority-low)]/20 shadow-sm'
                      : 'bg-[var(--color-surface)] text-[var(--color-ink-secondary)] border-[var(--color-border)] hover:bg-[var(--color-bg-sunken)]'
                  }`}
                >
                  <div className="flex items-center gap-1 font-bold">
                    <Circle className="w-3.5 h-3.5" />
                    <span>Low</span>
                  </div>
                  <span className="text-[10px] opacity-80 font-normal">Flexible</span>
                </button>
              </div>
            </div>

            {/* Optional Fields: Deadline Time Picker & Customer Phone */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-body font-semibold text-xs text-[var(--color-ink-muted)] uppercase mb-1 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[var(--color-ink-muted)]" />
                  <span>Deadline Time</span>
                </label>
                <input
                  type="text"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  placeholder="e.g. 01:30 PM"
                  className="w-full h-11 px-3.5 border border-[var(--color-border)] rounded-xl font-mono text-xs bg-[var(--color-surface)] text-[var(--color-ink)] placeholder:text-[var(--color-ink-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-marigold)] focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block font-body font-semibold text-xs text-[var(--color-ink-muted)] uppercase mb-1 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-[var(--color-ink-muted)]" />
                  <span>Phone Number</span>
                </label>
                <input
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98200 XXXXX"
                  className="w-full h-11 px-3.5 border border-[var(--color-border)] rounded-xl font-mono text-sm bg-[var(--color-surface)] text-[var(--color-ink)] placeholder:text-[var(--color-ink-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-marigold)] focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Optional COD Amount & Parcel Count */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-body font-semibold text-xs text-[var(--color-ink-muted)] uppercase mb-1 flex items-center gap-1">
                  <IndianRupee className="w-3.5 h-3.5 text-[var(--color-ink-muted)]" />
                  <span>COD Amount (₹)</span>
                </label>
                <input
                  type="number"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  min={0}
                  step={10}
                  value={codAmount}
                  onChange={(e) => setCodAmount(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="0 (Prepaid)"
                  className="w-full h-11 px-3.5 border border-[var(--color-border)] rounded-xl font-mono text-sm bg-[var(--color-surface)] text-[var(--color-ink)] placeholder:text-[var(--color-ink-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-marigold)] focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block font-body font-semibold text-xs text-[var(--color-ink-muted)] uppercase mb-1">
                  Parcel Count
                </label>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={parcels}
                  onChange={(e) => setParcels(Number(e.target.value))}
                  className="w-full h-11 px-3.5 border border-[var(--color-border)] rounded-xl font-mono text-xs bg-[var(--color-surface)] text-[var(--color-ink)] placeholder:text-[var(--color-ink-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-marigold)] focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Note / Special Instructions */}
            <div>
              <label className="block font-body font-semibold text-xs text-[var(--color-ink-muted)] uppercase mb-1">
                Rider Delivery Instructions
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Ring bell twice / 3rd floor no elevator"
                className="w-full h-11 px-3.5 border border-[var(--color-border)] rounded-xl font-body text-sm bg-[var(--color-surface)] text-[var(--color-ink)] placeholder:text-[var(--color-ink-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-marigold)] focus:border-transparent transition-all"
              />
            </div>

            {/* Add Stop Button (56px touch target) */}
            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                fullWidth
                size="touch"
                icon={<Plus className="w-5 h-5 stroke-[2.5]" />}
              >
                Add Stop to Sequence
              </Button>
            </div>
          </form>
        </div>

        {/* RIGHT PANE: DRAGGABLE STOPCARDS LIST */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-3">
            <div>
              <span className="font-body font-bold text-xs text-[var(--color-ink)] uppercase tracking-wider block">
                Manifest Sequence ({stops.length} Stops)
              </span>
              <span className="font-body text-xs text-[var(--color-ink-muted)]">
                Drag handle to reorder, swipe left to delete, or tap to edit details.
              </span>
            </div>

            <button
              type="button"
              onClick={handleLoadDemoDay}
              className="font-body text-xs font-semibold text-[#8c5e03] hover:underline cursor-pointer"
            >
              Reset to Demo Day
            </button>
          </div>

          {stops.length === 0 ? (
            <EmptyState
              title="Manifest is Empty"
              description="Add stops using the form on the left, paste a WhatsApp list, or load the 8-stop Mumbai demo day."
              actionLabel="Load 8 Mumbai Stops"
              onAction={handleLoadDemoDay}
              illustrationType="clipboard"
            />
          ) : (
            <div className="space-y-3">
              {stops.map((stop, idx) => (
                <StopCard
                  key={stop.id}
                  stop={stop}
                  draggable
                  dragIndex={idx}
                  onDragStart={handleDragStart}
                  onDragOver={handleDragOver}
                  onDragEnd={handleDragEnd}
                  onMoveUp={handleMoveUp}
                  onMoveDown={handleMoveDown}
                  isFirst={idx === 0}
                  isLast={idx === stops.length - 1}
                  onEdit={(s) => setEditingStop(s)}
                  onDelete={(id) => removeStop(id)}
                  onSelect={(s) => setEditingStop(s)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 4. STICKY BOTTOM ACTION BAR */}
      <div className="fixed bottom-[calc(3.5rem+env(safe-area-inset-bottom,0px))] md:bottom-0 left-0 right-0 z-30 md:z-40 bg-[var(--color-surface)]/95 backdrop-blur-md border-t border-[var(--color-border)] p-3 sm:p-3.5 shadow-lg">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <div className="hidden sm:block">
            <div className="font-body text-xs font-bold text-[var(--color-ink)]">
              {stops.length} STOPS READY · {stats.highPriorityCount} HIGH PRIORITY
            </div>
            <div className="font-mono text-xs text-[var(--color-ink-secondary)]">
              {stops.length < 2
                ? 'Add at least 2 stops to unlock route optimization'
                : `Corridor run ~${stats.totalKm} KM · ~${stats.totalMinutes} mins`}
            </div>
          </div>

          <div className="w-full sm:w-auto">
            <Button
              variant="primary"
              size="touch"
              disabled={stops.length < 2}
              onClick={() => {
                optimizeRoute();
                navigate('/route');
              }}
              icon={<Sparkles className="w-5 h-5 text-[#1F2A27] stroke-[2.5]" />}
              fullWidth
            >
              {stops.length < 2
                ? 'Add 2+ Stops to Optimise'
                : 'Optimise Route Sequence'}
            </Button>
          </div>
        </div>
      </div>

      {/* Modals & Bottom Sheets */}
      <MapPickerModal
        isOpen={isMapPickerOpen}
        onClose={() => setIsMapPickerOpen(false)}
        onSelectLocation={handleMapPinSelected}
      />

      <PasteListModal
        isOpen={isPasteModalOpen}
        onClose={() => setIsPasteModalOpen(false)}
        onImport={(newStops) => addMultipleStops(newStops)}
      />

      <EditStopBottomSheet
        stop={editingStop}
        isOpen={Boolean(editingStop)}
        onClose={() => setEditingStop(null)}
        onSave={updateStop}
        onDelete={removeStop}
        allStops={stops}
      />
    </div>
  );
};