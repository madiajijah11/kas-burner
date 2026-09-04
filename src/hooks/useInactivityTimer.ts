import { useState, useEffect, useCallback, useRef } from 'react';

export interface UseInactivityTimerOptions {
  durationMinutes: number;
  balanceKAS: number;
  isEnabled: boolean;
  onExpire: () => void;
}

export function useInactivityTimer({
  durationMinutes,
  balanceKAS,
  isEnabled,
  onExpire,
}: UseInactivityTimerOptions) {
  const [duration, setDuration] = useState<number>(durationMinutes);
  const [remainingSeconds, setRemainingSeconds] = useState<number>(durationMinutes * 60);
  const [isBlockedByBalance, setIsBlockedByBalance] = useState<boolean>(false);

  const lastActivityRef = useRef<number>(Date.now());
  const onExpireRef = useRef(onExpire);
  const balanceRef = useRef(balanceKAS);
  const prevEnabledRef = useRef<boolean>(isEnabled);

  onExpireRef.current = onExpire;
  balanceRef.current = balanceKAS;

  // Reset timer to full duration
  const resetTimer = useCallback(() => {
    lastActivityRef.current = Date.now();
    setRemainingSeconds(duration * 60);
    setIsBlockedByBalance(false);
  }, [duration]);

  // Update duration preset
  const changeDuration = useCallback((minutes: number) => {
    setDuration(minutes);
    lastActivityRef.current = Date.now();
    setRemainingSeconds(minutes * 60);
    setIsBlockedByBalance(false);
  }, []);

  // Avoid time-leak when toggling from paused (disabled) back to enabled
  useEffect(() => {
    if (!prevEnabledRef.current && isEnabled) {
      lastActivityRef.current = Date.now();
    }
    prevEnabledRef.current = isEnabled;
  }, [isEnabled]);

  // Track user activity (throttled to 1s)
  useEffect(() => {
    if (!isEnabled) return;

    let lastThrottle = 0;
    const handleActivity = () => {
      const now = Date.now();
      if (now - lastThrottle < 1000) return;
      lastThrottle = now;
      lastActivityRef.current = now;
      setIsBlockedByBalance(false);
    };

    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
    events.forEach(event => window.addEventListener(event, handleActivity, { passive: true }));

    return () => {
      events.forEach(event => window.removeEventListener(event, handleActivity));
    };
  }, [isEnabled]);

  // Real-time countdown interval (timestamp delta comparison)
  useEffect(() => {
    if (!isEnabled) return;

    const interval = setInterval(() => {
      const elapsedSeconds = Math.floor((Date.now() - lastActivityRef.current) / 1000);
      const targetTotalSeconds = duration * 60;
      const left = Math.max(0, targetTotalSeconds - elapsedSeconds);

      setRemainingSeconds(left);

      if (left === 0) {
        if (balanceRef.current > 0) {
          setIsBlockedByBalance(true);
        } else {
          onExpireRef.current();
          lastActivityRef.current = Date.now();
          setRemainingSeconds(duration * 60);
          setIsBlockedByBalance(false);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [duration, isEnabled]);

  return {
    duration,
    remainingSeconds,
    isBlockedByBalance,
    changeDuration,
    resetTimer,
    onDurationChange: changeDuration,
    onReset: resetTimer,
  };
}
