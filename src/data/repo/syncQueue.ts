/**
 * Offline Sync Queue for RouteWala
 * Stores pending mutations in localStorage when offline or network fails,
 * and replays them in FIFO order as soon as network returns.
 */

export interface QueuedAction {
  id: string;
  type:
    | 'markStopStatus'
    | 'addStop'
    | 'updateStop'
    | 'deleteStop'
    | 'saveOptimisedOrder'
    | 'addWishlistItem'
    | 'updateWishlistStatus'
    | 'updateSettings'
    | 'logPrompt';
  payload: any;
  timestamp: number;
  retries: number;
}

const SYNC_QUEUE_KEY = 'routewala_sync_queue_v1';
const QUEUE_EVENT_NAME = 'routewala:sync_queue_changed';

export function getPendingQueue(): QueuedAction[] {
  try {
    const raw = localStorage.getItem(SYNC_QUEUE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function getPendingQueueCount(): number {
  return getPendingQueue().length;
}

export function saveQueue(queue: QueuedAction[]): void {
  try {
    localStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(queue));
    window.dispatchEvent(new CustomEvent(QUEUE_EVENT_NAME, { detail: { count: queue.length } }));
  } catch (err) {
    console.error('Failed to save sync queue:', err);
  }
}

export function enqueueSyncAction(
  type: QueuedAction['type'],
  payload: any
): QueuedAction {
  const queue = getPendingQueue();
  const action: QueuedAction = {
    id: `queue-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    type,
    payload,
    timestamp: Date.now(),
    retries: 0,
  };

  queue.push(action);
  saveQueue(queue);
  return action;
}

export function dequeueSyncAction(actionId: string): void {
  const queue = getPendingQueue().filter((a) => a.id !== actionId);
  saveQueue(queue);
}

export function clearSyncQueue(): void {
  saveQueue([]);
}

let isReplaying = false;

/**
 * Replays all queued actions using the provided executor map
 */
export async function replaySyncQueue(
  executor: (action: QueuedAction) => Promise<boolean>
): Promise<{ successful: number; remaining: number }> {
  if (isReplaying) return { successful: 0, remaining: getPendingQueueCount() };
  isReplaying = true;

  try {
    const queue = getPendingQueue();
    if (queue.length === 0) return { successful: 0, remaining: 0 };

    let successCount = 0;
    const remaining: QueuedAction[] = [];

    for (const action of queue) {
      try {
        const ok = await executor(action);
        if (ok) {
          successCount++;
        } else {
          action.retries += 1;
          remaining.push(action);
        }
      } catch {
        action.retries += 1;
        remaining.push(action);
      }
    }

    saveQueue(remaining);
    return { successful: successCount, remaining: remaining.length };
  } finally {
    isReplaying = false;
  }
}

export function subscribeToSyncQueue(callback: (count: number) => void): () => void {
  const handler = (e: Event) => {
    const detail = (e as CustomEvent).detail;
    callback(detail?.count ?? getPendingQueueCount());
  };

  window.addEventListener(QUEUE_EVENT_NAME, handler);
  // Also listen for storage events across tabs
  const storageHandler = (e: StorageEvent) => {
    if (e.key === SYNC_QUEUE_KEY) {
      callback(getPendingQueueCount());
    }
  };
  window.addEventListener('storage', storageHandler);

  return () => {
    window.removeEventListener(QUEUE_EVENT_NAME, handler);
    window.removeEventListener('storage', storageHandler);
  };
}

