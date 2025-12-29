import { Avatar, HStack, Text, Stack, Box } from "@chakra-ui/react";
import { MdVerified } from "react-icons/md";

export default function PostHeader() {
  return (
    <HStack px={4} py={3} gap={4}>
      <Avatar.Root size={"xl"} colorPalette={"blue"}>
        <Avatar.Fallback name="Segun Adebayo" />
        <Avatar.Image src="https://bit.ly/sage-adebayo" />
      </Avatar.Root>
      <Stack>
        <HStack>
          <Text
            fontSize={"md"}
            display={"flex"}
            gap={1}
            alignItems={"start"}
            fontWeight={"semibold"}
            lineHeight={1}
          >
            Adelopo Abdullah <Box as={MdVerified} color="accent.primary" />
          </Text>
        </HStack>
        <Text lineHeight={0.5} fontWeight={"light"} fontSize={"xs"}>
          Student Union Government
        </Text>
      </Stack>
    </HStack>
  );
}
