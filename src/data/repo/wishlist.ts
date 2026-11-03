import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { WishlistItem, initialWishlistItems } from '../wishlistItems';
import { WishlistItemRecord, ErrandCategory, WishlistStatus } from './types';
import { getActiveUser, isGuestMode } from './sessionHelper';
import { enqueueSyncAction } from './syncQueue';

const STORAGE_WISHLIST_KEY = 'routewala_v1_state_wishlist';

function normalizeCategory(cat: string): ErrandCategory {
  if (cat === 'chai') return 'food';
  const valid: ErrandCategory[] = ['shop', 'pharmacy', 'atm', 'food', 'fuel', 'restroom', 'water', 'other'];
  if (valid.includes(cat as ErrandCategory)) return cat as ErrandCategory;
  return 'other';
}

export function dbToWishlistItem(rec: WishlistItemRecord): WishlistItem {
  return {
    id: rec.id,
    name: rec.text,
    category: rec.category === 'food' ? 'food' : (rec.category as any),
    landmark: rec.place_name || rec.landmark || 'Corridor Spot',
    area: rec.area || 'Mumbai Central',
    distanceOffRouteMeters: rec.distance_off_route_meters ?? 250,
    detourMinutes: rec.detour_minutes ?? 3,
    detourBudgetMinutes: rec.detour_budget_min ?? 5,
    rating: rec.rating ?? 4.5,
    note: rec.place_name ? `Near ${rec.place_name}` : '',
    isPinned: rec.is_pinned ?? rec.status === 'open',
    coordinates: {
      lat: rec.lat,
      lng: rec.lng,
    },
  };
}

export function wishlistItemToDb(
  item: Partial<WishlistItem>,
  userId?: string
): Partial<WishlistItemRecord> {
  return {
    ...(item.id ? { id: item.id } : {}),
    ...(userId ? { user_id: userId } : {}),
    text: item.name || 'Personal Errand',
    category: normalizeCategory(item.category || 'shop'),
    place_name: item.landmark || item.name || 'Mumbai Store',
    lat: item.coordinates?.lat ?? 19.018,
    lng: item.coordinates?.lng ?? 72.842,
    detour_budget_min: item.detourBudgetMinutes ?? item.detourMinutes ?? 5,
    status: 'open',
    area: item.area,
    landmark: item.landmark,
    distance_off_route_meters: item.distanceOffRouteMeters,
    detour_minutes: item.detourMinutes,
    is_pinned: item.isPinned,
  };
}

export function getLocalWishlist(): WishlistItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_WISHLIST_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return initialWishlistItems;
}

export function saveLocalWishlist(items: WishlistItem[]): void {
  try {
    localStorage.setItem(STORAGE_WISHLIST_KEY, JSON.stringify(items));
  } catch {}
}

/**
 * Lists all wishlist errands for user
 */
export async function listWishlist(_userId?: string): Promise<WishlistItem[]> {
  const user = await getActiveUser();

  if (!user || isGuestMode() || !isSupabaseConfigured) {
    return getLocalWishlist();
  }

  const { data, error } = await supabase
    .from('wishlist_items')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error || !data || data.length === 0) {
    return getLocalWishlist();
  }

  return data.map((rec) => dbToWishlistItem(rec as WishlistItemRecord));
}

/**
 * Adds an item to the on-the-way wishlist
 */
export async function addWishlistItem(
  item: Omit<WishlistItem, 'id'>
): Promise<WishlistItem> {
  const user = await getActiveUser();
  const localList = getLocalWishlist();

  const newItem: WishlistItem = {
    ...item,
    id: `wish-${Date.now()}`,
  };

  const updatedLocal = [newItem, ...localList];
  saveLocalWishlist(updatedLocal);

  if (!user || isGuestMode() || !isSupabaseConfigured) {
    return newItem;
  }

  const dbRecord = wishlistItemToDb(newItem, user.id);
  delete dbRecord.id;

  try {
    const { data, error } = await supabase
      .from('wishlist_items')
      .insert({
        ...dbRecord,
        user_id: user.id,
      })
      .select()
      .single();

    if (error) {
      console.warn('addWishlistItem Supabase error, enqueuing:', error.message);
      enqueueSyncAction('addWishlistItem', { item: newItem });
      return newItem;
    }

    return dbToWishlistItem(data as WishlistItemRecord);
  } catch {
    enqueueSyncAction('addWishlistItem', { item: newItem });
    return newItem;
  }
}

/**
 * Updates status of a wishlist item (open | added | done | dismissed)
 */
export async function updateWishlistStatus(
  itemId: string,
  status: WishlistStatus
): Promise<void> {
  const user = await getActiveUser();
  const localList = getLocalWishlist();

  if (status === 'dismissed' || status === 'done') {
    const filtered = localList.filter((w) => w.id !== itemId);
    saveLocalWishlist(filtered);
  }

  if (!user || isGuestMode() || !isSupabaseConfigured) {
    return;
  }

  try {
    const { error } = await supabase
      .from('wishlist_items')
      .update({ status })
      .eq('id', itemId)
      .eq('user_id', user.id);

    if (error) {
      enqueueSyncAction('updateWishlistStatus', { itemId, status });
    }
  } catch {
    enqueueSyncAction('updateWishlistStatus', { itemId, status });
  }
}

/**
 * Removes an item from the wishlist
 */
export async function deleteWishlistItem(itemId: string): Promise<void> {
  const user = await getActiveUser();
  const localList = getLocalWishlist();
  const filtered = localList.filter((w) => w.id !== itemId);
  saveLocalWishlist(filtered);

  if (!user || isGuestMode() || !isSupabaseConfigured) {
    return;
  }

  try {
    await supabase.from('wishlist_items').delete().eq('id', itemId).eq('user_id', user.id);
  } catch {}
}

