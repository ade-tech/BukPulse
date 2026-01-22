import type { FetchNewsResponse } from "@/lib/types";
import {
  CreateNews as CreateNewsAPI,
  fetchLatestTenNews,
  fetchNewPosts,
  fetchPosts,
} from "@/Services/NewsAPI";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";

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

export const useFetchNewsForFeed = (
  feedType: "for-you" | "news" = "for-you",
  userId?: string | null,
) => {
  const queryClient = useQueryClient();
  const followedOnly = feedType === "news";

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["feed", feedType, userId],
    queryFn: async ({ pageParam }) =>
      fetchPosts({
        lastPostDate: pageParam,
        userId,
        followedOnly,
      }),
    getNextPageParam: (lastPage) => {
      if (!lastPage.hasMore) return undefined;
      const lastPost = lastPage.posts[lastPage.posts.length - 1];
      return lastPost.created_at || undefined;
    },
    initialPageParam: null as string | null,
    refetchOnWindowFocus: false,
  });

  const addNewPostsToFeed = async (sinceDate: string) => {
    const newItems = await fetchNewPosts(sinceDate, userId, followedOnly);

    if (newItems.length === 0) return;

    queryClient.setQueryData<InfiniteData<FetchNewsResponse>>(
      ["feed", feedType, userId],
      (oldData) => {
        if (!oldData) return oldData;
        const firstPage = oldData.pages[0];
        const updatedFirstPage = {
          ...firstPage,
          posts: [...newItems, ...firstPage.posts],
        };
        return {
          ...oldData,
          pages: [updatedFirstPage, ...oldData.pages.slice(1)],
        };
      },
    );
  };

  const posts = data?.pages.flatMap((page) => page.posts) ?? [];
  const latestPostDate = posts[0]?.created_at || null;

  return {
    posts,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
    refetch,
    latestPostDate,
    addNewPostsToFeed,
  };
};

import { useEffect, useState } from "react";
import { supabase } from "@/Services/supabase";

interface UseNewPostsProps {
  latestPostDate: string | null;
  enabled?: boolean;
}

export const useNewPosts = ({
  latestPostDate,
  enabled = true,
}: UseNewPostsProps) => {
  const [newPostsCount, setNewPostsCount] = useState(0);

  useEffect(() => {
    if (!enabled || !latestPostDate) return;

    const channel = supabase
      .channel("new-posts-notification")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "posts",
        },
        (payload) => {
          if (payload.new.created_at > latestPostDate) {
            setNewPostsCount((prev) => prev + 1);
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [latestPostDate, enabled]);

  const resetCount = () => setNewPostsCount(0);

  return {
    newPostsCount,
    resetCount,
  };
};
