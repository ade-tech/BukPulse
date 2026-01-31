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
import { Link } from "react-router";
import MiniButton from "./miniButton";
import { HiArrowLeft } from "react-icons/hi2";
import { useState } from "react";

/**
 * Render a post card showing the post header, caption (with optional truncation), optional image, and action controls.
 *
 * The caption is truncated to 200 characters by default and can be toggled between truncated and full text when not in detail mode.
 *
 * @param data - Post data to display (header info, caption, image URL, likes, comments, etc.)
 * @param isShowingDetail - When true, render the detail view variant (shows a back button and disables caption truncation toggling)
 * @param isFull - When true, use the full-page background style for the card
 * @returns The post card React element
 */
export default function PostCard({
  data,
  isShowingDetail = false,
  isFull = false,
}: {
  data: Post;
  isFull?: boolean;
  isShowingDetail?: boolean;
}) {
  const { currentUser } = useCurrentUser();
  const [showFull, setShowFull] = useState<boolean>(false);
  const isLongText = data.post_caption.length > 200;
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
      bg={isFull ? "bg.page" : "bg.surface"}
      rounded={"md"}
      maxW="470px"
      mb={4}
      pos={"relative"}
    >
      <HStack gap={0}>
        {isShowingDetail && (
          <HStack w={"fit"} ml={3}>
            <MiniButton ml={0} bg={"bg.surface"}>
              <HiArrowLeft />
            </MiniButton>
          </HStack>
        )}
        <Box flex={1}>
          <PostHeader
            poster_id={data.poster_id}
            created_at={data.created_at}
            isMakeEffect={isFollowingModertor}
            profiles={data.profiles}
            isFollowing={!!isFollowing}
            isChecking={checkingFollow}
            isOwnPost={isOwnPost}
            handleFollow={handleFollow}
            currentUser={currentUser}
          />
        </Box>
      </HStack>
      <Link className="w-full" to={`/news/${data.id}`}>
        <Box px={4} pb={1}>
          <Text lineHeight={1.2} fontWeight={"light"} fontSize={"md"} mb={2}>
            {!isLongText || showFull || isShowingDetail
              ? data.post_caption
              : `${data.post_caption.slice(0, 200)}...`}
            {isLongText && !isShowingDetail && (
              <Box
                as="span"
                fontWeight="bold"
                color="accent.primary"
                cursor="pointer"
                ml={2}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowFull(!showFull);
                }}
              >
                {showFull ? "See less" : "See more"}
              </Box>
            )}
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
      </Link>
      <PostActions
        post_id={data.id}
        likes={+data.post_likes}
        comments={+data.post_comments}
        commentDestination={`/news/${data.id}`}
      />
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