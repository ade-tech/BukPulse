import type { FetchNewsResponse } from "@/lib/types";
import {
  addComment,
  CreateNews as CreateNewsAPI,
  fetchCommentForPost,
  fetchLatestTenNews,
  fetchNewPosts,
  fetchNewsDetail,
  fetchPosts,
} from "@/Services/NewsAPI";
import { likePost, unlikePost, checkIfUserLikedPost } from "@/Services/NewsAPI";
import { useCurrentUser } from "@/contexts/AuthContext";
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

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/Services/supabase";
import { playSound, sounds } from "@/lib/Sounds";

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

export const useFetchNewsById = (id: string) => {
  const { data: post, isLoading: isFetching } = useQuery({
    queryKey: ["News", id],
    queryFn: ({ queryKey }) => fetchNewsDetail(queryKey[1]),
    enabled: !!id,
  });

  return { post, isFetching };
};

export const useAddComment = () => {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: addComment,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["Comments for", variables.post_id],
      });
    },
  });
  return { mutate, isPending };
};
export const useFetchCommentsForPosts = (id: string) => {
  const { data: comments, isLoading: isFetchingComments } = useQuery({
    queryKey: ["Comments for", id],
    queryFn: ({ queryKey }) => fetchCommentForPost(queryKey[1]),
    enabled: !!id,
  });

  return { comments, isFetchingComments };
};

export const useLike = () => {
  const queryClient = useQueryClient();

  const { mutate: like, isPending: isLiking } = useMutation({
    mutationFn: likePost,
    onMutate: async (variables) => {
      await queryClient.cancelQueries({
        queryKey: ["isLiked", variables.postId, variables.userId],
      });

      const previousIsLiked = queryClient.getQueryData([
        "isLiked",
        variables.postId,
        variables.userId,
      ]);

      queryClient.setQueryData(
        ["isLiked", variables.postId, variables.userId],
        true,
      );

      return { previousIsLiked };
    },
    onSuccess: () => {
      playSound(sounds.like);
    },
    onError: (error, variables, context) => {
      console.error("Error liking post:", error);
      playSound(sounds.error);

      if (context?.previousIsLiked !== undefined) {
        queryClient.setQueryData(
          ["isLiked", variables.postId, variables.userId],
          context.previousIsLiked,
        );
      }
    },
    onSettled: (_data, _, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["isLiked", variables.postId, variables.userId],
      });
    },
  });

  return { like, isLiking };
};

export const useUnlike = () => {
  const queryClient = useQueryClient();

  const { mutate: unlike, isPending: isUnliking } = useMutation({
    mutationFn: unlikePost,
    onMutate: async (variables) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({
        queryKey: ["isLiked", variables.postId, variables.userId],
      });

      // Snapshot previous value
      const previousIsLiked = queryClient.getQueryData([
        "isLiked",
        variables.postId,
        variables.userId,
      ]);

      // Optimistically update like status
      queryClient.setQueryData(
        ["isLiked", variables.postId, variables.userId],
        false,
      );

      // Return context for rollback
      return { previousIsLiked };
    },
    onSuccess: () => {
      playSound(sounds.success);
    },
    onError: (error, variables, context) => {
      console.error("Error unliking post:", error);
      playSound(sounds.error);

      // Rollback to previous value
      if (context?.previousIsLiked !== undefined) {
        queryClient.setQueryData(
          ["isLiked", variables.postId, variables.userId],
          context.previousIsLiked,
        );
      }
    },
    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["isLiked", variables.postId, variables.userId],
      });
    },
  });

  return { unlike, isUnliking };
};

export const useIsLiked = (postId: string) => {
  const { currentUser } = useCurrentUser();

  const { data: isLiked, isLoading } = useQuery({
    queryKey: ["isLiked", postId, currentUser?.id],
    queryFn: () =>
      checkIfUserLikedPost({
        postId,
        userId: currentUser?.id!,
      }),
    enabled: !!currentUser?.id && !!postId,
  });

  return { isLiked: isLiked ?? false, isLoading };
};

export const usePostLike = (postId: string) => {
  const { currentUser } = useCurrentUser();
  const { like, isLiking } = useLike();
  const { unlike, isUnliking } = useUnlike();
  const { isLiked, isLoading: isCheckingLike } = useIsLiked(postId);

  const toggleLike = () => {
    if (!currentUser?.id) return;

    if (isLiked) {
      unlike({ postId, userId: currentUser.id });
    } else {
      like({ postId, userId: currentUser.id });
    }
  };

  return {
    isLiked,
    toggleLike,
    isLoading: isLiking || isUnliking || isCheckingLike,
  };
};

export const useOptimisticLike = (postId: string, initialLikes: number) => {
  const { isLiked, toggleLike, isLoading } = usePostLike(postId);
  const [optimisticLikes, setOptimisticLikes] = useState(initialLikes);
  const isTogglingRef = useRef(false);

  useEffect(() => {
    if (!isTogglingRef.current) {
      setOptimisticLikes(initialLikes);
    }
  }, [initialLikes]);

  const handleToggle = () => {
    isTogglingRef.current = true;
    setOptimisticLikes((prev) => (isLiked ? Math.max(prev - 1, 0) : prev + 1));
    toggleLike();

    setTimeout(() => {
      isTogglingRef.current = false;
    }, 500);
  };

  return {
    likes: optimisticLikes,
    isLiked,
    toggleLike: handleToggle,
    isLoading,
  };
};
