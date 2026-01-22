import { getTime } from "@/lib/GetTime";
import type { Comment } from "@/lib/types";
import {
  Box,
  Avatar,
  Stack,
  HStack,
  Text,
  Spacer,
  SkeletonCircle,
  Skeleton,
  SkeletonText,
  Span,
} from "@chakra-ui/react";
import { MdVerified } from "react-icons/md";

export default function CommentCard({
  profiles,
  created_at,
  comment,
}: Comment) {
  return (
    <Box
      w={"3/4"}
      minH={"fit-content"}
      gap={3}
      justifyContent={"flex-start"}
      p={4}
      ml={6}
      mb={4}
      bg={"bg.surface"}
      rounded={"2xl"}
    >
      <HStack w={"full"} mb={2}>
        <Avatar.Root size={"xl"} colorPalette={"blue"}>
          <Avatar.Fallback name={profiles?.name} />
          <Avatar.Image src={profiles?.image_url!} />
        </Avatar.Root>

        <Stack w={"full"}>
          <HStack w={"full"}>
            <HStack display={"flex"} w={"full"}>
              <Text
                fontSize={"md"}
                display={"flex"}
                gap={1}
                alignItems={"center"}
                fontWeight={"semibold"}
                lineHeight={1}
              >
                {profiles?.name}
                {profiles?.role === "admin" ||
                  (profiles?.role === "super_admin" && (
                    <Box as={MdVerified} color="accent.primary" />
                  ))}
              </Text>
              <Spacer />
              <Span color={"text.secondary"} fontSize={"xs"}>
                {getTime(created_at)}
              </Span>
            </HStack>
          </HStack>
          <Text lineHeight={1} fontWeight={"extralight"} fontSize={"sm"}>
            {profiles?.reg_number}
          </Text>
        </Stack>
      </HStack>
      <Text lineHeight={1} fontWeight={"normal"} fontSize={"md"}>
        {comment}
      </Text>
    </Box>
  );
}
export function CommentCardSkeleton() {
  return (
    <Box
      w={"3/4"}
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
            <Skeleton height="5" width="50%" rounded={"md"} />
            <Spacer />
          </HStack>
        </HStack>
        <SkeletonText noOfLines={2} rounded={"md"} />
      </Stack>
    </Box>
  );
}
