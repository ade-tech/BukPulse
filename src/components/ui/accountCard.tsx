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

export default function AccountsCard({
  data,
  id,
}: {
  data: Profile;
  id: string;
}) {
  const { followModerator } = useFollowModerator();
  const { data: followStatus } = useCheckFollowStatus({
    followed_id: data.id,
    follower_id: id,
  });

  return (
    <Box
      w={"full"}
      minH={"fit-content"}
      display={"flex"}
      gap={3}
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
              {data.name}
              <Box as={MdVerified} color="accent.primary" />
            </Text>
            <Spacer />
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
          </HStack>
        </HStack>
        <Text lineHeight={1} fontWeight={"extralight"} fontSize={"xs"}>
          {data.description}
        </Text>
      </Stack>
    </Box>
  );
}
export function AccountsCardSkeleton() {
  return (
    <Box
      w={"full"}
      minH={"fit-content"}
      display={"flex"}
      gap={3}
      justifyContent={"flex-start"}
      px={4}
      py={4}
      borderBottomWidth={"1px"}
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
