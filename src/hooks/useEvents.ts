import type { FollowEventParams } from "@/lib/types";
import { FollowModerator } from "@/Services/EventsAPI";
import { useMutation } from "@tanstack/react-query";

export function useFollowModerator() {
  const { mutate: followModerator, isPending: isFollowingModertor } =
    useMutation({
      mutationFn: ({ followed_id, follower_id }: FollowEventParams) =>
        FollowModerator({ followed_id, follower_id }),
    });

  return { followModerator, isFollowingModertor };
}
