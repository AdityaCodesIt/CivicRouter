import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { DeliveryStop, initialDeliveryStops, PriorityLevel } from '../mockStops';
import { StopRecord, DbStopStatus } from './types';
import { getActiveUser, isGuestMode } from './sessionHelper';
import { enqueueSyncAction } from './syncQueue';

const STORAGE_STOPS_KEY = 'routewala_v1_state_stops';

export function dbToDeliveryStop(s: StopRecord): DeliveryStop {
  const uiStatus =
    s.status === 'delivered'
      ? 'completed'
      : s.status === 'failed' || s.status === 'skipped'
      ? 'skipped'
      : s.status === 'pending'
      ? 'pending'
      : 'in_progress';

  return {
    id: s.id,
    order: s.sequence || 1,
    recipientName: s.name || 'Recipient',
    phone: s.phone || '+91 98200 00000',
    address: s.address || 'Mumbai Corridor',
    area: s.area || 'Mumbai Central',
    landmark: s.landmark || 'Near Junction',
    priority: s.priority || 'medium',
    type: s.type === 'pickup' ? 'pickup' : 'drop',
    deadline: s.deadline || undefined,
    parcelCount: s.parcel_count || 1,
    codAmount: typeof s.cod_amount === 'number' ? s.cod_amount : 0,
    status: uiStatus,
    etaMinutes: typeof s.eta === 'number' ? s.eta : 15,
    distanceKm: 2.0,
    notes: s.note || (s.fail_reason ? `[Failed: ${s.fail_reason}]` : undefined),
    coordinates: {
      lat: typeof s.lat === 'number' ? s.lat : 19.0178,
      lng: typeof s.lng === 'number' ? s.lng : 72.8428,
    },
    pairedStopId: s.pair_id || undefined,
  };
}

export function deliveryStopToDb(
  stop: Partial<DeliveryStop>,
  planId?: string,
  userId?: string
): Partial<StopRecord> {
  const dbStatus: DbStopStatus =
    stop.status === 'completed'
      ? 'delivered'
      : stop.status === 'skipped'
      ? 'skipped'
      : 'pending';

  return {
    ...(stop.id ? { id: stop.id } : {}),
    ...(planId ? { plan_id: planId } : {}),
    ...(userId ? { user_id: userId } : {}),
    name: stop.recipientName || 'Recipient',
    address: `${stop.address || ''}${stop.area ? `, ${stop.area}` : ''}`,
    lat: stop.coordinates?.lat ?? 19.0178,
    lng: stop.coordinates?.lng ?? 72.8428,
    priority: stop.priority ?? 'medium',
    deadline: stop.deadline || null,
    type: stop.type === 'pickup' ? 'pickup' : 'drop',
    pair_id: stop.pairedStopId || null,
    phone: stop.phone || null,
    cod_amount: stop.codAmount ?? 0,
    note: stop.notes || null,
    sequence: stop.order ?? 1,
    eta: stop.etaMinutes ?? 15,
    status: dbStatus,
    fail_reason: null,
    completed_at: stop.status === 'completed' ? new Date().toISOString() : null,
    area: stop.area,
    landmark: stop.landmark,
    parcel_count: stop.parcelCount,
  };
}

export function getLocalStops(): DeliveryStop[] {
  try {
    const raw = localStorage.getItem(STORAGE_STOPS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return initialDeliveryStops;
}

export function saveLocalStops(stops: DeliveryStop[]): void {
  try {
    localStorage.setItem(STORAGE_STOPS_KEY, JSON.stringify(stops));
  } catch {}
}

/**
 * Lists stops for active plan
 */
export async function listStops(planId?: string): Promise<DeliveryStop[]> {
  const user = await getActiveUser();

  if (!user || isGuestMode() || !isSupabaseConfigured) {
    return getLocalStops();
  }

  let query = supabase.from('stops').select('*').eq('user_id', user.id).order('sequence', { ascending: true });
  if (planId) {
    query = query.eq('plan_id', planId);
  }

  const { data, error } = await query;
  if (error || !data || data.length === 0) {
    return getLocalStops();
  }

  return data.map((rec) => dbToDeliveryStop(rec as StopRecord));
}

/**
 * Adds a new stop to the delivery manifest
 */
export async function addStop(
  stopData: Omit<DeliveryStop, 'id' | 'order' | 'status'>,
  planId?: string
): Promise<DeliveryStop> {
  const user = await getActiveUser();
  const localStops = getLocalStops();

  const newStop: DeliveryStop = {
    ...stopData,
    id: `stop-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    order: localStops.length + 1,
    status: 'pending',
  };

  // Always update local cache for instant UI
  const updatedLocal = [...localStops, newStop];
  saveLocalStops(updatedLocal);

  if (!user || isGuestMode() || !isSupabaseConfigured) {
    return newStop;
  }

  // Insert to Supabase
  const dbRecord = deliveryStopToDb(newStop, planId, user.id);
  delete dbRecord.id; // Allow Supabase to generate UUID if needed, or keep if uuid

  try {
    const { data, error } = await supabase
      .from('stops')
      .insert({
        ...dbRecord,
        user_id: user.id,
      })
      .select()
      .single();

    if (error) {
      console.warn('addStop Supabase insert failed, enqueued for retry:', error.message);
      enqueueSyncAction('addStop', { stop: newStop, planId });
      return newStop;
    }

    return dbToDeliveryStop(data as StopRecord);
  } catch (err) {
    enqueueSyncAction('addStop', { stop: newStop, planId });
    return newStop;
  }
}

/**
 * Updates an existing stop
 */
export async function updateStop(
  id: string,
  updates: Partial<DeliveryStop>
): Promise<void> {
  const user = await getActiveUser();
  const localStops = getLocalStops();
  const updatedLocal = localStops.map((s) => (s.id === id ? { ...s, ...updates } : s));
  saveLocalStops(updatedLocal);

  if (!user || isGuestMode() || !isSupabaseConfigured) {
    return;
  }

  try {
    const dbUpdates: Partial<StopRecord> = {};
    if (updates.recipientName) dbUpdates.name = updates.recipientName;
    if (updates.phone !== undefined) dbUpdates.phone = updates.phone;
    if (updates.address) dbUpdates.address = updates.address;
    if (updates.priority) dbUpdates.priority = updates.priority;
    if (updates.type) dbUpdates.type = updates.type === 'pickup' ? 'pickup' : 'drop';
    if (updates.deadline !== undefined) dbUpdates.deadline = updates.deadline;
    if (updates.codAmount !== undefined) dbUpdates.cod_amount = updates.codAmount;
    if (updates.notes !== undefined) dbUpdates.note = updates.notes;
    if (updates.coordinates) {
      dbUpdates.lat = updates.coordinates.lat;
      dbUpdates.lng = updates.coordinates.lng;
    }
    if (updates.order !== undefined) dbUpdates.sequence = updates.order;

    const { error } = await supabase
      .from('stops')
      .update(dbUpdates)
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      enqueueSyncAction('updateStop', { id, updates });
    }
  } catch {
    enqueueSyncAction('updateStop', { id, updates });
  }
}

/**
 * Deletes a stop by ID
 */
export async function deleteStop(id: string): Promise<void> {
  const user = await getActiveUser();
  const localStops = getLocalStops();
  const filtered = localStops
    .filter((s) => s.id !== id)
    .map((s, idx) => ({ ...s, order: idx + 1 }));
  saveLocalStops(filtered);

  if (!user || isGuestMode() || !isSupabaseConfigured) {
    return;
  }

  try {
    const { error } = await supabase.from('stops').delete().eq('id', id).eq('user_id', user.id);
    if (error) {
      enqueueSyncAction('deleteStop', { id });
    }
  } catch {
    enqueueSyncAction('deleteStop', { id });
  }
}

/**
 * Saves optimized stop sequence
 * Uses Supabase RPC: reorder_stops(p_plan, p_ids)
 */
export async function saveOptimisedOrder(
  planId: string,
  stopIds: string[]
): Promise<void> {
  const user = await getActiveUser();
  const localStops = getLocalStops();

  // Reorder local array to match stopIds
  const reordered: DeliveryStop[] = [];
  stopIds.forEach((id, index) => {
    const found = localStops.find((s) => s.id === id);
    if (found) {
      reordered.push({ ...found, order: index + 1 });
    }
  });
  saveLocalStops(reordered);

  if (!user || isGuestMode() || !isSupabaseConfigured) {
    return;
  }

  try {
    const { error } = await supabase.rpc('reorder_stops', {
      p_plan: planId,
      p_ids: stopIds,
    });

    if (error) {
      console.warn('reorder_stops RPC error, fallback to individual updates:', error.message);
      // Fallback: update sequences individually
      for (let i = 0; i < stopIds.length; i++) {
        await supabase
          .from('stops')
          .update({ sequence: i + 1 })
          .eq('id', stopIds[i])
          .eq('user_id', user.id);
      }
    }
  } catch (err) {
    enqueueSyncAction('saveOptimisedOrder', { planId, stopIds });
  }
}

/**
 * Updates delivery status of a stop (Delivered, Failed, Skipped)
 * Supports instant optimistic UI response + background queueing on failure.
 */
export async function markStopStatus(
  stopId: string,
  status: DbStopStatus,
  completedAt?: string | null,
  failReason?: string | null
): Promise<void> {
  const user = await getActiveUser();
  const localStops = getLocalStops();

  const uiStatus: 'pending' | 'in_progress' | 'completed' | 'skipped' =
    status === 'delivered'
      ? 'completed'
      : status === 'failed' || status === 'skipped'
      ? 'skipped'
      : 'pending';

  const updatedLocal = localStops.map((s) => {
    if (s.id === stopId) {
      return {
        ...s,
        status: uiStatus,
        notes: failReason ? `${s.notes ? s.notes + ' ' : ''}[Failed: ${failReason}]` : s.notes,
      };
    }
    return s;
  });
  saveLocalStops(updatedLocal);

  if (!user || isGuestMode() || !isSupabaseConfigured) {
    return;
  }

  const payload = {
    status,
    completed_at: completedAt ?? (status === 'delivered' ? new Date().toISOString() : null),
    fail_reason: failReason ?? null,
  };

  try {
    const { error } = await supabase
      .from('stops')
      .update(payload)
      .eq('id', stopId)
      .eq('user_id', user.id);

    if (error) {
      console.warn('markStopStatus Supabase update error, enqueuing for offline sync:', error.message);
      enqueueSyncAction('markStopStatus', { stopId, status, completedAt, failReason });
    }
  } catch {
    enqueueSyncAction('markStopStatus', { stopId, status, completedAt, failReason });
  }
}
