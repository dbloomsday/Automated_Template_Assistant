import { useEffect, useRef } from 'react';

export function usePolling(
  fn: () => Promise<void>,
  intervalMs = 20_000,
  maxAttempts = 3,
) {
  const attempts = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    attempts.current = 0; // reset when deps change
    let cancelled = false;

    async function tick() {
      if (cancelled || attempts.current >= maxAttempts) return;
      attempts.current += 1;
      try {
        await fn();
        cancelled = true; // stop on success
      } catch {
        // ignore and retry
        timer.current = setTimeout(tick, intervalMs);
      }
    }

    tick();
    return () => {
      cancelled = true;
      if (timer.current) clearTimeout(timer.current);
    };
  }, [fn, intervalMs, maxAttempts]);
}
