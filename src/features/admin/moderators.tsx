import ModeratorCard, {
  ModeratorsCardSkeleton,
} from "@/components/ui/moderatorCard";
import { useFetchModerators } from "@/hooks/useAuth";
import { Box, Heading, Stack } from "@chakra-ui/react";

export default function Moderators() {
  const { data, isLoading } = useFetchModerators();
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
      <Heading textStyle={"2xl"} lineHeight={2} fontWeight={"bold"}>
        All Moderators
      </Heading>
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
