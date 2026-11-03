import React, { useState } from 'react';
import { useRoute } from '../context/RouteContext';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/common/Button';
import { Toggle } from '../components/common/Toggle';
import { Modal } from '../components/common/Modal';
import { Language } from '../i18n/translations';
import {
  Sliders,
  Globe,
  Sun,
  Moon,
  Bike,
  RotateCcw,
  ShieldCheck,
  Check,
  Type,
  Trash2,
  Download,
  AlertTriangle,
  Lock,
  LogOut,
  User as UserIcon,
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const {
    language,
    setLanguage,
    highContrast,
    toggleHighContrast,
    textSize,
    setTextSize,
    blockBackgroundTracking,
    setBlockBackgroundTracking,
    locationOptIn,
    setLocationOptIn,
    resetToMockData,
    clearAllData,
    stops,
    stats,
  } = useRoute();

  const { user, signOut } = useAuth();

  const [isDarkTheme, setIsDarkTheme] = useState(() => {
    return document.documentElement.classList.contains('dark') ||
      (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });
  const [showDeleteAllModal, setShowDeleteAllModal] = useState(false);
  const [feedbackNotice, setFeedbackNotice] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setFeedbackNotice(msg);
    setTimeout(() => setFeedbackNotice(null), 3500);
  };

  const toggleDarkMode = (checked: boolean) => {
    setIsDarkTheme(checked);
    if (checked) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    showNotification(checked ? 'Dark theme enabled' : 'Soft morning cream theme enabled');
  };

  const handleLocationToggle = (checked: boolean) => {
    if (checked) {
      if (typeof navigator !== 'undefined' && 'geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          () => {
            setLocationOptIn(true);
            showNotification('Location permission granted. Location is only queried during active navigation.');
          },
          (err) => {
            console.warn('Geolocation permission denied:', err);
            setLocationOptIn(false);
            showNotification('Location permission was denied by your browser.');
          },
          { timeout: 10000, enableHighAccuracy: true }
        );
      } else {
        setLocationOptIn(false);
        showNotification('Geolocation is not supported by your browser.');
      }
    } else {
      setLocationOptIn(false);
      showNotification('Location access disabled. RouteWala will never query your GPS position.');
    }
  };

  const handleResetToDemo = () => {
    resetToMockData();
    showNotification('Sample 5-stop Mumbai manifest restored!');
  };

  const handleConfirmDeleteAllMyData = async () => {
    clearAllData();
    setShowDeleteAllModal(false);
    showNotification('All your plans, stops, wishlist items, and logs permanently deleted.');
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
    a.download = `routewala-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showNotification('Route backup exported successfully!');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-8 py-8 space-y-6 page-fade-in">
      {/* Header */}
      <div className="border-b border-[var(--color-border)] pb-6 mb-4">
        <div className="flex items-center gap-2 text-xs font-mono font-semibold text-[var(--color-ink-muted)] uppercase tracking-wider mb-1">
          <Sliders className="w-4 h-4 text-[var(--color-marigold)]" />
          <span>RouteWala Configuration</span>
        </div>
        <h1 className="font-display font-bold text-2xl sm:text-3xl text-[var(--color-ink)]">
          Settings & Rider Preferences
        </h1>
        <p className="font-body text-sm text-[var(--color-ink-secondary)] mt-1">
          Configure language, daylight legibility on bike mounts, location privacy, and cloud data synchronization.
        </p>

        {feedbackNotice && (
          <div className="mt-4 p-3 bg-[var(--color-sage-tint)] text-[var(--color-sage-deep)] border border-[var(--color-sage)] rounded-xl font-body text-xs font-semibold text-center">
            ✓ {feedbackNotice}
          </div>
        )}
      </div>

      <div className="space-y-6">
        {/* 0. Account & Sync Status */}
        <div className="soft-card p-5 sm:p-6 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl shadow-sm">
          <div className="flex items-center justify-between gap-4 mb-3">
            <div className="flex items-center gap-2 font-display font-bold text-lg text-[var(--color-ink)]">
              <UserIcon className="w-5 h-5 text-[var(--color-ink)]" />
              <span>Rider Account & Cloud Sync</span>
            </div>
            {user ? (
              <span className="px-3 py-1 bg-[var(--color-sage-tint)] text-[var(--color-sage-deep)] border border-[var(--color-sage)] font-mono text-[10px] font-semibold rounded-full uppercase">
                Synced to Cloud
              </span>
            ) : (
              <span className="px-3 py-1 bg-[var(--color-marigold-tint)] text-[#8c5e03] border border-[var(--color-marigold)]/30 font-mono text-[10px] font-semibold rounded-full uppercase">
                Guest Mode (Offline)
              </span>
            )}
          </div>

          <div className="p-3.5 bg-[var(--color-bg-sunken)] border border-[var(--color-border)] rounded-xl mb-2 text-xs font-body">
            {user ? (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-[var(--color-ink-muted)]">Logged in as: </span>
                  <span className="font-semibold text-[var(--color-ink)] font-mono">{user.email || user.phone}</span>
                </div>
                <button
                  type="button"
                  onClick={() => signOut()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[var(--color-priority-high-bg)] hover:bg-[var(--color-priority-high)] hover:text-white text-[var(--color-priority-high)] font-semibold rounded-full border border-[var(--color-priority-high)] cursor-pointer transition-colors w-fit text-xs"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="text-[var(--color-ink-secondary)]">
                  Using local storage. Sign in to synchronize runs across devices.
                </span>
                <a
                  href="/login"
                  className="inline-flex items-center gap-1 px-3.5 py-1.5 bg-[var(--color-marigold)] text-[#1F2A27] font-semibold rounded-full shadow-sm cursor-pointer w-fit text-xs"
                >
                  <span>Sign In</span>
                </a>
              </div>
            )}
          </div>
        </div>

        {/* 1. Language Toggle */}
        <div className="soft-card p-5 sm:p-6 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl shadow-sm">
          <div className="flex items-center gap-2 font-display font-bold text-lg text-[var(--color-ink)] mb-1">
            <Globe className="w-5 h-5 text-[var(--color-ink)]" />
            <span>Application Language / भाषा</span>
          </div>
          <p className="font-body text-xs text-[var(--color-ink-secondary)] mb-4">
            Select interface language for all stop cards, instructions, and driver mode prompts.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { code: 'en' as Language, label: 'English', sub: 'Mumbai Courier' },
              { code: 'hi' as Language, label: 'हिंदी', sub: 'देवनागरी लिपि' },
              { code: 'mr' as Language, label: 'मराठी', sub: 'महाराष्ट्र भाषा' },
            ].map((lng) => (
              <button
                key={lng.code}
                type="button"
                onClick={() => {
                  setLanguage(lng.code);
                  showNotification(`Language set to ${lng.label}`);
                }}
                className={`p-3.5 text-left border rounded-xl transition-all cursor-pointer ${
                  language === lng.code
                    ? 'border-2 border-[var(--color-marigold)] bg-[#FBEBC6] dark:bg-[#2C2415] text-[#8c5e03] dark:text-[#F2B84B] font-semibold shadow-sm'
                    : 'border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-ink)] hover:bg-[var(--color-bg-sunken)]'
                }`}
              >
                <div className="font-display font-bold text-sm flex items-center justify-between">
                  <span>{lng.label}</span>
                  {language === lng.code && <Check className="w-4 h-4 text-[#8c5e03] stroke-[3]" />}
                </div>
                <div className="text-[11px] font-body opacity-80 mt-0.5">{lng.sub}</div>
              </button>
            ))}
          </div>
        </div>

        {/* 2. Visual Contrast & Sun Glare + Dark Mode */}
        <div className="soft-card p-5 sm:p-6 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl shadow-sm space-y-4">
          <div className="flex items-center gap-2 font-display font-bold text-lg text-[var(--color-ink)]">
            <Sun className="w-5 h-5 text-[var(--color-ink)]" />
            <span>Appearance & Daylight Readability</span>
          </div>

          <Toggle
            id="dark-theme-toggle"
            checked={isDarkTheme}
            onChange={toggleDarkMode}
            label="Night / Dark Theme"
            sublabel="Soft slate-black background (#141A18) with cream ink contrast for night shifts"
          />

          <div className="border-t border-[var(--color-border)] pt-4">
            <Toggle
              id="contrast-toggle"
              checked={highContrast}
              onChange={() => {
                toggleHighContrast();
                showNotification(highContrast ? 'Standard theme restored' : 'Daylight high-contrast enabled');
              }}
              label="Daylight High-Contrast Mode (Extreme Sun)"
              sublabel="Inverts background to pure black/white ink for maximum legibility under 38°C midday Mumbai sun"
            />
          </div>
        </div>

        {/* 3. Text Size */}
        <div className="soft-card p-5 sm:p-6 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl shadow-sm">
          <div className="flex items-center gap-2 font-display font-bold text-lg text-[var(--color-ink)] mb-1">
            <Type className="w-5 h-5 text-[var(--color-ink)]" />
            <span>Card Text Scaling for Handlebar Mounts</span>
          </div>
          <p className="font-body text-xs text-[var(--color-ink-secondary)] mb-4">
            Enlarges customer names, phone digits, and Mumbai landmark callouts for arm's length viewing while riding.
          </p>

          <div className="grid grid-cols-3 gap-3">
            {[
              { id: 'normal' as const, label: 'Normal', note: 'Standard UI' },
              { id: 'large' as const, label: 'Large (+15%)', note: 'Recommended' },
              { id: 'xlarge' as const, label: 'X-Large (+30%)', note: 'Maximum Glare' },
            ].map((size) => (
              <button
                key={size.id}
                type="button"
                onClick={() => {
                  setTextSize(size.id);
                  showNotification(`Text scale: ${size.label}`);
                }}
                className={`p-3 text-center border rounded-xl transition-all cursor-pointer ${
                  textSize === size.id
                    ? 'border-2 border-[var(--color-marigold)] bg-[#FBEBC6] dark:bg-[#2C2415] text-[#8c5e03] dark:text-[#F2B84B] font-semibold shadow-sm'
                    : 'border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-ink)] hover:bg-[var(--color-bg-sunken)]'
                }`}
              >
                <div className="font-body font-bold text-sm">{size.label}</div>
                <div className="text-[10px] font-mono opacity-80 mt-0.5">{size.note}</div>
              </button>
            ))}
          </div>
        </div>

        {/* 4. Location Permission & Privacy Settings */}
        <div className="soft-card p-5 sm:p-6 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl shadow-sm space-y-4">
          <div className="flex items-center gap-2 font-display font-bold text-lg text-[var(--color-ink)]">
            <ShieldCheck className="w-5 h-5 text-[var(--color-sage-deep)]" />
            <span>Location Privacy & Battery Saver</span>
          </div>

          <div className="p-4 bg-[var(--color-bg-sunken)] border border-[var(--color-border)] rounded-xl text-xs font-body space-y-2">
            <div className="flex items-center gap-2 font-body font-bold text-sm text-[var(--color-ink)]">
              <Lock className="w-4 h-4 text-[var(--color-sage-deep)]" />
              <span>Strict Location Privacy Guarantee</span>
            </div>
            <p className="text-[var(--color-ink-secondary)] leading-relaxed">
              RouteWala never runs continuous background GPS beacons or sells courier telematics. Your browser location is only queried when you explicitly opt-in below and only while the active driver console is visible.
            </p>
          </div>

          <Toggle
            id="location-opt-in-toggle"
            checked={locationOptIn}
            onChange={handleLocationToggle}
            label="Opt-In to Live Navigation Location (location_opt_in)"
            sublabel="Requests browser location permission strictly for detecting next stop and on-the-way errand proximity"
          />

          <div className="border-t border-[var(--color-border)] pt-4">
            <Toggle
              id="block-bg-tracking-toggle"
              checked={blockBackgroundTracking}
              onChange={setBlockBackgroundTracking}
              label="Enforce 'No Background Tracking' Mode"
              sublabel="Blocks any background telemetry or wake-lock pings to save phone battery during 8-hour shifts"
            />
          </div>
        </div>

        {/* 5. Vehicle Profile */}
        <div className="soft-card p-5 sm:p-6 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl shadow-sm">
          <div className="flex items-center gap-2 font-display font-bold text-lg text-[var(--color-ink)] mb-1">
            <Bike className="w-5 h-5 text-[var(--color-ink)]" />
            <span>Vehicle Profile & Road Restrictions</span>
          </div>
          <p className="font-body text-xs text-[var(--color-ink-secondary)] mb-4">
            Customizes routing constraints for Mumbai flyovers, toll bridges, and chawl alleyways.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-body text-xs">
            {[
              { id: 'motorcycle', title: 'Motorcycle', detail: 'Splendor / Pulsar' },
              { id: 'scooter', title: 'Scooter', detail: 'Activa / Jupiter' },
              { id: 'ev', title: 'Electric EV', detail: 'Chetak / Ather' },
              { id: 'bicycle', title: 'Cycle / Dabba', detail: 'Bicycle Courier' },
            ].map((v) => (
              <div
                key={v.id}
                className="p-3.5 bg-[var(--color-bg-sunken)] border border-[var(--color-border)] rounded-xl shadow-sm"
              >
                <div className="text-[var(--color-ink)] font-bold">{v.title}</div>
                <div className="text-[10px] text-[var(--color-ink-muted)] font-normal">{v.detail}</div>
                <div className="mt-2 text-[10px] text-[var(--color-sage-deep)] font-semibold font-mono">ACTIVE</div>
              </div>
            ))}
          </div>
        </div>

        {/* 6. DATA MANAGEMENT & RESETS */}
        <div className="soft-card p-5 sm:p-6 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl shadow-sm space-y-4">
          <div className="flex items-center gap-2 font-display font-bold text-lg text-[var(--color-ink)]">
            <RotateCcw className="w-5 h-5 text-[var(--color-ink)]" />
            <span>Data Management & Privacy Erasure</span>
          </div>
          <p className="font-body text-xs text-[var(--color-ink-secondary)]">
            Export a copy of your delivery run or permanently delete your profile records.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Button
              variant="secondary"
              size="md"
              onClick={handleExportJSON}
              icon={<Download className="w-4 h-4" />}
            >
              Export JSON Backup
            </Button>

            <Button
              variant="secondary"
              size="md"
              onClick={handleResetToDemo}
              icon={<RotateCcw className="w-4 h-4" />}
            >
              Reset Mumbai Demo
            </Button>

            <Button
              variant="danger"
              size="md"
              onClick={() => setShowDeleteAllModal(true)}
              icon={<Trash2 className="w-4 h-4" />}
            >
              Delete All My Data
            </Button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal for Delete All My Data */}
      <Modal
        isOpen={showDeleteAllModal}
        onClose={() => setShowDeleteAllModal(false)}
        title="Delete All My Data?"
      >
        <div className="space-y-4 font-body">
          <div className="p-3.5 bg-[var(--color-priority-high-bg)] border border-[var(--color-priority-high)] rounded-xl flex items-start gap-2.5">
            <AlertTriangle className="w-5 h-5 text-[var(--color-priority-high)] shrink-0 mt-0.5" />
            <div className="text-xs text-[var(--color-ink)] leading-relaxed">
              <strong>Permanent Privacy Erasure:</strong> This will permanently delete all your route plans, delivery stops, wishlist items, and prompt logs from Supabase as well as clearing your local browser storage. This cannot be undone.
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="secondary"
              size="md"
              onClick={() => setShowDeleteAllModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              size="md"
              onClick={handleConfirmDeleteAllMyData}
              icon={<Trash2 className="w-4 h-4" />}
            >
              Yes, Permanently Delete All Data
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};