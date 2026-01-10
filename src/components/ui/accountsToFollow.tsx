import { Box, Button, Heading, Spinner, Text } from "@chakra-ui/react";
import type React from "react";
import { HiArrowLeft } from "react-icons/hi2";
import AccountsCard, { AccountsCardSkeleton } from "./accountCard";
import { useFetchModerators, useUpdateNewUser } from "@/hooks/useAuth";
import { useHasFollowedSomeone } from "@/hooks/useFollow";
import { useNavigate } from "react-router";
interface AccountsToFollow {
  setStep: React.Dispatch<React.SetStateAction<number>>;
  user_id: string;
}

export default function AccountsToFollow({
  setStep,
  user_id,
}: AccountsToFollow) {
  const naviagte = useNavigate();
  const { data, isLoading } = useFetchModerators();
  const { data: followershipStatus, isLoading: isLoadingStatus } =
    useHasFollowedSomeone(user_id);
  const { updateUser, isUpdatingUser } = useUpdateNewUser();
  return (
    <Box
      w={"full"}
      h={"full"}
      display={"flex"}
      alignItems={"center"}
      flexDir={"column"}
      overflow={"hidden"}
      pt={8}
    >
      <Button
        onClick={() => {
          setStep((curStep) => (curStep !== 0 ? (curStep -= 1) : curStep));
        }}
        variant={"outline"}
        top={1}
        left={5}
        pos={"absolute"}
        size={"2xs"}
        rounded={"full"}
      >
        <HiArrowLeft />
        Back
      </Button>
      <Heading
        textStyle={"2xl"}
        lineHeight={2}
        fontWeight={"bold"}
        textAlign={"center"}
        color={"accent.primary"}
      >
        Moderators you might like
      </Heading>
      <Text
        fontSize={"sm"}
        lineHeight={1.3}
        color={"text.primary"}
        textAlign={"center"}
        fontWeight={"light"}
        mb={8}
      >
        When you follow a moderator you would see
        <br /> their posts in your home timeline.
      </Text>
      <Box
        className="no-scrollbar"
        w={"full"}
        flex={1}
        overflow={"hidden"}
        overflowY={"scroll"}
        display={"flex"}
        flexDir={"column"}
        alignItems={"flex-start"}
        px={4}
      >
        {isLoading &&
          Array.from({ length: 6 }).map((_, i) => (
            <AccountsCardSkeleton key={i} />
          ))}
        {data?.map((curModerator) => (
          <AccountsCard
            id={user_id}
            data={curModerator}
            key={curModerator.id}
          />
        ))}
      </Box>
      <Button
        mb={8}
        w={"91.67%"}
        size={"lg"}
        bg={"accent.primary"}
        display={"flex"}
        alignItems={"center"}
        justifyContent={"center"}
        rounded={"lg"}
        disabled={!followershipStatus || isLoadingStatus || isUpdatingUser}
        onClick={() => {
          updateUser(undefined, {
            onSuccess: () => naviagte("/"),
          });
        }}
      >
        {isLoadingStatus || isUpdatingUser ? (
          <Spinner color={"text.primary"} size={"sm"} />
        ) : (
          "Next"
        )}
      </Button>
    </Box>
  );
}
