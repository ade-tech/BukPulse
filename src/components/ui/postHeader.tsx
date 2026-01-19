import type { Post } from "@/lib/types";
import { Avatar, HStack, Text, Stack, Box } from "@chakra-ui/react";
import { MdVerified } from "react-icons/md";

export default function PostHeader({ profiles }: Pick<Post, "profiles">) {
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
          </Text>
        </HStack>
        <Text lineHeight={1} fontWeight={"light"} fontSize={"xs"}>
          {profiles?.description}
        </Text>
      </Stack>
    </HStack>
  );
}
