import type { Post } from "@/lib/types";
import { Avatar, HStack, Text, Stack, Box, Button } from "@chakra-ui/react";
import type { User } from "@supabase/supabase-js";
import { MdVerified } from "react-icons/md";

interface PostHeaderProps {
  profiles: Post["profiles"];
  isOwnPost: boolean;
  handleFollow: () => void;
  isChecking: boolean;
  isFollowing: boolean;
  currentUser: User | null;
  isMakeEffect: boolean;
}

export default function PostHeader({
  profiles,
  isChecking,
  isFollowing,
  isOwnPost,
  currentUser,
  isMakeEffect,
  handleFollow,
}: PostHeaderProps) {
  const canShow = !isChecking && !isFollowing && !isOwnPost && currentUser;
  return (
    <HStack px={4} py={3} gap={4}>
      <Avatar.Root size={"xl"} colorPalette={"blue"}>
        <Avatar.Fallback name="Segun Adebayo" />
        <Avatar.Image src="https://bit.ly/sage-adebayo" />
      </Avatar.Root>
      <Stack gap={1}>
        <HStack>
          <Text
            fontSize={"md"}
            display={"flex"}
            gap={1}
            alignItems={"start"}
            fontWeight={"semibold"}
            lineHeight={1}
          >
            {profiles?.name} <Box as={MdVerified} color="accent.primary" />
            {canShow && (
              <Button
                ml={2}
                variant={"ghost"}
                color={"accent.primary"}
                onClick={handleFollow}
                disabled={isMakeEffect}
                p={0}
                unstyled
                fontWeight={"semibold"}
                fontSize={"sm"}
              >
                Follow
              </Button>
            )}
          </Text>
        </HStack>
        <Text lineHeight={1} fontWeight={"light"} fontSize={"xs"}>
          {profiles?.description}
        </Text>
      </Stack>
    </HStack>
  );
}
