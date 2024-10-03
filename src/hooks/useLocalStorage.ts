"use client";
import { useCallback, useEffect, useReducer, useState } from "react";
import { invariant } from "utils/invariant";
import { z } from "zod";

interface UseLocalStorage<T extends z.ZodTypeAny> {
  key: string;
  schema: T;
}

export const useLocalStorage = <T extends z.ZodTypeAny>({
  key,
  schema,
}: UseLocalStorage<T>) => {
  const [state, setState] = useState<z.output<T>>();

  useEffect(() => {
    const value = localStorage.getItem(key);
    if (!value) return;
    try {
      const parsed = schema.parse(JSON.parse(value));
      setState(parsed);
    } catch (error) {
      localStorage.removeItem(key);
    }
  }, []);

  const setValue = useCallback((newValue: z.output<T>) => {
    localStorage.setItem(key, JSON.stringify(newValue));
    setState(newValue);
  }, []);

  return [state, setValue] as const;
};
