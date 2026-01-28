import { Box, Stack, Text, HStack, Heading } from "@chakra-ui/react";
import { PiEmptyBold } from "react-icons/pi";
import { HiArrowLeft } from "react-icons/hi2";
import { useNavigate } from "react-router";
import { useCurrentUser } from "@/contexts/AuthContext";
import { useFetchFollowedUsers } from "@/hooks/useFollow";
import AccountsCard, {
  AccountsCardSkeleton,
} from "@/components/ui/accountCard";
import MiniButton from "@/components/ui/miniButton";

export default function PeopleFollowing() {
  const { currentUser } = useCurrentUser();
  const { followedUsers, isLoadingFollowedUsers } = useFetchFollowedUsers(
    currentUser?.id || "",
  );
  const navigate = useNavigate();

  return (
    <Box
      w={"full"}
      h={"full"}
      maxW={"570px"}
      mx={"auto"}
      pt={2}
      rounded={"md"}
      overflow={"hidden"}
      display={"flex"}
      flexDir={"column"}
      className="no-scrollbar"
      px={5}
    >
      <HStack w={"full"}>
        <MiniButton ml={0} bg={"bg.surface"} onClick={() => navigate(-1)}>
          <HiArrowLeft />
          Back
        </MiniButton>

        <Heading textStyle={"2xl"} lineHeight={2} fontWeight={"bold"}>
          People you follow
        </Heading>
      </HStack>

      <Box
        flex={1}
        overflow={"hidden"}
        overflowY={"auto"}
        pt={5}
        className="no-scrollbar"
      >
        {isLoadingFollowedUsers ? (
          <Stack gap={0}>
            {Array.from({ length: 5 }).map((_, i) => (
              <AccountsCardSkeleton key={i} />
            ))}
          </Stack>
        ) : !followedUsers || followedUsers.length === 0 ? (
          <Box
            w={"full"}
            display={"flex"}
            alignItems={"center"}
            justifyContent={"center"}
            flexDir={"column"}
            flex={1}
            minH={"400px"}
          >
            <PiEmptyBold size={"48"} className="mb-3!" />
            <Text
              mx={"auto"}
              fontSize={"2xl"}
              display={"flex"}
              gap={1}
              alignItems={"center"}
              fontWeight={"extrabold"}
              lineHeight={1}
            >
              Nothing Here!
            </Text>
            <Text
              display={"inline-block"}
              fontWeight={"light"}
              fontSize={"md"}
              mt={2}
            >
              You are not following anyone yet
            </Text>
          </Box>
        ) : (
          <Stack gap={0}>
            {followedUsers.map((profile) => (
              <AccountsCard
                key={profile.id}
                data={profile}
                id={currentUser?.id || ""}
                displayOnly={true}
              />
            ))}
          </Stack>
        )}
      </Box>
    </Box>
  );
}
