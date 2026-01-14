import type { Profile } from "@/lib/types";
import { FaBan } from "react-icons/fa";
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
import { MdVerified } from "react-icons/md";

export default function ModeratorCard({ data }: { data: Profile }) {
  return (
    <Box
      w={"full"}
      minH={"fit-content"}
      display={"flex"}
      gap={3}
      justifyContent={"flex-start"}
      px={4}
      pt={3}
      bg={"bg.surface"}
      rounded={"md"}
      pb={4}
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
              variant={"solid"}
              bg={"red.500"}
              color={"white"}
              size={"2xs"}
              rounded={"full"}
            >
              <FaBan />
              Ban
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
export function ModeratorsCardSkeleton() {
  return (
    <Box
      w={"full"}
      minH={"fit-content"}
      display={"flex"}
      gap={3}
      justifyContent={"flex-start"}
      px={4}
      py={4}
    >
      <SkeletonCircle size="16" />
      <Stack w={"full"}>
        <HStack w={"full"}>
          <HStack display={"flex"} w={"full"}>
            <Skeleton height="5" width="50%" rounded={"sm"} />
            <Spacer />
          </HStack>
        </HStack>
        <SkeletonText noOfLines={2} rounded={"sm"} />
      </Stack>
    </Box>
  );
}
