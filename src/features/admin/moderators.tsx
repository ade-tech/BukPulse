import MiniButton from "@/components/ui/miniButton";
import ModeratorCard, {
  ModeratorsCardSkeleton,
} from "@/components/ui/moderatorCard";
import { useFetchModerators } from "@/hooks/useAuth";
import { Box, Heading, HStack, Stack } from "@chakra-ui/react";
import { HiArrowLeft } from "react-icons/hi2";
import { useNavigate } from "react-router";

export default function Moderators() {
  const { data, isLoading } = useFetchModerators();
  const navigate = useNavigate();
  return (
    <Box
      w={"full"}
      h={"full"}
      maxW={"570px"}
      mx={"auto"}
      px={5}
      rounded={"md"}
      overflow={"hidden"}
      className="no-scrollbar"
      pos={"relative"}
    >
      <HStack w={"full"} mb={4}>
        <MiniButton ml={0} bg={"bg.surface"} onClick={() => navigate(-1)}>
          <HiArrowLeft />
          Back
        </MiniButton>
        <Heading textStyle={"2xl"} lineHeight={2} fontWeight={"bold"}>
          All Moderators
        </Heading>
      </HStack>
      <Stack
        flex={1}
        className="no-scrollbar"
        pb={12}
        overflow={"hidden"}
        overflowY={"scroll"}
      >
        {isLoading &&
          Array.from({ length: 9 }).map((_, i) => (
            <ModeratorsCardSkeleton key={i} />
          ))}
        {data && data?.map((cur) => <ModeratorCard key={cur.id} data={cur} />)}
      </Stack>
    </Box>
  );
}
