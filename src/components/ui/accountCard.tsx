import { useCheckFollowStatus, useFollowModerator } from "@/hooks/useFollow";
import type { Profile } from "@/lib/types";
import {
  Box,
  Avatar,
  Stack,
  HStack,
  Text,
  Button,
  Spacer,
  SkeletonCircle,
  Skeleton,
  SkeletonText,
} from "@chakra-ui/react";
import { HiPlus } from "react-icons/hi2";
import { MdVerified } from "react-icons/md";
import { Link } from "react-router";

/**
 * Renders a user account card showing avatar, display name, description, and an optional follow button.
 *
 * @param data - The profile to display (includes name, image_url, id, and description).
 * @param id - The current user id used as the follower when toggling follow state.
 * @param displayOnly - If `true`, hides the follow button and renders the card in read-only mode.
 * @param searchResult - If `true`, uses a compact layout suitable for search results.
 * @returns The account card as a JSX element.
 */
export default function AccountsCard({
  data,
  id,
  displayOnly = false,
  searchResult = false,
}: {
  data: Profile;
  id: string;
  displayOnly?: boolean;
  searchResult?: boolean;
}) {
  const { followModerator } = useFollowModerator();
  const { data: followStatus } = useCheckFollowStatus({
    followed_id: data.id,
    follower_id: id,
  });

  return (
    <Box
      w={searchResult ? "3/4" : "full"}
      minH={"fit-content"}
      display={"flex"}
      gap={3}
      flexShrink={0}
      justifyContent={"flex-start"}
      px={4}
      py={4}
      borderBottomWidth={"1px"}
    >
      <Avatar.Root size={"xl"} colorPalette={"blue"}>
        <Avatar.Fallback name={data.name} />
        <Avatar.Image src={data.image_url} />
      </Avatar.Root>
      <Stack w={"full"}>
        <HStack w={"full"}>
          <HStack display={"flex"} w={"full"}>
            <Text
              fontSize={"md"}
              display={"flex"}
              gap={1}
              alignItems={"start"}
              fontWeight={"semibold"}
              lineHeight={1}
            >
              <Link
                to={`/account/${data.id}`}
                style={{
                  textDecoration: "none",
                  color: "inherit",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                {data.name}
                <Box as={MdVerified} color="accent.primary" />
              </Link>
            </Text>
            <Spacer />
            {!displayOnly && (
              <Button
                variant={followStatus ? "solid" : "outline"}
                bg={followStatus ? "accent.primary" : "none"}
                borderColor={"accent.primary"}
                borderWidth={followStatus ? "none" : "1px"}
                color={followStatus ? "text.primary" : "accent.primary"}
                size={"2xs"}
                rounded={"full"}
                onClick={() => {
                  followModerator({ followed_id: data.id, follower_id: id });
                }}
              >
                <HiPlus />
                {followStatus ? "Following" : "Follow"}
              </Button>
            )}
          </HStack>
        </HStack>
        <Text lineHeight={1} fontWeight={"extralight"} fontSize={"xs"}>
          {data.description}
        </Text>
      </Stack>
    </Box>
  );
}
/**
 * Renders a loading skeleton placeholder for an account card.
 *
 * @param isLast - When `true`, the bottom border is removed to indicate the last item.
 * @returns The JSX element representing the account card skeleton placeholder.
 */
export function AccountsCardSkeleton({ isLast = false }: { isLast?: boolean }) {
  return (
    <Box
      w={"full"}
      minH={"fit-content"}
      display={"flex"}
      flexShrink={0}
      gap={3}
      justifyContent={"flex-start"}
      px={4}
      py={4}
      borderBottomWidth={isLast ? "0px" : "1px"}
    >
      <SkeletonCircle size="16" />
      <Stack w={"full"}>
        <HStack w={"full"}>
          <HStack display={"flex"} w={"full"}>
            <Skeleton height="5" width="50%" rounded={"md"} />
            <Spacer />
          </HStack>
        </HStack>
        <SkeletonText noOfLines={2} rounded={"md"} />
      </Stack>
    </Box>
  );
}