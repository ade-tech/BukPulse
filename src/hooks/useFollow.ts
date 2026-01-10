import type { FollowEventParams } from "@/lib/types";
import {
  checkFollowStatus,
  FollowModerator,
  hasFollowedSomone,
} from "@/Services/FollowAPI";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useFollowModerator() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: FollowModerator,
    onMutate: async (variables) => {
      const { followed_id, follower_id } = variables;
      const queryKey = ["Follow Event", followed_id, follower_id];
      await queryClient.cancelQueries({
        queryKey,
      });

      const previousData = queryClient.getQueryData<boolean>(queryKey);

      await queryClient.setQueryData(queryKey, (old) => !old);

      return { previousData };
    },
    onError: (_err, variables, context) => {
      const { followed_id, follower_id } = variables;

      queryClient.setQueryData(
        ["Follow Event", followed_id, follower_id],
        context?.previousData
      );
    },

    onSettled: (_data, _error, variables) => {
      const { followed_id, follower_id } = variables;

      queryClient.invalidateQueries({
        queryKey: ["Follow Event", followed_id, follower_id],
      });
      queryClient.invalidateQueries({
        queryKey: ["Has Followed", follower_id],
      });
    },
  });
  return {
    followModerator: mutation.mutate,
    isFollowingModertor: mutation.isPending,
  };
}

export function useCheckFollowStatus({
  followed_id,
  follower_id,
}: FollowEventParams) {
  const { data, isLoading } = useQuery({
    queryKey: ["Follow Event", followed_id, follower_id],
    queryFn: ({ queryKey }) =>
      checkFollowStatus({ followed_id: queryKey[1], follower_id: queryKey[2] }),
  });

  return { data, isLoading };
}

export function useHasFollowedSomeone(follower_id: string) {
  const { data, isLoading } = useQuery({
    queryKey: ["Has Followed", follower_id],
    queryFn: ({ queryKey }) => hasFollowedSomone(queryKey[1]),
  });
  return { data, isLoading };
}
