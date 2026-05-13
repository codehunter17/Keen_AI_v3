// IndexedDB wrapper — typed, promise-based.
// Stores three things:
//   1. "foods"        — the full FOOD_DB cached locally (read-only)
//   2. "meal-queue"   — pending meal logs waiting to sync to server
//   3. "meta"         — DB version, last-sync timestamp, etc.
//
// Browser support: all modern phones. Falls through gracefully if IDB missing
// (older WebView) — meal logger then runs in network-only mode.

"use client";

import { FOOD_DB, FOOD_DB_VERSION, type Food } from "@/lib/food-db";

const DB_NAME = "nutrimama";
const DB_VERSION = 1;

let _dbPromise: Promise<IDBDatabase> | null = null;

function openDb(): Promise<IDBDatabase> {
  if (_dbPromise) return _dbPromise;
  _dbPromise = new Promise((resolve, reject) => {
    if (typeof indexedDB === "undefined") {
      reject(new Error("IndexedDB not available"));
      return;
    }
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains("foods")) {
        const store = db.createObjectStore("foods", { keyPath: "id" });
        store.createIndex("name", "name", { unique: false });
        store.createIndex("category", "category", { unique: false });
      }
      if (!db.objectStoreNames.contains("meal-queue")) {
        db.createObjectStore("meal-queue", { keyPath: "id", autoIncrement: true });
      }
      if (!db.objectStoreNames.contains("meta")) {
        db.createObjectStore("meta", { keyPath: "key" });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
  return _dbPromise;
}

function tx<T = void>(
  storeName: string,
  mode: IDBTransactionMode,
  work: (store: IDBObjectStore) => Promise<T> | T,
): Promise<T> {
  return openDb().then(
    (db) =>
      new Promise<T>((resolve, reject) => {
        const transaction = db.transaction(storeName, mode);
        const store = transaction.objectStore(storeName);
        Promise.resolve(work(store))
          .then((res) => {
            transaction.oncomplete = () => resolve(res);
            transaction.onerror = () => reject(transaction.error);
            transaction.onabort = () => reject(transaction.error);
          })
          .catch(reject);
      }),
  );
}

// ─── Food store ──────────────────────────────────────────────
export async function ensureFoodsLoaded(): Promise<void> {
  try {
    const meta = await tx<{ value?: string } | undefined>("meta", "readonly", (s) =>
      promisify<{ value?: string } | undefined>(s.get("foods-version")),
    );
    if (meta?.value === FOOD_DB_VERSION) return;
    await tx<void>("foods", "readwrite", async (s) => {
      s.clear();
      for (const f of FOOD_DB) s.put(f);
    });
    await tx<void>("meta", "readwrite", (s) => {
      s.put({ key: "foods-version", value: FOOD_DB_VERSION });
    });
  } catch {
    // IndexedDB unavailable — silently fall through.
  }
}

export async function searchFoodsOffline(query: string, limit = 10): Promise<Food[]> {
  const q = query.toLowerCase().trim();
  if (q.length < 2) return [];
  try {
    const all = await tx<Food[]>("foods", "readonly", (s) =>
      promisify<Food[]>(s.getAll() as IDBRequest<Food[]>),
    );
    const scored: { f: Food; score: number }[] = [];
    for (const f of all) {
      let score = 0;
      if (f.name.toLowerCase().startsWith(q)) score += 10;
      else if (f.name.toLowerCase().includes(q)) score += 6;
      if (f.hi && f.hi.includes(q)) score += 8;
      for (const a of f.aliases ?? []) {
        if (a.toLowerCase().startsWith(q)) score += 9;
        else if (a.toLowerCase().includes(q)) score += 5;
      }
      if (score > 0) scored.push({ f, score });
    }
    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, limit).map((s) => s.f);
  } catch {
    return [];
  }
}

// ─── Meal queue ──────────────────────────────────────────────
export interface QueuedMeal {
  id?: number;
  type: "breakfast" | "lunch" | "dinner" | "snack";
  foodId: string;
  foodName: string;
  servings: number;
  loggedAt: number;       // epoch ms
  synced: boolean;
}

export async function enqueueMeal(meal: Omit<QueuedMeal, "id" | "synced">): Promise<number> {
  return tx<number>("meal-queue", "readwrite", (s) =>
    promisify<number>(s.add({ ...meal, synced: false }) as IDBRequest<IDBValidKey>) as Promise<number>,
  );
}

export async function getPendingMeals(): Promise<QueuedMeal[]> {
  try {
    const all = await tx<QueuedMeal[]>("meal-queue", "readonly", (s) =>
      promisify<QueuedMeal[]>(s.getAll() as IDBRequest<QueuedMeal[]>),
    );
    return all.filter((m) => !m.synced);
  } catch {
    return [];
  }
}

export async function markMealsSynced(ids: number[]): Promise<void> {
  if (ids.length === 0) return;
  await tx<void>("meal-queue", "readwrite", async (s) => {
    for (const id of ids) {
      const cur = await promisify<QueuedMeal | undefined>(s.get(id) as IDBRequest<QueuedMeal | undefined>);
      if (cur) s.put({ ...cur, synced: true });
    }
  });
  // Periodic GC: remove synced rows older than 7 days.
  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60_000;
  await tx<void>("meal-queue", "readwrite", async (s) => {
    const all = await promisify<QueuedMeal[]>(s.getAll() as IDBRequest<QueuedMeal[]>);
    for (const m of all) {
      if (m.synced && m.loggedAt < sevenDaysAgo && m.id != null) s.delete(m.id);
    }
  });
}

// ─── helpers ─────────────────────────────────────────────────
function promisify<T>(req: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}
