import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { DeliveryStop, PriorityLevel, StopType } from '../../data/mockStops';
import {
  Trash2,
  Check,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Phone,
  IndianRupee,
  FileText,
  Link as LinkIcon,
  Flame,
  CircleDot,
  Circle,
} from 'lucide-react';

interface EditStopBottomSheetProps {
  stop: DeliveryStop | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, updates: Partial<DeliveryStop>) => void;
  onDelete: (id: string) => void;
  allStops: DeliveryStop[];
}

export const EditStopBottomSheet: React.FC<EditStopBottomSheetProps> = ({
  stop,
  isOpen,
  onClose,
  onSave,
  onDelete,
  allStops,
}) => {
  const [name, setName] = useState('');
  const [type, setType] = useState<StopType>('drop');
  const [priority, setPriority] = useState<PriorityLevel>('medium');
  const [address, setAddress] = useState('');
  const [area, setArea] = useState('');
  const [landmark, setLandmark] = useState('');
  const [phone, setPhone] = useState('');
  const [deadline, setDeadline] = useState('');
  const [codAmount, setCodAmount] = useState<number>(0);
  const [notes, setNotes] = useState('');
  const [pairedStopId, setPairedStopId] = useState<string>('');

  useEffect(() => {
    if (stop) {
      setName(stop.recipientName);
      setType(stop.type || 'drop');
      setPriority(stop.priority);
      setAddress(stop.address);
      setArea(stop.area);
      setLandmark(stop.landmark);
      setPhone(stop.phone || '');
      setDeadline(stop.deadline || '');
      setCodAmount(stop.codAmount || 0);
      setNotes(stop.notes || '');
      setPairedStopId(stop.pairedStopId || '');
    }
  }, [stop]);

  if (!stop) return null;

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(stop.id, {
      recipientName: name.trim(),
      type,
      priority,
      address: address.trim(),
      area: area.trim(),
      landmark: landmark.trim(),
      phone: phone.trim() || undefined,
      deadline: deadline.trim() || undefined,
      codAmount: Number(codAmount) || 0,
      notes: notes.trim() || undefined,
      pairedStopId: pairedStopId || undefined,
    });
    onClose();
  };

  const otherStops = allStops.filter((s) => s.id !== stop.id);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Edit Stop #${stop.order}`}
      subtitle="Modify courier details, priority tier, or payment requirements"
      size="md"
      footer={
        <div className="flex items-center justify-between w-full">
          <Button
            variant="danger"
            size="md"
            onClick={() => {
              onDelete(stop.id);
              onClose();
            }}
            icon={<Trash2 className="w-4 h-4" />}
          >
            Delete Stop
          </Button>

          <div className="flex items-center gap-2">
            <Button variant="secondary" size="md" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={handleFormSubmit}
              icon={<Check className="w-4 h-4" />}
            >
              Save Changes
            </Button>
          </div>
        </div>
      }
    >
      <form onSubmit={handleFormSubmit} className="space-y-4">
        {/* Type Selector (Pickup vs Drop) */}
        <div>
          <label className="block font-body font-semibold text-xs text-[var(--color-ink-muted)] mb-1.5 uppercase tracking-wide">
            Stop Manifest Type
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setType('drop')}
              className={`h-11 px-3 rounded-xl border font-body font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
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
              className={`h-11 px-3 rounded-xl border font-body font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
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

        {/* Priority Selector (3 Distinct Buttons with Icon + Shape) */}
        <div>
          <label className="block font-body font-semibold text-xs text-[var(--color-ink-muted)] mb-1.5 uppercase tracking-wide">
            Priority Tier
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setPriority('high')}
              className={`min-h-[48px] p-2 rounded-xl border font-body text-xs font-semibold transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5 ${
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
              className={`min-h-[48px] p-2 rounded-xl border font-body text-xs font-semibold transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5 ${
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
              className={`min-h-[48px] p-2 rounded-xl border font-body text-xs font-semibold transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5 ${
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

        {/* Recipient Name */}
        <div>
          <label className="block font-body font-medium text-xs text-[var(--color-ink-secondary)] mb-1">
            Recipient / Contact Name *
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full h-11 px-3.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-ink)] font-body text-sm placeholder:text-[var(--color-ink-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-marigold)] focus:border-transparent transition-all"
          />
        </div>

        {/* Address */}
        <div>
          <label className="block font-body font-medium text-xs text-[var(--color-ink-secondary)] mb-1">
            Address *
          </label>
          <input
            type="text"
            required
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full h-11 px-3.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-ink)] font-body text-sm placeholder:text-[var(--color-ink-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-marigold)] focus:border-transparent transition-all"
          />
        </div>

        {/* Area & Landmark */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block font-body font-medium text-xs text-[var(--color-ink-secondary)] mb-1">
              Area
            </label>
            <input
              type="text"
              required
              value={area}
              onChange={(e) => setArea(e.target.value)}
              className="w-full h-11 px-3.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-ink)] font-body text-sm placeholder:text-[var(--color-ink-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-marigold)] focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label className="block font-body font-medium text-xs text-[var(--color-ink-secondary)] mb-1">
              Landmark
            </label>
            <input
              type="text"
              value={landmark}
              onChange={(e) => setLandmark(e.target.value)}
              className="w-full h-11 px-3.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-ink)] font-body text-sm placeholder:text-[var(--color-ink-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-marigold)] focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Deadline & Phone */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block font-body font-medium text-xs text-[var(--color-ink-secondary)] mb-1 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[var(--color-ink-muted)]" />
              <span>Deadline Time</span>
            </label>
            <input
              type="text"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              placeholder="e.g. 01:30 PM"
              className="w-full h-11 px-3.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-ink)] font-mono text-sm placeholder:text-[var(--color-ink-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-marigold)] focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label className="block font-body font-medium text-xs text-[var(--color-ink-secondary)] mb-1 flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-[var(--color-ink-muted)]" />
              <span>Phone</span>
            </label>
            <input
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98200 XXXXX"
              className="w-full h-11 px-3.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-ink)] font-mono text-sm placeholder:text-[var(--color-ink-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-marigold)] focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* COD Amount & Paired Stop */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block font-body font-medium text-xs text-[var(--color-ink-secondary)] mb-1 flex items-center gap-1">
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
              onChange={(e) => setCodAmount(e.target.value === '' ? 0 : Number(e.target.value))}
              placeholder="0 (Prepaid)"
              className="w-full h-11 px-3.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-ink)] font-mono text-sm placeholder:text-[var(--color-ink-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-marigold)] focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label className="block font-body font-medium text-xs text-[var(--color-ink-secondary)] mb-1 flex items-center gap-1">
              <LinkIcon className="w-3.5 h-3.5 text-[var(--color-ink-muted)]" />
              <span>Pair with Stop</span>
            </label>
            <select
              value={pairedStopId}
              onChange={(e) => setPairedStopId(e.target.value)}
              className="w-full h-11 px-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-ink)] font-body text-xs focus:outline-none focus:ring-2 focus:ring-[var(--color-marigold)] focus:border-transparent transition-all"
            >
              <option value="">None (Independent)</option>
              {otherStops.map((os) => (
                <option key={os.id} value={os.id}>
                  #{os.order} {os.recipientName} ({((os.type) || 'drop').toUpperCase()})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block font-body font-medium text-xs text-[var(--color-ink-secondary)] mb-1 flex items-center gap-1">
            <FileText className="w-3.5 h-3.5 text-[var(--color-ink-muted)]" />
            <span>Delivery Instructions / Notes</span>
          </label>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. Ring bell twice, leave with security guard"
            className="w-full h-11 px-3.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-ink)] font-body text-sm placeholder:text-[var(--color-ink-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-marigold)] focus:border-transparent transition-all"
          />
        </div>
      </form>
    </Modal>
  );
};