import { useQuery } from "@tanstack/react-query";
import { searchContent } from "@/Services/SearchAPI";
import { useEffect, useState } from "react";
import { useCurrentUser } from "@/contexts/AuthContext";

export const useSearch = (query: string) => {
  const { currentUser } = useCurrentUser();
  const userRole = currentUser?.user_metadata?.role || "user";

  return useQuery({
    queryKey: ["search", query, userRole],
    queryFn: () => searchContent(query, userRole),
    enabled: query.length >= 2,
    staleTime: 30000,
  });
};

/**
 * Debounces a value and returns the latest value after the specified delay.
 *
 * @param value - The input value to debounce
 * @param delay - Delay in milliseconds to wait after the last change before updating the returned value (defaults to 300)
 * @returns The debounced value, updated to match `value` only after it remains unchanged for `delay` milliseconds
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}