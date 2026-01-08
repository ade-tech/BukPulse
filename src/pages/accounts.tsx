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
  Button,
} from "@chakra-ui/react";
import { MdVerified } from "react-icons/md";
import { HiOutlineLogout } from "react-icons/hi";
import { useLogout } from "@/hooks/useAuth";
import MiniButton from "@/components/ui/miniButton";

export default function Accounts() {
  const { logoutUser, isLoggingOut } = useLogout();
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
      <MiniButton
        onClick={() => logoutUser()}
        variant={"outline"}
        top={2}
        left={0}
        pos={"absolute"}
        disabled={isLoggingOut}
        rounded={"full"}
      >
        <HiOutlineLogout />
        Logout
      </MiniButton>
      <Box
        w={"2/5"}
        maxW={"200px"}
        aspectRatio={1 / 1}
        mb={6}
        mx={"auto"}
        mt={6}
      >
        <Avatar.Root size={"full"} colorPalette={"blue"}>
          <Avatar.Fallback name="Segun Adebayo" />
          <Avatar.Image src="https://bit.ly/sage-adebayo" />
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
            The Student Union Government
            <Box as={MdVerified} color="accent.primary" />
          </Text>
        </HStack>
        <Text lineHeight={0.5} fontWeight={"light"} fontSize={"md"}>
          Official Account of the SUG President
        </Text>
      </Stack>
      <HStack mt={6} gap={3} justifyContent={"center"}>
        <Text
          display={"inline-block"}
          lineHeight={0.5}
          fontWeight={"light"}
          fontSize={"md"}
        >
          <Span fontWeight={"bold"}> 23.5K</Span> Followers
        </Text>
        <Text color={"accent.primary"}>|</Text>
        <Text
          display={"inline-block"}
          lineHeight={0.5}
          fontWeight={"light"}
          fontSize={"md"}
        >
          <Span fontWeight={"bold"}> 5</Span> Post
        </Text>
      </HStack>
      <Grid w={"full"} gap={1} mt={6} templateColumns={"repeat(3, 1fr)"}>
        <GridItem aspectRatio={1 / 1} bg={"bg.surface"}>
          <Image
            src={"/Artboard 1.jpg"}
            width="100%"
            height="100%"
            objectFit="cover"
          />
        </GridItem>
        <GridItem aspectRatio={1 / 1} bg={"bg.surface"}>
          <Image
            src={"/Artboard 1.jpg"}
            width="100%"
            height="100%"
            objectFit="cover"
          />
        </GridItem>
        <GridItem aspectRatio={1 / 1} bg={"bg.surface"}>
          <Image
            src={"/Artboard 1.jpg"}
            width="100%"
            height="100%"
            objectFit="cover"
          />
        </GridItem>
        <GridItem aspectRatio={1 / 1} bg={"bg.surface"}>
          <Image
            src={"/Artboard 1.jpg"}
            width="100%"
            height="100%"
            objectFit="cover"
          />
        </GridItem>
      </Grid>
    </Box>
  );
}
