/**
 * Offline caching layer using localStorage.
 * Caches profile & leaderboard data, and queues mutations (XP, quiz scores)
 * to sync when back online.
 */

const CACHE_PREFIX = "vq_cache_";
const QUEUE_KEY = "vq_pending_actions";

// ── Read / Write cache ──

export function cacheSet<T>(key: string, data: T): void {
  try {
    localStorage.setItem(CACHE_PREFIX + key, JSON.stringify({ data, ts: Date.now() }));
  } catch {
    // quota exceeded – silently ignore
  }
}

export function cacheGet<T>(key: string, maxAgeMs = 1000 * 60 * 60 * 24): T | null {
  try {
    const raw = localStorage.getItem(CACHE_PREFIX + key);
    if (!raw) return null;
    const { data, ts } = JSON.parse(raw) as { data: T; ts: number };
    if (Date.now() - ts > maxAgeMs) return null;
    return data;
  } catch {
    return null;
  }
}

// ── Pending action queue (for offline mutations) ──

export interface PendingAction {
  id: string;
  type: "add_xp" | "save_score";
  payload: Record<string, unknown>;
  createdAt: number;
}

function getQueue(): PendingAction[] {
  try {
    return JSON.parse(localStorage.getItem(QUEUE_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveQueue(queue: PendingAction[]): void {
  try {
    localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
  } catch {
    // ignore
  }
}

export function enqueue(action: Omit<PendingAction, "id" | "createdAt">): void {
  const queue = getQueue();
  queue.push({ ...action, id: crypto.randomUUID(), createdAt: Date.now() });
  saveQueue(queue);
}

export function dequeue(id: string): void {
  saveQueue(getQueue().filter((a) => a.id !== id));
}

export function getPendingActions(): PendingAction[] {
  return getQueue();
}

export function clearPending(): void {
  localStorage.removeItem(QUEUE_KEY);
}
