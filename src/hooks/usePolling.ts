import { useEffect, useRef } from 'react';

export function usePolling(fn: () => Promise<void>, intervalMs = 20000, maxAttempts = 3) {
  const attempts = useRef(0);

  useEffect(() => {
    let cancelled = false;

    async function tick() {
      if (cancelled || attempts.current >= maxAttempts) return;
      attempts.current += 1;
      try {
        await fn();
        cancelled = true; // stop on success
      } catch {
        // ignore and retry
        setTimeout(tick, intervalMs);
      }
    }
    tick();
    return () => {
      cancelled = true;
    };
  }, [fn, intervalMs, maxAttempts]);
}
