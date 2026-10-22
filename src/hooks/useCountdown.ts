import { useEffect, useState } from "react";

export function useCountdown(expiresAt?: string | null) {
  const [remainingMs, setRemainingMs] = useState(0);

  useEffect(() => {
    if (!expiresAt) {
      setRemainingMs(0);
      return;
    }
    const expires = expiresAt;
    function tick() {
      setRemainingMs(Math.max(0, new Date(expires).getTime() - Date.now()));
    }
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [expiresAt]);

  return remainingMs;
}
