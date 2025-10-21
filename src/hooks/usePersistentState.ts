import { useEffect, useRef, useState } from "react";

type SetStateAction<T> = T | ((prevState: T) => T);

type PersistentStateReturn<T> = [T, (value: SetStateAction<T>) => void];

export function usePersistentState<T>(
  storageKey: string,
  initialValue: T,
): PersistentStateReturn<T> {
  const hasHydratedRef = useRef(false);
  const [value, setValue] = useState<T>(initialValue);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    hasHydratedRef.current = false;

    try {
      const storedValue = window.localStorage.getItem(storageKey);
      let nextValue: T = initialValue;

      if (storedValue !== null) {
        try {
          nextValue = JSON.parse(storedValue) as T;
        } catch {
          nextValue = initialValue;
        }
      }

      setValue((prev) => (Object.is(prev, nextValue) ? prev : nextValue));
    } catch {
      setValue(initialValue);
    } finally {
      hasHydratedRef.current = true;
    }
  }, [initialValue, storageKey]);

  useEffect(() => {
    if (typeof window === "undefined" || !hasHydratedRef.current) {
      return;
    }

    try {
      if (value === undefined) {
        window.localStorage.removeItem(storageKey);
        return;
      }

      window.localStorage.setItem(storageKey, JSON.stringify(value));
    } catch {
      // Ignore storage write errors (e.g., quota exceeded or private mode)
    }
  }, [storageKey, value]);

  return [value, setValue];
}
