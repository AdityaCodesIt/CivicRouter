import React, { useState, useMemo } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { PriorityBadge } from '../common/PriorityBadge';
import { DeliveryStop, PriorityLevel, StopType } from '../../data/mockStops';
import { Check } from 'lucide-react';

interface ParsedPreviewItem {
  id: string;
  recipientName: string;
  address: string;
  area: string;
  landmark: string;
  priority: PriorityLevel;
  type: StopType;
  phone: string;
  parcelCount: number;
  codAmount: number;
}

interface PasteListModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (stops: Array<Omit<DeliveryStop, 'id' | 'order' | 'status'>>) => void;
}

export const PasteListModal: React.FC<PasteListModalProps> = ({
  isOpen,
  onClose,
  onImport,
}) => {
  const [rawText, setRawText] = useState(
    `Suresh Mehta - Kothari Heights Dadar West - 9820144521 - urgent medicine
Aarti Deshmukh - Matoshree Niwas Dadar East - 9769288410 - pickup return 2 pkgs
Kunal Singhania - One World Center Lower Parel - 9833411209 - COD 1250 urgent
Fatima Noorani - 74 Ali Chamber Byculla - 9930967543 - COD 450
Rohit Varma - Colaba Market Road - 9167230981`
  );

  const parsedItems = useMemo<ParsedPreviewItem[]>(() => {
    if (!rawText.trim()) return [];

    const lines = rawText
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    return lines.map((line, idx) => {
      const lower = line.toLowerCase();
      const parts = line.split(/[-–—|]/).map((p) => p.trim());

      // 1. Recipient Name
      const name = parts[0] || `Stop ${idx + 1}`;

      // 2. Address & Area
      const rawAddress = parts[1] || parts[0];
      let area = 'Mumbai Central';
      const areas = [
        'Dadar West',
        'Dadar East',
        'Lower Parel',
        'Bandra East',
        'Bandra West',
        'Byculla',
        'Colaba',
        'Andheri East',
        'Andheri West',
        'BKC',
        'Ghatkopar',
        'Kurla West',
        'Fort',
      ];
      for (const a of areas) {
        if (lower.includes(a.toLowerCase())) {
          area = a;
          break;
        }
      }

      // 3. Priority detection
      let priority: PriorityLevel = 'medium';
      if (lower.includes('urgent') || lower.includes('high') || lower.includes('emergency') || lower.includes('medicine')) {
        priority = 'high';
      } else if (lower.includes('low') || lower.includes('flex') || lower.includes('later')) {
        priority = 'low';
      }

      // 4. Pickup vs Drop detection
      let type: StopType = 'drop';
      if (lower.includes('pickup') || lower.includes('pick') || lower.includes('collect') || lower.includes('return')) {
        type = 'pickup';
      }

      // 5. Phone number extraction (10 digit sequence)
      const phoneMatch = line.match(/\b\d{10}\b/);
      const phone = phoneMatch ? `+91 ${phoneMatch[0].slice(0, 5)} ${phoneMatch[0].slice(5)}` : '+91 98200 00000';

      // 6. COD extraction (e.g. COD 450 or Rs 450)
      const codMatch = line.match(/(?:cod|rs\.?|inr)\s*(\d+)/i);
      const codAmount = codMatch ? Number(codMatch[1]) : 0;

      // 7. Parcel Count
      const pkgMatch = line.match(/(\d+)\s*(?:pkg|package|parcel|box)/i);
      const parcelCount = pkgMatch ? Number(pkgMatch[1]) : 1;

      return {
        id: `parsed-${idx}`,
        recipientName: name,
        address: rawAddress,
        area,
        landmark: 'Auto-parsed from courier list',
        priority,
        type,
        phone,
        parcelCount,
        codAmount,
      };
    });
  }, [rawText]);

  const handleImportAll = () => {
    if (parsedItems.length === 0) return;

    const formatted = parsedItems.map((item, idx) => ({
      recipientName: item.recipientName,
      phone: item.phone,
      address: item.address,
      area: item.area,
      landmark: item.landmark,
      priority: item.priority,
      type: item.type,
      parcelCount: item.parcelCount,
      codAmount: item.codAmount,
      etaMinutes: (idx + 1) * 15,
      distanceKm: Number(((idx + 1) * 2.8).toFixed(1)),
      coordinates: { lat: 19.02 - idx * 0.015, lng: 72.84 },
    }));

    onImport(formatted);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Paste Multi-Stop List"
      subtitle="Paste from WhatsApp, SMS or Excel (one address per line)"
      size="lg"
      footer={
        <div className="flex items-center justify-between w-full">
          <div className="font-mono text-xs font-semibold text-[var(--color-ink-secondary)]">
            {parsedItems.length} stops parsed
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="md" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="md"
              disabled={parsedItems.length === 0}
              onClick={handleImportAll}
              icon={<Check className="w-4 h-4 stroke-[2.5]" />}
            >
              Import {parsedItems.length} Stops
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        <div>
          <label className="block font-body font-semibold text-xs text-[var(--color-ink-muted)] mb-1 uppercase tracking-wide">
            Raw Addresses (One Per Line)
          </label>
          <textarea
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            rows={5}
            placeholder={`Name - Address / Area - Phone - Urgent / COD 500\nRahul - Dadar West - 9820144521 - urgent\nPriya - Lower Parel - 9833411209 - pickup return`}
            className="w-full p-3 font-mono text-xs border border-[var(--color-border)] rounded-xl bg-[var(--color-surface)] text-[var(--color-ink)] focus:outline-none focus:ring-2 focus:ring-[var(--color-marigold)] focus:border-transparent transition-all"
          />
          <span className="font-body text-[11px] text-[var(--color-ink-muted)] mt-1 block">
            Tip: RouteWala detects 'urgent', 'pickup', phone numbers, and 'COD 500' automatically.
          </span>
        </div>

        {/* Live Parsed Preview Table */}
        <div>
          <div className="font-body text-xs font-semibold text-[var(--color-ink)] uppercase mb-2 flex items-center justify-between">
            <span>Live Parser Preview ({parsedItems.length} detected)</span>
            <span className="text-[var(--color-status-success)] font-medium">✓ Auto configured</span>
          </div>

          <div className="border border-[var(--color-border)] rounded-xl overflow-hidden max-h-56 overflow-y-auto bg-[var(--color-surface)]">
            <table className="w-full text-left text-xs font-body border-collapse">
              <thead>
                <tr className="bg-[var(--color-bg-sunken)] text-[var(--color-ink-secondary)] font-body text-[11px] font-semibold uppercase border-b border-[var(--color-border)]">
                  <th className="p-2.5 border-r border-[var(--color-border)]">Type</th>
                  <th className="p-2.5 border-r border-[var(--color-border)]">Recipient & Address</th>
                  <th className="p-2.5 border-r border-[var(--color-border)]">Area</th>
                  <th className="p-2.5 border-r border-[var(--color-border)]">Priority</th>
                  <th className="p-2.5">COD</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)] font-normal">
                {parsedItems.map((item, idx) => (
                  <tr key={idx} className="hover:bg-[var(--color-bg-sunken)] transition-colors">
                    <td className="p-2.5 border-r border-[var(--color-border)] font-body text-[11px] font-medium">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
                          item.type === 'pickup'
                            ? 'bg-[var(--color-marigold-tint)] text-[#8c5e03]'
                            : 'bg-[var(--color-sky-tint)] text-[var(--color-ink)]'
                        }`}
                      >
                        {item.type}
                      </span>
                    </td>
                    <td className="p-2.5 border-r border-[var(--color-border)]">
                      <div className="font-semibold text-[var(--color-ink)]">{item.recipientName}</div>
                      <div className="text-[11px] text-[var(--color-ink-muted)] truncate max-w-[200px]">
                        {item.address}
                      </div>
                    </td>
                    <td className="p-2.5 border-r border-[var(--color-border)] font-mono text-[11px] text-[var(--color-ink-secondary)]">
                      {item.area}
                    </td>
                    <td className="p-2.5 border-r border-[var(--color-border)]">
                      <PriorityBadge priority={item.priority} size="sm" showLabel={false} />
                    </td>
                    <td className="p-2.5 font-mono text-[11px] text-[var(--color-ink)] font-medium">
                      {item.codAmount > 0 ? `₹${item.codAmount}` : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Modal>
  );
};