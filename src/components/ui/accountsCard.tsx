import {
  Box,
  Avatar,
  Stack,
  HStack,
  Text,
  Button,
  Spacer,
} from "@chakra-ui/react";
import { HiPlus } from "react-icons/hi2";
import { MdVerified } from "react-icons/md";

export default function AccountsCard() {
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
        <Avatar.Fallback name="Segun Adebayo" />
        <Avatar.Image src="https://bit.ly/sage-adebayo" />
      </Avatar.Root>
      <Stack>
        <HStack>
          <HStack display={"flex"} w={"full"}>
            <Text
              fontSize={"md"}
              display={"flex"}
              gap={1}
              alignItems={"start"}
              fontWeight={"semibold"}
              lineHeight={1}
            >
              BUK SUG
              <Box as={MdVerified} color="accent.primary" />
            </Text>
            <Spacer />
            <Button
              variant={"outline"}
              borderColor={"accent.primary"}
              borderWidth={"1px"}
              color={"accent.primary"}
              size={"2xs"}
              rounded={"full"}
            >
              <HiPlus />
              Follow
            </Button>
          </HStack>
        </HStack>
        <Text lineHeight={1} fontWeight={"extralight"} fontSize={"xs"}>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore
          praesentium cum blanditiis quam! Consequatur repudiandae.
        </Text>
      </Stack>
    </Box>
  );
}
