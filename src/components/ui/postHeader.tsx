import { getTime } from "@/lib/GetTime";
import type { Post } from "@/lib/types";
import {
  Avatar,
  HStack,
  Text,
  Stack,
  Box,
  Button,
  Span,
} from "@chakra-ui/react";
import { Link } from "react-router";
import type { User } from "@supabase/supabase-js";
import { MdVerified } from "react-icons/md";

interface PostHeaderProps {
  profiles: Post["profiles"];
  poster_id: string;
  isOwnPost: boolean;
  handleFollow: () => void;
  isChecking: boolean;
  isFollowing: boolean;
  currentUser: User | null;
  isMakeEffect: boolean;
  created_at: string;
}

/**
 * Renders the post header including the author's avatar, a link to their account with verification icon, relative post time, description, and a conditional Follow button.
 *
 * @param profiles - Profile data for the author (name, image_url, description)
 * @param poster_id - Author's ID used to build the account link (/account/{poster_id})
 * @param isChecking - Whether follow state is currently being checked; hides the Follow button when true
 * @param isFollowing - Whether the current user already follows the author; hides the Follow button when true
 * @param isOwnPost - Whether the post belongs to the current user; hides the Follow button when true
 * @param created_at - Timestamp string for when the post was created (used to display relative time)
 * @param currentUser - The currently signed-in user, or null if unauthenticated
 * @param isMakeEffect - Whether a follow/unfollow effect is in progress; disables the Follow button when true
 * @param handleFollow - Callback invoked when the Follow button is clicked
 * @returns The JSX element representing the post header
 */
export default function PostHeader({
  profiles,
  isChecking,
  isFollowing,
  isOwnPost,
  created_at,
  poster_id,
  currentUser,
  isMakeEffect,
  handleFollow,
}: PostHeaderProps) {
  const canShow = !isChecking && !isFollowing && !isOwnPost && currentUser;
  return (
    <HStack px={4} py={3} gap={4}>
      <Avatar.Root size={"xl"} colorPalette={"blue"}>
        <Avatar.Fallback name="Segun Adebayo" />
        <Avatar.Image src={profiles.image_url} />
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
            <Link
              to={`/account/${poster_id}`}
              style={{
                textDecoration: "none",
                color: "inherit",
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              {profiles?.name}
              <Box as={MdVerified} color="accent.primary" />
            </Link>
            <Span
              fontSize={"sm"}
              mt={0.5}
              mr={1}
              color={"text.secondary"}
              fontWeight={"light"}
            >
              {getTime(created_at)}
            </Span>{" "}
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