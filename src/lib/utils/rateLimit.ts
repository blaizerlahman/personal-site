type Entry = {
  count: number;
  reset: number;
};

const RATE_LIMIT = 20;       
const MIN = 60_000;   

const store = new Map<string, Entry>();

export function rateLimit(key: string): void {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || entry.reset < now) {
    store.set(key, {
      count: 1,
      reset: now + MIN
    });
    return;
  }

  if (entry.count >= RATE_LIMIT) {
    throw new Error("Rate limit exceeded.");
  }

  entry.count++;
}

