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

export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
