import {
  Avatar,
  Box,
  HStack,
  Text,
  Stack,
  Span,
  Grid,
  GridItem,
  Image,
  SkeletonCircle,
  Skeleton,
} from "@chakra-ui/react";
import { MdVerified } from "react-icons/md";
import MiniButton from "@/components/ui/miniButton";
import { PiEmptyBold } from "react-icons/pi";
import { formatNumbers } from "@/lib/FormatNumbers";

import { HiArrowLeft } from "react-icons/hi2";
import { useParams } from "react-router";
import {
  useGetProfileFromId,
  useGetUserOtherProfileData,
} from "@/hooks/useProfile";

/**
 * Renders a user account detail view including avatar, bio, follower/post counts, and a grid of the user's posts.
 *
 * Displays a loading skeleton while profile or additional profile data is loading, shows a "Profile not found" message if the profile is absent, and renders an empty-state message when the user has no posts.
 *
 * @returns The component UI for the account detail view (loading state, not-found state, empty-posts state, or populated profile with post grid).
 */
export function AccountDetails() {
  const { id } = useParams();
  const { profile, isLoading } = useGetProfileFromId(id!);
  const { otherInfo, isLoadingInfo } = useGetUserOtherProfileData(id!);
  if (!isLoading && !profile) {
    return (
      <Box w={"full"} h={"full"} maxW={"570px"} mx={"auto"} pt={2}>
        <Stack align="center" justify="center" py={12}>
          <Text fontWeight="bold">Profile not found</Text>
          <Text color="gray.500" fontSize="sm">
            The requested account does not exist.
          </Text>
        </Stack>
      </Box>
    );
  }

  return isLoading || isLoadingInfo ? (
    <AdminAccountPreLoader />
  ) : (
    <Box
      w={"full"}
      h={"full"}
      maxW={"570px"}
      mx={"auto"}
      pt={2}
      rounded={"md"}
      overflow={"hidden"}
      overflowY={"auto"}
      display={"flex"}
      flexDir={"column"}
      textAlign={"center"}
      className="no-scrollbar"
      pos={"relative"}
    >
      <MiniButton top={2} bg={"bg.surface"} left={0} pos={"absolute"}>
        <HiArrowLeft />
        Back
      </MiniButton>

      <Box maxW={"200px"} aspectRatio={1 / 1} mb={6} mx={"auto"} mt={6} h={40}>
        <Avatar.Root size={"full"} colorPalette={"blue"}>
          <Avatar.Fallback name={profile?.name} />
          <Avatar.Image src={profile?.image_url} />
        </Avatar.Root>
      </Box>
      <Stack gap={3}>
        <HStack>
          <Text
            mx={"auto"}
            fontSize={"xl"}
            display={"flex"}
            gap={1}
            alignItems={"center"}
            fontWeight={"semibold"}
            lineHeight={1}
          >
            {profile?.name}
            <Box as={MdVerified} color="accent.primary" />
          </Text>
        </HStack>
        <Text lineHeight={1.2} px={5} fontWeight={"light"} fontSize={"md"}>
          {profile?.description}
        </Text>
      </Stack>
      <HStack mt={6} gap={3} justifyContent={"center"}>
        <Text
          display={"inline-block"}
          lineHeight={0.5}
          fontWeight={"light"}
          fontSize={"md"}
        >
          <Span fontWeight={"bold"}>
            {formatNumbers(otherInfo?.followersCount || 0)}
          </Span>{" "}
          Followers
        </Text>
        <Text color={"accent.primary"}>|</Text>
        <Text
          display={"inline-block"}
          lineHeight={0.5}
          fontWeight={"light"}
          fontSize={"md"}
        >
          <Span fontWeight={"bold"}>
            {formatNumbers(otherInfo?.totalPosts || 0)}
          </Span>{" "}
          Post
        </Text>
      </HStack>
      {!otherInfo ||
        (otherInfo.posts.length === 0 && (
          <Box
            w={"full"}
            display={"flex"}
            alignItems={"center"}
            justifyContent={"center"}
            flexDir={"column"}
            flex={1}
          >
            <PiEmptyBold size={"48"} className="mb-3!" />
            <Text
              mx={"auto"}
              fontSize={"3xl"}
              display={"flex"}
              gap={0}
              alignItems={"center"}
              fontWeight={"extrabold"}
              lineHeight={1}
              mb={2}
            >
              Nothing Here!
            </Text>
            <Text display={"inline-block"} fontWeight={"light"} fontSize={"md"}>
              {profile?.name} haven't posted yet
            </Text>
          </Box>
        ))}
      <Grid w={"full"} gap={1} mt={6} templateColumns={"repeat(3, 1fr)"}>
        {otherInfo &&
          otherInfo.posts.length > 0 &&
          otherInfo.posts.map((curPost) =>
            curPost.post_image_url ? (
              <GridItem aspectRatio={1 / 1} bg={"bg.surface"} key={curPost.id}>
                <Image
                  src={curPost.post_image_url}
                  width="100%"
                  height="100%"
                  objectFit="cover"
                />
              </GridItem>
            ) : null,
          )}
      </Grid>
    </Box>
  );
}

/**
 * Renders a skeleton placeholder for the admin account details view while profile and related data load.
 *
 * @returns A JSX element containing a circular avatar skeleton, title/description skeletons, follower/post count skeletons, and a 3x3 grid of image skeleton tiles.
 */
export function AdminAccountPreLoader() {
  return (
    <Box
      w={"full"}
      h={"full"}
      maxW={"570px"}
      mx={"auto"}
      pt={2}
      rounded={"md"}
      overflow={"hidden"}
      overflowY={"auto"}
      textAlign={"center"}
      className="no-scrollbar"
      pos={"relative"}
    >
      <Box w={"1/3"} mb={6} mx={"auto"} mt={6} aspectRatio={1 / 1}>
        <SkeletonCircle size="40" />
      </Box>
      <Stack gap={1} w={"full"}>
        <HStack w={"1/2"} h={"12"} mx={"auto"}>
          <Skeleton height="8" w={"full"} rounded={"md"} />
        </HStack>
        <Skeleton height="5" w={"3/4"} mx={"auto"} rounded={"sm"} />
      </Stack>
      <HStack mt={6} px={12} gap={2} justifyContent={"center"}>
        <Skeleton height="5" flexBasis={"1/2"} mx={"auto"} rounded={"sm"} />
        <Text color={"accent.primary"}>|</Text>
        <Skeleton height="5" flexBasis={"1/2"} mx={"auto"} rounded={"sm"} />
      </HStack>
      <Grid w={"full"} gap={1} mt={6} templateColumns={"repeat(3, 1fr)"} px={1}>
        {Array.from({ length: 9 }).map((_, i) => (
          <GridItem aspectRatio={1 / 1} bg={"bg.surface"} key={i}>
            <Skeleton w={"full"} h={"full"} />
          </GridItem>
        ))}
      </Grid>
    </Box>
  );
}
/**
 * Render a compact skeleton placeholder for a user's account header while profile data loads.
 *
 * @returns A JSX element containing a circular avatar skeleton and skeleton lines that mimic the user's name and description.
 */
export function UserAccountPreLoader() {
  return (
    <Box
      w={"full"}
      h={"full"}
      maxW={"570px"}
      mx={"auto"}
      pt={2}
      rounded={"md"}
      overflow={"hidden"}
      overflowY={"auto"}
      textAlign={"center"}
      className="no-scrollbar"
      pos={"relative"}
    >
      <Box w={"1/3"} mb={6} mx={"auto"} mt={6} aspectRatio={1 / 1}>
        <SkeletonCircle size="40" />
      </Box>
      <Stack gap={1} w={"full"}>
        <HStack w={"1/2"} h={"12"} mx={"auto"}>
          <Skeleton height="8" w={"full"} rounded={"md"} />
        </HStack>
        <Skeleton height="5" w={"3/4"} mx={"auto"} rounded={"sm"} />
      </Stack>
    </Box>
  );
}