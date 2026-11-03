import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { UserSettingsRecord } from './types';
import { getActiveUser, isGuestMode } from './sessionHelper';
import { enqueueSyncAction, clearSyncQueue } from './syncQueue';

const STORAGE_SETTINGS_KEY = 'routewala_v1_state_settings';

const defaultSettings: UserSettingsRecord = {
  strict_priority: false,
  detour_budget_min: 5,
  daily_detour_budget_min: 15,
  max_alerts_per_day: 3,
  quiet_mode: false,
  high_contrast: false,
  text_size: 'normal',
  location_opt_in: false,
  language: 'en',
  vehicle_type: 'motorcycle',
  rate_per_stop: 45,
  cod_bonus_percent: 2,
  fuel_allowance_per_km: 4,
};

export function getLocalSettings(): UserSettingsRecord {
  try {
    const raw = localStorage.getItem(STORAGE_SETTINGS_KEY);
    if (raw) {
      return { ...defaultSettings, ...JSON.parse(raw) };
    }
    // Check individual keys
    const lang = localStorage.getItem('routewala_v1_state_lang');
    const contrast = localStorage.getItem('routewala_v1_state_contrast');
    const textSize = localStorage.getItem('routewala_v1_state_text_size');
    const locationOptIn = localStorage.getItem('routewala_v1_state_location_opt_in');

    return {
      ...defaultSettings,
      language: (lang as any) || defaultSettings.language,
      high_contrast: contrast === 'true',
      text_size: (textSize as any) || defaultSettings.text_size,
      location_opt_in: locationOptIn === 'true',
    };
  } catch {
    return defaultSettings;
  }
}

export function saveLocalSettings(settings: UserSettingsRecord): void {
  try {
    localStorage.setItem(STORAGE_SETTINGS_KEY, JSON.stringify(settings));
    if (settings.language) localStorage.setItem('routewala_v1_state_lang', settings.language);
    if (settings.high_contrast !== undefined) {
      localStorage.setItem('routewala_v1_state_contrast', String(settings.high_contrast));
    }
    if (settings.text_size) {
      localStorage.setItem('routewala_v1_state_text_size', settings.text_size);
    }
    if (settings.location_opt_in !== undefined) {
      localStorage.setItem('routewala_v1_state_location_opt_in', String(settings.location_opt_in));
    }
  } catch {}
}

/**
 * Gets user settings from Supabase or localStorage
 */
export async function getSettings(_userId?: string): Promise<UserSettingsRecord> {
  const user = await getActiveUser();

  if (!user || isGuestMode() || !isSupabaseConfigured) {
    return getLocalSettings();
  }

  try {
    const { data, error } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (error || !data) {
      return getLocalSettings();
    }

    // Also fetch profile preferences (display_name, language, vehicle_type)
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    const merged: UserSettingsRecord = {
      ...defaultSettings,
      user_id: user.id,
      strict_priority: data.strict_priority ?? false,
      detour_budget_min: data.detour_budget_min ?? 5,
      daily_detour_budget_min: data.daily_detour_budget_min ?? 15,
      max_alerts_per_day: data.max_alerts_per_day ?? 3,
      quiet_mode: data.quiet_mode ?? false,
      high_contrast: data.high_contrast ?? false,
      text_size: data.text_size === 'xl' ? 'xl' : data.text_size === 'large' ? 'large' : 'normal',
      location_opt_in: data.location_opt_in ?? false,
      display_name: profile?.display_name || user.email?.split('@')[0] || 'Rider',
      language: profile?.language || 'en',
      vehicle_type: profile?.vehicle_type || 'motorcycle',
    };

    saveLocalSettings(merged);
    return merged;
  } catch {
    return getLocalSettings();
  }
}

/**
 * Updates user settings
 */
export async function updateSettings(
  updates: Partial<UserSettingsRecord>
): Promise<void> {
  const current = getLocalSettings();
  const merged: UserSettingsRecord = { ...current, ...updates };
  saveLocalSettings(merged);

  const user = await getActiveUser();
  if (!user || isGuestMode() || !isSupabaseConfigured) {
    return;
  }

  try {
    // Map to user_settings columns
    const dbSettings: any = {};
    if (updates.strict_priority !== undefined) dbSettings.strict_priority = updates.strict_priority;
    if (updates.detour_budget_min !== undefined) dbSettings.detour_budget_min = updates.detour_budget_min;
    if (updates.daily_detour_budget_min !== undefined) dbSettings.daily_detour_budget_min = updates.daily_detour_budget_min;
    if (updates.max_alerts_per_day !== undefined) dbSettings.max_alerts_per_day = updates.max_alerts_per_day;
    if (updates.quiet_mode !== undefined) dbSettings.quiet_mode = updates.quiet_mode;
    if (updates.high_contrast !== undefined) dbSettings.high_contrast = updates.high_contrast;
    if (updates.text_size !== undefined) {
      dbSettings.text_size = updates.text_size === 'xl' ? 'xl' : updates.text_size === 'large' ? 'large' : 'normal';
    }
    if (updates.location_opt_in !== undefined) dbSettings.location_opt_in = updates.location_opt_in;

    if (Object.keys(dbSettings).length > 0) {
      await supabase
        .from('user_settings')
        .update(dbSettings)
        .eq('user_id', user.id);
    }

    // Map profile updates if present
    const profileUpdates: any = {};
    if (updates.display_name !== undefined) profileUpdates.display_name = updates.display_name;
    if (updates.language !== undefined) profileUpdates.language = updates.language;
    if (updates.vehicle_type !== undefined) profileUpdates.vehicle_type = updates.vehicle_type;

    if (Object.keys(profileUpdates).length > 0) {
      await supabase
        .from('profiles')
        .update(profileUpdates)
        .eq('id', user.id);
    }
  } catch (err) {
    enqueueSyncAction('updateSettings', updates);
  }
}

/**
 * Deletes all user data from Supabase and clears local storage
 */
export async function deleteAllMyData(_userId?: string): Promise<void> {
  const user = await getActiveUser();

  // Clear all local storage records
  const keysToRemove = [
    'routewala_v1_state_stops',
    'routewala_v1_state_active_idx',
    'routewala_v1_state_completed',
    'routewala_v1_state_wishlist',
    'routewala_v1_state_pinned_wishlist',
    'routewala_v1_state_settings',
    'routewala_plans_v1',
  ];
  keysToRemove.forEach((key) => localStorage.removeItem(key));
  clearSyncQueue();

  if (!user || isGuestMode() || !isSupabaseConfigured) {
    return;
  }

  // Delete all rows in Supabase for user
  try {
    await supabase.from('wishlist_prompts').delete().eq('user_id', user.id);
  } catch {}

  try {
    await supabase.from('stops').delete().eq('user_id', user.id);
  } catch {}

  try {
    await supabase.from('route_plans').delete().eq('user_id', user.id);
  } catch {}

  try {
    await supabase.from('wishlist_items').delete().eq('user_id', user.id);
  } catch {}
}

