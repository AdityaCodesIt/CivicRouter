import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { DeliveryStop, initialDeliveryStops, demoDayStops, PriorityLevel } from '../data/mockStops';
import { WishlistItem, initialWishlistItems } from '../data/wishlistItems';
import { Language, translations, Translations } from '../i18n/translations';
import * as repo from '../data/repo';

export interface WishlistSettings {
  detourBudgetPerErrand: number; // 0 to 10 min
  totalDailyDetourBudget: number; // 5 to 30 min
  maxAlertsPerDay: number; // 1 to 5
  quietModeMoving: boolean;
}

export interface OnTheWayPrompt {
  id: string;
  name: string;
  category: string;
  distanceMeters: number;
  detourMinutes: number;
  landmark: string;
  area: string;
}

interface RouteContextType {
  stops: DeliveryStop[];
  activePlanId: string;
  activeStopIndex: number;
  completedStopIds: string[];
  skippedStopIds: string[];
  wishlist: WishlistItem[];
  pinnedWishlistIds: string[];
  wishlistSettings: WishlistSettings;
  updateWishlistSettings: (settings: Partial<WishlistSettings>) => void;
  activeOnTheWayPrompt: OnTheWayPrompt | null;
  triggerMockOnTheWayPrompt: (customItem?: WishlistItem) => void;
  dismissOnTheWayPrompt: () => void;
  addPromptAsNextStop: (prompt: OnTheWayPrompt) => void;
  language: Language;
  t: Translations;
  highContrast: boolean;
  vehicle: 'motorcycle' | 'scooter' | 'ev' | 'bicycle';
  addStop: (stop: Omit<DeliveryStop, 'id' | 'order' | 'status'>) => void;
  addMultipleStops: (newStops: Array<Omit<DeliveryStop, 'id' | 'order' | 'status'>>) => void;
  removeStop: (id: string) => void;
  updateStop: (id: string, updates: Partial<DeliveryStop>) => void;
  updateStopPriority: (id: string, priority: PriorityLevel) => void;
  reorderStops: (startIndex: number, endIndex: number) => void;
  loadDemoDay: () => void;
  optimizeRoute: () => void;
  markStopComplete: (id: string) => void;
  markStopSkipped: (id: string) => void;
  markStopFailed: (id: string, reason: string) => void;
  undoLastAction: () => void;
  lastAction: {
    type: 'completed' | 'skipped' | 'failed';
    stopId: string;
    stopName: string;
    prevIndex: number;
    failureReason?: string;
  } | null;
  setActiveStopIndex: (index: number) => void;
  setLanguage: (lang: Language) => void;
  toggleHighContrast: () => void;
  toggleWishlistPin: (id: string) => void;
  addWishlistItem: (item: Omit<WishlistItem, 'id'>) => void;
  removeWishlistItem: (id: string) => void;
  textSize: 'normal' | 'large' | 'xlarge';
  setTextSize: (size: 'normal' | 'large' | 'xlarge') => void;
  blockBackgroundTracking: boolean;
  setBlockBackgroundTracking: (blocked: boolean) => void;
  locationOptIn: boolean;
  setLocationOptIn: (optIn: boolean) => void;
  riderPayPerStop: number;
  setRiderPayPerStop: (val: number) => void;
  codBonusPercent: number;
  setCodBonusPercent: (val: number) => void;
  fuelAllowancePerKm: number;
  setFuelAllowancePerKm: (val: number) => void;
  clearAllData: () => void;
  resetToMockData: () => void;
  stats: {
    totalStops: number;
    highPriorityCount: number;
    completedCount: number;
    failedCount: number;
    pendingCount: number;
    totalKm: number;
    totalMinutes: number;
    timeSavedMinutes: number;
    parcelsDelivered: number;
    totalParcels: number;
    totalCodAmount: number;
    collectedCodAmount: number;
    estimatedEarnings: number;
  };
}

const RouteContext = createContext<RouteContextType | undefined>(undefined);

const STORAGE_KEY = 'routewala_v1_state';

const sanitizeStop = (s: any, idx: number): DeliveryStop => ({
  id: s?.id || `stop-${idx + 1}`,
  order: typeof s?.order === 'number' ? s.order : idx + 1,
  recipientName: s?.recipientName || `Recipient ${idx + 1}`,
  phone: s?.phone || '+91 98200 00000',
  address: s?.address || 'Mumbai Corridor',
  area: s?.area || 'Mumbai Central',
  landmark: s?.landmark || 'Near Junction',
  priority: s?.priority === 'high' || s?.priority === 'low' || s?.priority === 'medium' ? s.priority : 'medium',
  type: s?.type === 'pickup' || s?.type === 'drop' ? s.type : 'drop',
  deadline: typeof s?.deadline === 'string' ? s.deadline : undefined,
  parcelCount: typeof s?.parcelCount === 'number' ? s.parcelCount : 1,
  codAmount: typeof s?.codAmount === 'number' ? s.codAmount : 0,
  status: s?.status === 'completed' || s?.status === 'skipped' || s?.status === 'in_progress' ? s.status : 'pending',
  etaMinutes: typeof s?.etaMinutes === 'number' ? s.etaMinutes : 15,
  distanceKm: typeof s?.distanceKm === 'number' ? s.distanceKm : 2.0,
  notes: typeof s?.notes === 'string' ? s.notes : undefined,
  coordinates:
    s?.coordinates && typeof s.coordinates.lat === 'number' && typeof s.coordinates.lng === 'number'
      ? s.coordinates
      : { lat: 19.0178, lng: 72.8428 },
  pairedStopId: s?.pairedStopId,
});

const sanitizeWishlistItem = (w: any, idx: number): WishlistItem => ({
  id: w?.id || `wish-${idx + 1}`,
  name: w?.name || 'Personal Errand',
  category: w?.category || 'shop',
  landmark: w?.landmark || 'Nearby Store',
  area: w?.area || 'Mumbai Central',
  distanceOffRouteMeters: typeof w?.distanceOffRouteMeters === 'number' ? w.distanceOffRouteMeters : 250,
  detourMinutes: typeof w?.detourMinutes === 'number' ? w.detourMinutes : 3,
  detourBudgetMinutes: typeof w?.detourBudgetMinutes === 'number' ? w.detourBudgetMinutes : 5,
  rating: typeof w?.rating === 'number' ? w.rating : 4.5,
  note: typeof w?.note === 'string' ? w.note : '',
  nearStopId: w?.nearStopId,
  isPinned: Boolean(w?.isPinned),
  coordinates:
    w?.coordinates && typeof w.coordinates.lat === 'number'
      ? w.coordinates
      : { lat: 19.018, lng: 72.842 },
});

export const RouteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activePlanId, setActivePlanId] = useState<string>('plan-today');

  const [stops, setStops] = useState<DeliveryStop[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_stops`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((s, idx) => sanitizeStop(s, idx));
        }
      }
      return initialDeliveryStops.map((s, idx) => sanitizeStop(s, idx));
    } catch {
      return initialDeliveryStops.map((s, idx) => sanitizeStop(s, idx));
    }
  });

  const [activeStopIndex, setActiveStopIndex] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_active_idx`);
      return saved ? Number(saved) : 0;
    } catch {
      return 0;
    }
  });

  const [completedStopIds, setCompletedStopIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_completed`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [skippedStopIds, setSkippedStopIds] = useState<string[]>([]);
  const [lastAction, setLastAction] = useState<{
    type: 'completed' | 'skipped' | 'failed';
    stopId: string;
    stopName: string;
    prevIndex: number;
    failureReason?: string;
  } | null>(null);

  const [wishlist, setWishlist] = useState<WishlistItem[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_wishlist`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((w, idx) => sanitizeWishlistItem(w, idx));
        }
      }
      return initialWishlistItems.map((w, idx) => sanitizeWishlistItem(w, idx));
    } catch {
      return initialWishlistItems.map((w, idx) => sanitizeWishlistItem(w, idx));
    }
  });

  const [pinnedWishlistIds, setPinnedWishlistIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_pinned_wishlist`);
      return saved ? JSON.parse(saved) : ['wish-1', 'wish-3'];
    } catch {
      return ['wish-1', 'wish-3'];
    }
  });

  const [wishlistSettings, setWishlistSettings] = useState<WishlistSettings>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_wishlist_settings`);
      return saved
        ? JSON.parse(saved)
        : {
            detourBudgetPerErrand: 5,
            totalDailyDetourBudget: 15,
            maxAlertsPerDay: 3,
            quietModeMoving: false,
          };
    } catch {
      return {
        detourBudgetPerErrand: 5,
        totalDailyDetourBudget: 15,
        maxAlertsPerDay: 3,
        quietModeMoving: false,
      };
    }
  });

  const [activeOnTheWayPrompt, setActiveOnTheWayPrompt] = useState<OnTheWayPrompt | null>(null);

  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_lang`);
      return (saved as Language) || 'en';
    } catch {
      return 'en';
    }
  });

  const [highContrast, setHighContrast] = useState<boolean>(() => {
    try {
      return localStorage.getItem(`${STORAGE_KEY}_contrast`) === 'true';
    } catch {
      return false;
    }
  });

  const [vehicle, setVehicle] = useState<'motorcycle' | 'scooter' | 'ev' | 'bicycle'>('motorcycle');

  const [textSize, setTextSizeState] = useState<'normal' | 'large' | 'xlarge'>('normal');

  const [blockBackgroundTracking, setBlockBackgroundTrackingState] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_block_tracking`);
      return saved !== null ? saved === 'true' : true;
    } catch {
      return true;
    }
  });

  const [locationOptIn, setLocationOptInState] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_location_opt_in`);
      return saved === 'true';
    } catch {
      return false;
    }
  });

  const [riderPayPerStop, setRiderPayPerStop] = useState<number>(45);
  const [codBonusPercent, setCodBonusPercent] = useState<number>(2);
  const [fuelAllowancePerKm, setFuelAllowancePerKm] = useState<number>(4);

  // Initial remote fetch / sync from repository
  useEffect(() => {
    let isMounted = true;

    async function initData() {
      try {
        const todayPlan = await repo.getTodayPlan();
        if (isMounted && todayPlan?.id) {
          setActivePlanId(todayPlan.id);
        }

        const [fetchedStops, fetchedWishlist, settings] = await Promise.all([
          repo.listStops(todayPlan?.id),
          repo.listWishlist(),
          repo.getSettings(),
        ]);

        if (!isMounted) return;

        if (fetchedStops && fetchedStops.length > 0) {
          setStops(fetchedStops.map((s, idx) => sanitizeStop(s, idx)));
        }

        if (fetchedWishlist && fetchedWishlist.length > 0) {
          setWishlist(fetchedWishlist.map((w, idx) => sanitizeWishlistItem(w, idx)));
        }

        if (settings) {
          if (settings.language) setLanguageState(settings.language as Language);
          if (settings.high_contrast !== undefined) setHighContrast(settings.high_contrast);
          if (settings.text_size) {
            const mapped = settings.text_size === 'xl' ? 'xlarge' : settings.text_size === 'large' ? 'large' : 'normal';
            setTextSizeState(mapped);
          }
          if (settings.location_opt_in !== undefined) setLocationOptInState(settings.location_opt_in);
          if (settings.detour_budget_min) {
            setWishlistSettings((prev) => ({
              ...prev,
              detourBudgetPerErrand: settings.detour_budget_min,
              totalDailyDetourBudget: settings.daily_detour_budget_min,
              maxAlertsPerDay: settings.max_alerts_per_day,
              quietModeMoving: settings.quiet_mode,
            }));
          }
        }
      } catch (err) {
        console.warn('Initial repository load fallback to local state:', err);
      }
    }

    initData();

    return () => {
      isMounted = false;
    };
  }, []);

  // Sync to local storage for instant offline fallback
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_stops`, JSON.stringify(stops));
  }, [stops]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_active_idx`, String(activeStopIndex));
  }, [activeStopIndex]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_completed`, JSON.stringify(completedStopIds));
  }, [completedStopIds]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_wishlist`, JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_pinned_wishlist`, JSON.stringify(pinnedWishlistIds));
  }, [pinnedWishlistIds]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_lang`, language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_text_size`, textSize);
    document.documentElement.classList.remove('text-size-normal', 'text-size-large', 'text-size-xlarge');
    document.documentElement.classList.add(`text-size-${textSize}`);
  }, [textSize]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_block_tracking`, String(blockBackgroundTracking));
  }, [blockBackgroundTracking]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_location_opt_in`, String(locationOptIn));
  }, [locationOptIn]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_rate_per_stop`, String(riderPayPerStop));
    localStorage.setItem(`${STORAGE_KEY}_cod_bonus`, String(codBonusPercent));
    localStorage.setItem(`${STORAGE_KEY}_fuel_allowance`, String(fuelAllowancePerKm));
  }, [riderPayPerStop, codBonusPercent, fuelAllowancePerKm]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_contrast`, String(highContrast));
    if (highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  }, [highContrast]);

  const setTextSize = (size: 'normal' | 'large' | 'xlarge') => {
    setTextSizeState(size);
    repo.updateSettings({ text_size: size === 'xlarge' ? 'xl' : size });
  };

  const setBlockBackgroundTracking = (blocked: boolean) => {
    setBlockBackgroundTrackingState(blocked);
  };

  const setLocationOptIn = (optIn: boolean) => {
    setLocationOptInState(optIn);
    repo.updateSettings({ location_opt_in: optIn });
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    repo.updateSettings({ language: lang });
  };

  const toggleHighContrast = () => {
    setHighContrast((prev) => {
      const next = !prev;
      repo.updateSettings({ high_contrast: next });
      return next;
    });
  };

  const addStop = (stopData: Omit<DeliveryStop, 'id' | 'order' | 'status'>) => {
    const newStop: DeliveryStop = {
      ...stopData,
      id: `stop-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      order: stops.length + 1,
      status: 'pending',
    };
    setStops((prev) => [...prev, newStop]);
    repo.addStop(stopData, activePlanId);
  };

  const addMultipleStops = (newStops: Array<Omit<DeliveryStop, 'id' | 'order' | 'status'>>) => {
    setStops((prev) => {
      const startIndex = prev.length;
      const formatted = newStops.map((s, idx) => ({
        ...s,
        id: `stop-${Date.now()}-${idx}-${Math.floor(Math.random() * 1000)}`,
        order: startIndex + idx + 1,
        status: 'pending' as const,
      }));
      return [...prev, ...formatted];
    });

    newStops.forEach((s) => {
      repo.addStop(s, activePlanId);
    });
  };

  const removeStop = (id: string) => {
    setStops((prev) => {
      const filtered = prev.filter((s) => s.id !== id);
      return filtered.map((s, idx) => ({ ...s, order: idx + 1 }));
    });
    repo.deleteStop(id);
  };

  const updateStop = (id: string, updates: Partial<DeliveryStop>) => {
    setStops((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates } : s))
    );
    repo.updateStop(id, updates);
  };

  const updateStopPriority = (id: string, priority: PriorityLevel) => {
    setStops((prev) =>
      prev.map((s) => (s.id === id ? { ...s, priority } : s))
    );
    repo.updateStop(id, { priority });
  };

  const reorderStops = (startIndex: number, endIndex: number) => {
    setStops((prev) => {
      const result = Array.from(prev);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      const updated = result.map((s, idx) => ({ ...s, order: idx + 1 }));
      repo.saveOptimisedOrder(activePlanId, updated.map((s) => s.id));
      return updated;
    });
  };

  const loadDemoDay = () => {
    setStops(demoDayStops);
    setCompletedStopIds([]);
    setSkippedStopIds([]);
    setActiveStopIndex(0);
    demoDayStops.forEach((s) => repo.addStop(s, activePlanId));
  };

  const optimizeRoute = () => {
    // Sort Pickups before their linked Drops if paired, High priority first, then geographic North to South
    setStops((prev) => {
      const priorityWeight: Record<PriorityLevel, number> = {
        high: 1,
        medium: 2,
        low: 3,
      };

      const sorted = [...prev].sort((a, b) => {
        if (priorityWeight[a.priority] !== priorityWeight[b.priority]) {
          return priorityWeight[a.priority] - priorityWeight[b.priority];
        }
        if (a.type !== b.type) {
          return a.type === 'pickup' ? -1 : 1;
        }
        return b.coordinates.lat - a.coordinates.lat;
      });

      let currentMinutes = 10;
      let currentKm = 1.8;

      const optimized = sorted.map((stop, idx) => {
        currentMinutes += idx === 0 ? 0 : 14;
        currentKm += idx === 0 ? 0 : 2.6;
        return {
          ...stop,
          order: idx + 1,
          etaMinutes: currentMinutes,
          distanceKm: Number(currentKm.toFixed(1)),
        };
      });

      // Sync sequence via reorder_stops RPC
      repo.saveOptimisedOrder(activePlanId, optimized.map((s) => s.id));
      return optimized;
    });
  };

  const markStopComplete = (id: string) => {
    const targetStop = stops.find((s) => s.id === id);
    const prevIdx = activeStopIndex;
    setLastAction({
      type: 'completed',
      stopId: id,
      stopName: targetStop?.recipientName || 'Stop',
      prevIndex: prevIdx,
    });
    setCompletedStopIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
    setStops((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: 'completed' } : s))
    );
    setActiveStopIndex((prev) => Math.min(prev + 1, stops.length - 1));

    // Instant optimistic update + background sync / queue
    repo.markStopStatus(id, 'delivered', new Date().toISOString());
  };

  const markStopSkipped = (id: string) => {
    const targetStop = stops.find((s) => s.id === id);
    const prevIdx = activeStopIndex;
    setLastAction({
      type: 'skipped',
      stopId: id,
      stopName: targetStop?.recipientName || 'Stop',
      prevIndex: prevIdx,
    });
    setSkippedStopIds((prev) => [...prev, id]);
    setStops((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: 'skipped' } : s))
    );
    setActiveStopIndex((prev) => Math.min(prev + 1, stops.length - 1));

    repo.markStopStatus(id, 'skipped', null);
  };

  const markStopFailed = (id: string, reason: string) => {
    const targetStop = stops.find((s) => s.id === id);
    const prevIdx = activeStopIndex;
    setLastAction({
      type: 'failed',
      stopId: id,
      stopName: targetStop?.recipientName || 'Stop',
      prevIndex: prevIdx,
      failureReason: reason,
    });
    setSkippedStopIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
    setStops((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              status: 'skipped',
              notes: s.notes ? `${s.notes} [Failed: ${reason}]` : `[Failed: ${reason}]`,
            }
          : s
      )
    );
    setActiveStopIndex((prev) => Math.min(prev + 1, stops.length - 1));

    repo.markStopStatus(id, 'failed', null, reason);
  };

  const undoLastAction = () => {
    if (!lastAction) return;
    const { stopId, prevIndex } = lastAction;

    setStops((prev) =>
      prev.map((s) => (s.id === stopId ? { ...s, status: 'pending' } : s))
    );
    setCompletedStopIds((prev) => prev.filter((id) => id !== stopId));
    setSkippedStopIds((prev) => prev.filter((id) => id !== stopId));
    setActiveStopIndex(prevIndex);
    setLastAction(null);

    repo.markStopStatus(stopId, 'pending', null);
  };

  const toggleWishlistPin = (id: string) => {
    setPinnedWishlistIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const addWishlistItem = (item: Omit<WishlistItem, 'id'>) => {
    const newItem: WishlistItem = {
      ...item,
      id: `wish-${Date.now()}`,
    };
    setWishlist((prev) => [newItem, ...prev]);
    setPinnedWishlistIds((prev) => [...prev, newItem.id]);
    repo.addWishlistItem(item);
  };

  const removeWishlistItem = (id: string) => {
    setWishlist((prev) => prev.filter((item) => item.id !== id));
    setPinnedWishlistIds((prev) => prev.filter((x) => x !== id));
    repo.deleteWishlistItem(id);
  };

  const updateWishlistSettings = (settings: Partial<WishlistSettings>) => {
    setWishlistSettings((prev) => {
      const merged = { ...prev, ...settings };
      repo.updateSettings({
        detour_budget_min: merged.detourBudgetPerErrand,
        daily_detour_budget_min: merged.totalDailyDetourBudget,
        max_alerts_per_day: merged.maxAlertsPerDay,
        quiet_mode: merged.quietModeMoving,
      });
      return merged;
    });
  };

  const triggerMockOnTheWayPrompt = (customItem?: WishlistItem) => {
    const item =
      customItem ||
      wishlist.find((w) => pinnedWishlistIds.includes(w.id)) ||
      wishlist[0];

    if (item) {
      setActiveOnTheWayPrompt({
        id: item.id,
        name: item.name,
        category: item.category,
        distanceMeters: item.distanceOffRouteMeters || 350,
        detourMinutes: item.detourMinutes || 3,
        landmark: item.landmark,
        area: item.area,
      });

      repo.logPrompt({
        plan_id: activePlanId,
        item_id: item.id,
        detour_m: item.distanceOffRouteMeters || 350,
        detour_min: item.detourMinutes || 3,
        action: 'ignored',
      });
    }
  };

  const dismissOnTheWayPrompt = () => {
    if (activeOnTheWayPrompt) {
      repo.logPrompt({
        plan_id: activePlanId,
        item_id: activeOnTheWayPrompt.id,
        detour_m: activeOnTheWayPrompt.distanceMeters,
        detour_min: activeOnTheWayPrompt.detourMinutes,
        action: 'dismissed',
      });
    }
    setActiveOnTheWayPrompt(null);
  };

  const addPromptAsNextStop = (prompt: OnTheWayPrompt) => {
    const newStop: DeliveryStop = {
      id: `errand-${Date.now()}`,
      order: activeStopIndex + 2,
      recipientName: prompt.name,
      address: `${prompt.landmark}, ${prompt.area}`,
      area: prompt.area,
      landmark: prompt.landmark,
      priority: 'medium',
      type: 'drop',
      parcelCount: 1,
      codAmount: 0,
      status: 'pending',
      etaMinutes: 15,
      distanceKm: 2.0,
      notes: `On-the-way pitstop: +${prompt.detourMinutes}m detour`,
      coordinates: { lat: 19.018, lng: 72.842 },
    };

    setStops((prev) => {
      const copy = [...prev];
      copy.splice(activeStopIndex + 1, 0, newStop);
      const resequenced = copy.map((s, idx) => ({ ...s, order: idx + 1 }));
      repo.saveOptimisedOrder(activePlanId, resequenced.map((s) => s.id));
      return resequenced;
    });

    repo.addStop(newStop, activePlanId);
    repo.logPrompt({
      plan_id: activePlanId,
      item_id: prompt.id,
      detour_m: prompt.distanceMeters,
      detour_min: prompt.detourMinutes,
      action: 'added',
    });

    setActiveOnTheWayPrompt(null);
  };

  const resetToMockData = () => {
    setStops(initialDeliveryStops);
    setCompletedStopIds([]);
    setSkippedStopIds([]);
    setActiveStopIndex(0);
    setWishlist(initialWishlistItems);
    setPinnedWishlistIds(['wish-1', 'wish-3']);
  };

  const clearAllData = () => {
    setStops([]);
    setCompletedStopIds([]);
    setSkippedStopIds([]);
    setActiveStopIndex(0);
    setWishlist([]);
    setPinnedWishlistIds([]);
    repo.deleteAllMyData();
  };

  const totalKm = stops.reduce((acc, s) => Math.max(acc, s.distanceKm), 0);
  const totalMinutes = stops.reduce((acc, s) => Math.max(acc, s.etaMinutes), 0);
  const totalParcels = stops.reduce((acc, s) => acc + s.parcelCount, 0);
  const parcelsDelivered = stops
    .filter((s) => completedStopIds.includes(s.id))
    .reduce((acc, s) => acc + s.parcelCount, 0);
  const totalCodAmount = stops.reduce((acc, s) => acc + (s.codAmount || 0), 0);
  const collectedCodAmount = stops
    .filter((s) => completedStopIds.includes(s.id))
    .reduce((acc, s) => acc + (s.codAmount || 0), 0);

  const highPriorityCount = stops.filter((s) => s.priority === 'high').length;
  const failedCount = stops.filter((s) => s.status === 'skipped' || (s.notes && s.notes.includes('[Failed:'))).length;
  const pendingCount = stops.filter((s) => s.status === 'pending').length;

  const timeSavedMinutes = Math.round(stops.length * 4.2);

  const stopBasePay = completedStopIds.length * riderPayPerStop;
  const codBonus = Math.round((collectedCodAmount * codBonusPercent) / 100);
  const kmAllowance = Math.round(totalKm * fuelAllowancePerKm);
  const estimatedEarnings = stopBasePay + codBonus + kmAllowance;

  const stats = {
    totalStops: stops.length,
    highPriorityCount,
    completedCount: completedStopIds.length,
    failedCount,
    pendingCount,
    totalKm,
    totalMinutes,
    timeSavedMinutes,
    parcelsDelivered,
    totalParcels,
    totalCodAmount,
    collectedCodAmount,
    estimatedEarnings,
  };

  const t = translations[language] || translations.en;

  return (
    <RouteContext.Provider
      value={{
        stops,
        activePlanId,
        activeStopIndex,
        completedStopIds,
        skippedStopIds,
        wishlist,
        pinnedWishlistIds,
        wishlistSettings,
        updateWishlistSettings,
        activeOnTheWayPrompt,
        triggerMockOnTheWayPrompt,
        dismissOnTheWayPrompt,
        addPromptAsNextStop,
        removeWishlistItem,
        language,
        t,
        highContrast,
        vehicle,
        textSize,
        setTextSize,
        blockBackgroundTracking,
        setBlockBackgroundTracking,
        locationOptIn,
        setLocationOptIn,
        riderPayPerStop,
        setRiderPayPerStop,
        codBonusPercent,
        setCodBonusPercent,
        fuelAllowancePerKm,
        setFuelAllowancePerKm,
        clearAllData,
        addStop,
        addMultipleStops,
        removeStop,
        updateStop,
        updateStopPriority,
        reorderStops,
        loadDemoDay,
        optimizeRoute,
        markStopComplete,
        markStopSkipped,
        markStopFailed,
        undoLastAction,
        lastAction,
        setActiveStopIndex,
        setLanguage,
        toggleHighContrast,
        toggleWishlistPin,
        addWishlistItem,
        resetToMockData,
        stats,
      }}
    >
      {children}
    </RouteContext.Provider>
  );
};

export const useRoute = () => {
  const context = useContext(RouteContext);
  if (!context) {
    throw new Error('useRoute must be used within a RouteProvider');
  }
  return context;
};
