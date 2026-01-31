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
  Icon,
  Spacer,
  Switch,
  Button,
  IconButton,
} from "@chakra-ui/react";
import { MdFeedback, MdVerified } from "react-icons/md";
import { HiOutlineLogout } from "react-icons/hi";
import MiniButton from "@/components/ui/miniButton";
import { PiEmptyBold, PiListDashesFill } from "react-icons/pi";
import type { AccountContainerProps } from "@/lib/types";
import { useGetUserOtherProfileData } from "@/hooks/useProfile";
import { GrNext } from "react-icons/gr";
import { formatNumbers } from "@/lib/FormatNumbers";
import AccountItem from "./accountItem";
import { TbSettingsFilled } from "react-icons/tb";
import { BsPeopleFill } from "react-icons/bs";
import { RiNotification2Fill } from "react-icons/ri";
import { Link } from "react-router";
import { useForm } from "react-hook-form";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import { toaster } from "./toaster";
import { HiArrowLeft } from "react-icons/hi2";
import AppDrawer from "./AppDrawer";
import { useEffect } from "react";

interface NotificationFormInput {
  notificationsEnabled: boolean;
}

export function AdminAccount({
  logoutUser,
  profile,
  isloading,
  user_id,
  isLoggingOut,
}: AccountContainerProps) {
  const { otherInfo } = useGetUserOtherProfileData(user_id!);
  const { isSubscribed, loading, subscribe, unsubscribe } =
    usePushNotifications();
  const { register, watch, setValue } = useForm<NotificationFormInput>({
    defaultValues: {
      notificationsEnabled: isSubscribed,
    },
  });

  const notificationsEnabled = watch("notificationsEnabled");

  useEffect(() => {
    setValue("notificationsEnabled", isSubscribed);
  }, [isSubscribed, setValue]);

  const handleNotificationToggle = async (enabled: boolean) => {
    try {
      if (enabled) {
        const success = await subscribe();
        if (success) {
          toaster.create({
            title: "Notifications enabled!",
            type: "success",
          });
        } else {
          toaster.create({
            title: "Failed to enable notifications",
            type: "error",
          });
        }
      } else {
        const success = await unsubscribe();
        if (success) {
          toaster.create({
            title: "Notifications disabled",
            type: "success",
          });
        } else {
          toaster.create({
            title: "Failed to disable notifications",
            type: "error",
          });
        }
      }
    } catch (error) {
      toaster.create({
        title: "Error updating notification settings",
        type: "error",
      });
    }
  };

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
      <MiniButton top={2} bg={"bg.surface"} left={0} pos={"absolute"}>
        <HiArrowLeft />
        Back
      </MiniButton>
      <AppDrawer
        trigger={
          <IconButton
            size={"xl"}
            top={4}
            right={4}
            pos={"fixed"}
            bg={"bg.surface/60"}
            boxShadow={"sm"}
            backdropFilter="saturate(180%) blur(6px)"
            rounded={"full"}
            color={"text.primary"}
          >
            <TbSettingsFilled />
          </IconButton>
        }
        drawerTitle="Settings"
        drawerContent={
          <Stack w={"full"} gap={4}>
            <Stack w={"full"} bg={"bg.surface"} pt={3} rounded={"md"} my={4}>
              <AccountItem isLast={true} bg="bg.surface">
                <HStack color={"text.secondary"} w={"full"} mb={2}>
                  <Icon size={"md"}>
                    <RiNotification2Fill />
                  </Icon>
                  <Text fontWeight={"semibold"}>Receive Notifications</Text>
                  <Spacer />
                  <Switch.Root
                    variant={"solid"}
                    colorPalette={"blue"}
                    size={"lg"}
                    checked={notificationsEnabled}
                    onCheckedChange={({ checked }) => {
                      handleNotificationToggle(checked);
                    }}
                    disabled={loading}
                  >
                    <Switch.HiddenInput {...register("notificationsEnabled")} />
                    <Switch.Control />
                    <Switch.Label />
                  </Switch.Root>
                </HStack>
              </AccountItem>
            </Stack>
            <Button
              onClick={() => logoutUser()}
              rounded={"lg"}
              disabled={isLoggingOut}
              w={"full"}
              size={"xl"}
              bg={"red.600"}
              color={"white"}
            >
              <HiOutlineLogout />
              Logout
            </Button>
          </Stack>
        }
        placement="bottom"
      />

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
        <Text lineHeight={1.2} px={3} fontWeight={"light"} fontSize={"md"}>
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
export function UserAccount({
  logoutUser,
  profile,
  isloading,
  isLoggingOut,
}: AccountContainerProps) {
  const { isSubscribed, loading, subscribe, unsubscribe } =
    usePushNotifications();
  const { register, watch, setValue } = useForm<NotificationFormInput>({
    defaultValues: {
      notificationsEnabled: isSubscribed,
    },
  });

  const notificationsEnabled = watch("notificationsEnabled");

  useEffect(() => {
    setValue("notificationsEnabled", isSubscribed);
  }, [isSubscribed, setValue]);

  const handleNotificationToggle = async (enabled: boolean) => {
    try {
      if (enabled) {
        const success = await subscribe();
        if (success) {
          toaster.create({
            title: "Notifications enabled!",
            type: "success",
          });
        } else {
          toaster.create({
            title: "Failed to enable notifications",
            type: "error",
          });
        }
      } else {
        const success = await unsubscribe();
        if (success) {
          toaster.create({
            title: "Notifications disabled",
            type: "success",
          });
        } else {
          toaster.create({
            title: "Failed to disable notifications",
            type: "error",
          });
        }
      }
    } catch (error) {
      toaster.create({
        title: "Error updating notification settings",
        type: "error",
      });
    }
  };

  return isloading ? (
    <UserAccountPreLoader />
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
            fontWeight={"semibold"}
            lineHeight={1}
          >
            {profile?.name}
          </Text>
        </HStack>
        <Text lineHeight={1} fontWeight={"light"} fontSize={"md"}>
          {profile?.reg_number}
        </Text>
      </Stack>
      <Stack mt={12} w={"full"} textAlign={"left"} px={5}>
        <Text ml={2} fontWeight={"bold"} textStyle={"lg"}>
          General
        </Text>
        <Stack
          w={"full"}
          gap={2}
          py={3}
          mx={"auto"}
          bg={"bg.surface"}
          rounded={"xl"}
          color={"accent.primary"}
        >
          <AccountItem>
            {
              <HStack color={"text.secondary"} w={"full"} mb={2}>
                <Icon size={"md"}>
                  <RiNotification2Fill />
                </Icon>
                <Text fontWeight={"semibold"}>Receive Notifications</Text>
                <Spacer />
                <Switch.Root
                  variant={"solid"}
                  colorPalette={"blue"}
                  size={"lg"}
                  checked={notificationsEnabled}
                  onCheckedChange={({ checked }) => {
                    handleNotificationToggle(checked);
                  }}
                  disabled={loading}
                >
                  <Switch.HiddenInput {...register("notificationsEnabled")} />
                  <Switch.Control />
                  <Switch.Label />
                </Switch.Root>
              </HStack>
            }
          </AccountItem>
          <AccountItem>
            {
              <Link
                to={"/event-history"}
                className="flex w-full items-center mb-2! gap-2"
              >
                <Icon color={"text.secondary"} size={"md"}>
                  <PiListDashesFill />
                </Icon>
                <Text fontWeight={"semibold"} color={"text.secondary"}>
                  Events History
                </Text>
                <Spacer />
                <Icon mr={2} color={"text.secondary"}>
                  <GrNext />
                </Icon>
              </Link>
            }
          </AccountItem>
          <AccountItem isLast={true}>
            {
              <Link
                to={"/people-following"}
                className="flex w-full items-center  gap-2"
              >
                <Icon color={"text.secondary"} size={"md"}>
                  <BsPeopleFill />
                </Icon>
                <Text fontWeight={"semibold"} color={"text.secondary"}>
                  People you follow
                </Text>
                <Spacer />
                <Icon mr={2} color={"text.secondary"}>
                  <GrNext />
                </Icon>
              </Link>
            }
          </AccountItem>
        </Stack>
      </Stack>
      <Stack mt={8} w={"full"} textAlign={"left"} px={5}>
        <Text ml={2} fontWeight={"bold"} textStyle={"lg"}>
          Feedbacks
        </Text>
        <Stack
          w={"full"}
          gap={2}
          py={3}
          mx={"auto"}
          bg={"bg.surface"}
          rounded={"xl"}
          color={"accent.primary"}
        >
          <AccountItem isLast={true}>
            {
              <Link to={"/"} className="flex w-full items-center gap-2">
                <Icon color={"text.secondary"} size={"md"}>
                  <MdFeedback />
                </Icon>
                <Text fontWeight={"semibold"} color={"text.secondary"}>
                  Send Feedback
                </Text>
              </Link>
            }
          </AccountItem>
        </Stack>
      </Stack>
      <Button
        onClick={() => logoutUser()}
        rounded={"lg"}
        mt={12}
        disabled={isLoggingOut}
        w={"1/2"}
        size={"xl"}
        bg={"red.600"}
        color={"white"}
      >
        <HiOutlineLogout />
        Logout
      </Button>
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
