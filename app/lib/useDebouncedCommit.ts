"use client";
import { useEffect, useRef, useCallback } from "react";

/**
 * Generic debounce + flush hook for committing expensive store updates.
 * - call setDraft(value) as user edits
 * - provide commit(draft) to actually persist
 * - automatically flushes on unmount or key changes
 */
export function useDebouncedCommit<T>(
  value: T,
  commit: (val: T) => void,
  delay = 400,
  deps: any[] = [],
  equals: (a: T, b: T) => boolean = (a, b) => a === b
) {
  const latest = useRef<T>(value);
  const lastCommitted = useRef<T>(value);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Skip if value unchanged by equality fn
    if (equals(latest.current, value)) return;
    latest.current = value;
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    timerRef.current = setTimeout(() => {
      if (!equals(lastCommitted.current, latest.current)) {
        commit(latest.current);
        lastCommitted.current = latest.current;
      }
      timerRef.current = null;
    }, delay);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, delay, commit, equals, ...deps]);

  const flush = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (!equals(lastCommitted.current, latest.current)) {
      commit(latest.current);
      lastCommitted.current = latest.current;
    }
  }, [commit, equals]);

  useEffect(() => flush, [flush]);

  return { flush };
}