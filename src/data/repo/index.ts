import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import {
  getPendingQueue,
  replaySyncQueue,
  getPendingQueueCount,
  subscribeToSyncQueue,
  QueuedAction,
} from './syncQueue';
import { getActiveUser } from './sessionHelper';

export * from './types';
export * from './plans';
export * from './stops';
export * from './wishlist';
export * from './settings';
export * from './prompts';
export * from './sessionHelper';
export * from './syncQueue';

/**
 * Global offline sync executor that replays pending actions in FIFO order
 */
async function executeQueuedAction(action: QueuedAction): Promise<boolean> {
  const user = await getActiveUser();
  if (!user || !isSupabaseConfigured) return false;

  try {
    switch (action.type) {
      case 'markStopStatus': {
        const { stopId, status, completedAt, failReason } = action.payload;
        const { error } = await supabase
          .from('stops')
          .update({
            status,
            completed_at: completedAt,
            fail_reason: failReason,
          })
          .eq('id', stopId)
          .eq('user_id', user.id);
        return !error;
      }

      case 'saveOptimisedOrder': {
        const { planId, stopIds } = action.payload;
        const { error } = await supabase.rpc('reorder_stops', {
          p_plan: planId,
          p_ids: stopIds,
        });
        return !error;
      }

      case 'addStop': {
        const { stop, planId } = action.payload;
        const { error } = await supabase.from('stops').insert({
          user_id: user.id,
          plan_id: planId,
          name: stop.recipientName,
          address: stop.address,
          lat: stop.coordinates?.lat || 19.0178,
          lng: stop.coordinates?.lng || 72.8428,
          priority: stop.priority || 'medium',
          type: stop.type || 'drop',
          sequence: stop.order || 1,
          eta: stop.etaMinutes || 15,
          status: 'pending',
          phone: stop.phone || null,
          cod_amount: stop.codAmount || 0,
          note: stop.notes || null,
        });
        return !error;
      }

      case 'updateStop': {
        const { id, updates } = action.payload;
        const dbUpdates: any = {};
        if (updates.recipientName) dbUpdates.name = updates.recipientName;
        if (updates.phone !== undefined) dbUpdates.phone = updates.phone;
        if (updates.address) dbUpdates.address = updates.address;
        if (updates.priority) dbUpdates.priority = updates.priority;
        if (updates.notes !== undefined) dbUpdates.note = updates.notes;
        const { error } = await supabase
          .from('stops')
          .update(dbUpdates)
          .eq('id', id)
          .eq('user_id', user.id);
        return !error;
      }

      case 'deleteStop': {
        const { id } = action.payload;
        const { error } = await supabase.from('stops').delete().eq('id', id).eq('user_id', user.id);
        return !error;
      }

      case 'addWishlistItem': {
        const { item } = action.payload;
        const { error } = await supabase.from('wishlist_items').insert({
          user_id: user.id,
          text: item.name,
          category: item.category || 'shop',
          place_name: item.landmark || item.name,
          lat: item.coordinates?.lat || 19.018,
          lng: item.coordinates?.lng || 72.842,
          detour_budget_min: item.detourBudgetMinutes || 5,
          status: 'open',
        });
        return !error;
      }

      case 'updateWishlistStatus': {
        const { itemId, status } = action.payload;
        const { error } = await supabase
          .from('wishlist_items')
          .update({ status })
          .eq('id', itemId)
          .eq('user_id', user.id);
        return !error;
      }

      case 'updateSettings': {
        const { error } = await supabase
          .from('user_settings')
          .update(action.payload)
          .eq('user_id', user.id);
        return !error;
      }

      case 'logPrompt': {
        const { error } = await supabase.from('wishlist_prompts').insert({
          user_id: user.id,
          ...action.payload,
        });
        return !error;
      }

      default:
        return true;
    }
  } catch (err) {
    console.error('Error executing queued action:', err);
    return false;
  }
}

// Auto-trigger replay when network connectivity returns
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    console.log('Network online detected: attempting sync queue replay...');
    replaySyncQueue(executeQueuedAction);
  });
}

