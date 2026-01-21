import {
  Box,
  HStack,
  Image,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
  Stack,
  Text,
} from "@chakra-ui/react";
import PostHeader from "./postHeader";
import PostActions, { PostActionsDefault } from "./postActions";
import type { Post } from "@/lib/types";
import { useCurrentUser } from "@/contexts/AuthContext";
import { useCheckFollowStatus, useFollowModerator } from "@/hooks/useFollow";

export default function PostCard({ data }: { data: Post }) {
  const { currentUser } = useCurrentUser();
  const isOwnPost = currentUser?.id === data.poster_id;

  const { data: isFollowing, isLoading: checkingFollow } = useCheckFollowStatus(
    {
      followed_id: data.poster_id,
      follower_id: currentUser?.id || "",
    },
  );

  const { followModerator, isFollowingModertor } = useFollowModerator();

  const handleFollow = () => {
    if (!currentUser?.id) return;

    followModerator({
      follower_id: currentUser.id,
      followed_id: data.poster_id,
    });
  };

  return (
    <Stack
      w={"full"}
      bg={"bg.surface"}
      rounded={"md"}
      maxW="470px"
      mb={4}
      pos={"relative"}
    >
      <PostHeader
        isMakeEffect={isFollowingModertor}
        profiles={data.profiles}
        isFollowing={!!isFollowing}
        isChecking={checkingFollow}
        isOwnPost={isOwnPost}
        handleFollow={handleFollow}
        currentUser={currentUser}
      />
      <Box px={4} pb={1}>
        <Text lineHeight={1.2} fontWeight={"light"} fontSize={"md"}>
          {data.post_caption}
        </Text>
      </Box>
      {data.post_image_url && (
        <Box aspectRatio={1 / 1} w={"full"} overflow={"hidden"}>
          <Image
            src={data.post_image_url}
            width="100%"
            height="100%"
            objectFit="cover"
          />
        </Box>
      )}
      <PostActions />
    </Stack>
  );
}

export function PostCardSkeleton() {
  return (
    <Stack
      w={"full"}
      bg={"bg.surface"}
      rounded={"md"}
      maxW="470px"
      py={4}
      mb={4}
    >
      <HStack gap="4" mb={2} px={4}>
        <SkeletonCircle size="12" />
        <Stack flex="1">
          <Skeleton height="4" />
          <Skeleton height="4" width="80%" />
        </Stack>
      </HStack>
      <Box pb={1} px={4}>
        <SkeletonText noOfLines={2} rounded={"sm"} />
      </Box>
      <Box aspectRatio={1 / 1} w={"full"} overflow={"hidden"}>
        <Skeleton height="full" width="100%" />
      </Box>
      <PostActionsDefault />
    </Stack>
  );
}
