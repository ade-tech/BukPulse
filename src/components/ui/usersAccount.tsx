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
import { HiOutlineLogout } from "react-icons/hi";
import MiniButton from "@/components/ui/miniButton";
import { PiEmptyBold } from "react-icons/pi";
import type { AccountContainerProps } from "@/lib/types";
import { useGetUserOtherProfileData } from "@/hooks/useProfile";
import { formatNumbers } from "@/lib/FormatNumbers";

export function AdminAccount({
  logoutUser,
  profile,
  isloading,
  user_id,
  isLoggingOut,
}: AccountContainerProps) {
  const { otherInfo } = useGetUserOtherProfileData(user_id!);
  console.log(otherInfo);
  return isloading ? (
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
        <Text lineHeight={0.5} fontWeight={"light"} fontSize={"md"}>
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
              gap={1}
              alignItems={"center"}
              fontWeight={"extrabold"}
              lineHeight={1}
            >
              Nothing Here!
            </Text>
            <Text display={"inline-block"} fontWeight={"light"} fontSize={"md"}>
              You haven't posted yet
            </Text>
          </Box>
        ))}
      <Grid w={"full"} gap={1} mt={6} templateColumns={"repeat(3, 1fr)"}>
        {otherInfo &&
          otherInfo.posts.length > 0 &&
          otherInfo.posts.map((curPost) => (
            <GridItem aspectRatio={1 / 1} bg={"bg.surface"} key={curPost.id}>
              <Image
                src={curPost.post_image_url}
                width="100%"
                height="100%"
                objectFit="cover"
              />
            </GridItem>
          ))}
      </Grid>
    </Box>
  );
}
export function UserAccount({
  logoutUser,
  isLoggingOut,
}: AccountContainerProps) {
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
        w={"1/5"}
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
