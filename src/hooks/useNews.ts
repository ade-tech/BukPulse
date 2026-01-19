import {
  CreateNews as CreateNewsAPI,
  fetchLatestTenNews,
} from "@/Services/NewsAPI";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useFetchLatestNews = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["Latest News"],
    queryFn: fetchLatestTenNews,
  });

  return { data, isLoading };
};

export function useCreateNews() {
  const { mutate: createNews, isPending: isCreatingNews } = useMutation({
    mutationFn: CreateNewsAPI,
  });

  return { createNews, isCreatingNews };
}
