import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { WishlistPromptRecord } from './types';
import { getActiveUser, isGuestMode } from './sessionHelper';
import { enqueueSyncAction } from './syncQueue';

const STORAGE_PROMPTS_KEY = 'routewala_v1_prompts_log';

function getLocalPrompts(): WishlistPromptRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_PROMPTS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
}

function saveLocalPrompts(prompts: WishlistPromptRecord[]): void {
  try {
    localStorage.setItem(STORAGE_PROMPTS_KEY, JSON.stringify(prompts));
  } catch {}
}

/**
 * Logs a detour pitstop prompt shown to the rider
 */
export async function logPrompt(
  prompt: Omit<WishlistPromptRecord, 'id' | 'shown_at'>
): Promise<WishlistPromptRecord> {
  const user = await getActiveUser();
  const newPrompt: WishlistPromptRecord = {
    ...prompt,
    id: `prompt-${Date.now()}`,
    user_id: user?.id,
    shown_at: new Date().toISOString(),
  };

  const local = getLocalPrompts();
  local.push(newPrompt);
  saveLocalPrompts(local);

  if (!user || isGuestMode() || !isSupabaseConfigured) {
    return newPrompt;
  }

  try {
    const { data, error } = await supabase
      .from('wishlist_prompts')
      .insert({
        user_id: user.id,
        plan_id: prompt.plan_id || null,
        item_id: prompt.item_id,
        detour_m: prompt.detour_m,
        detour_min: prompt.detour_min,
        action: prompt.action,
        shown_at: newPrompt.shown_at,
      })
      .select()
      .single();

    if (error) {
      enqueueSyncAction('logPrompt', prompt);
      return newPrompt;
    }

    return data as WishlistPromptRecord;
  } catch {
    enqueueSyncAction('logPrompt', prompt);
    return newPrompt;
  }
}

/**
 * Counts prompts shown today to respect max_alerts_per_day
 */
export async function countPromptsToday(
  _userId?: string,
  planId?: string
): Promise<number> {
  const user = await getActiveUser();
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const startIso = startOfDay.toISOString();

  if (!user || isGuestMode() || !isSupabaseConfigured) {
    const local = getLocalPrompts();
    return local.filter((p) => (p.shown_at || '') >= startIso).length;
  }

  try {
    let query = supabase
      .from('wishlist_prompts')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .gte('shown_at', startIso);

    if (planId) {
      query = query.eq('plan_id', planId);
    }

    const { count, error } = await query;
    if (error || count === null) {
      const local = getLocalPrompts();
      return local.filter((p) => (p.shown_at || '') >= startIso).length;
    }

    return count;
  } catch {
    const local = getLocalPrompts();
    return local.filter((p) => (p.shown_at || '') >= startIso).length;
  }
}

