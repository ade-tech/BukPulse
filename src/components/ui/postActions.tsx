import { Box, HStack, Text, IconButton } from "@chakra-ui/react";
import { useState } from "react";
import { BiSolidLike, BiLike } from "react-icons/bi";
import { FaRegComment } from "react-icons/fa6";
import { RiShare2Line } from "react-icons/ri";

export default function PostActions() {
  const [isLiked, setIsLiked] = useState<boolean>(false);
  return (
    <HStack px={4} pb={3}>
      <HStack gap={3}>
        <HStack gap={0}>
          <IconButton
            variant="ghost"
            size="sm"
            onClick={() => setIsLiked(!isLiked)}
            aria-label="Like post"
          >
            <Box
              as={isLiked ? BiSolidLike : BiLike}
              boxSize={6}
            />
          </IconButton>
          <Text fontWeight={"semibold"} fontSize={"sm"}>
            122
          </Text>
        </HStack>
        <HStack gap={0}>
          <IconButton
            variant="ghost"
            size="sm"
            onClick={() => setIsLiked(!isLiked)}
            aria-label="Like post"
          >
            <Box as={FaRegComment} boxSize={6} />
          </IconButton>
          <Text fontWeight={"semibold"} fontSize={"sm"}>
            3
          </Text>
        </HStack>
        <IconButton
          variant="ghost"
          size="sm"
          onClick={() => setIsLiked(!isLiked)}
          aria-label="Like post"
        >
          <Box as={RiShare2Line} boxSize={6} />
        </IconButton>
      </HStack>
    </HStack>
  );
}
