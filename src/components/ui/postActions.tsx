import { useOptimisticLike } from "@/hooks/useNews";
import { formatNumbers } from "@/lib/FormatNumbers";
import { Box, HStack, Text, IconButton } from "@chakra-ui/react";
import { BiSolidLike, BiLike } from "react-icons/bi";
import { FaRegComment } from "react-icons/fa6";
import { Link } from "react-router";

export default function PostActions({
  commentDestination,
  comments,
  post_id,
  likes,
}: {
  commentDestination: string;
  comments: number;
  likes: number;
  post_id: string;
}) {
  const {
    likes: likedata,
    isLiked,
    toggleLike,
    isLoading,
  } = useOptimisticLike(post_id, likes);
  return (
    <HStack px={4} pb={3}>
      <HStack gap={3}>
        <HStack gap={0}>
          <IconButton
            variant="ghost"
            size="sm"
            onClick={toggleLike}
            disabled={isLoading}
            aria-label={isLiked ? "Unlike post" : "Like post"}
          >
            <Box as={isLiked ? BiSolidLike : BiLike} boxSize={6} />
          </IconButton>
          <Text fontWeight="semibold" fontSize="sm">
            {formatNumbers(likedata)}
          </Text>
        </HStack>
        <Link className="flex items-center" to={commentDestination}>
          <IconButton variant="ghost" size="sm" aria-label="Like post">
            <Box as={FaRegComment} boxSize={6} />
          </IconButton>
          <Text fontWeight={"semibold"} fontSize={"sm"}>
            {formatNumbers(comments)}
          </Text>
        </Link>
      </HStack>
    </HStack>
  );
}
export function PostActionsDefault() {
  return (
    <HStack px={4}>
      <IconButton variant="ghost" size="sm" aria-label="Like post">
        <Box as={BiLike} boxSize={6} />
      </IconButton>
      <IconButton variant="ghost" size="sm" aria-label="Like post">
        <Box as={FaRegComment} boxSize={6} />
      </IconButton>
    </HStack>
  );
}
