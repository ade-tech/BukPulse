import { Box, Stack, Text, HStack, Heading } from "@chakra-ui/react";
import { PiEmptyBold } from "react-icons/pi";
import { HiArrowLeft } from "react-icons/hi2";
import { useNavigate } from "react-router";
import { useFetchPastAttendedEvents } from "@/hooks/useEvent";
import EventListCard, {
  EventListCardSkeleton,
} from "@/components/ui/eventListCard";
import MiniButton from "@/components/ui/miniButton";

/**
 * Display the Events History view that shows loading placeholders, an empty state, or a list of past attended events.
 *
 * The component fetches past attended events, provides a back navigation control, and passes a `state` of `{ from: "history" }` to each event card when rendering the list.
 *
 * @returns The Events History JSX element
 */
export default function EventHistory() {
  const { pastAttendedEvents, isLoadingPastEvents } =
    useFetchPastAttendedEvents();
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
          Events History
        </Heading>
      </HStack>

      {/* Content */}
      <Box
        flex={1}
        overflow={"hidden"}
        overflowY={"auto"}
        pt={5}
        className="no-scrollbar"
      >
        {isLoadingPastEvents ? (
          <Stack gap={3}>
            {Array.from({ length: 3 }).map((_, i) => (
              <EventListCardSkeleton key={i} />
            ))}
          </Stack>
        ) : !pastAttendedEvents || pastAttendedEvents.length === 0 ? (
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
              You haven't attended any past events yet
            </Text>
          </Box>
        ) : (
          <Stack gap={3}>
            {pastAttendedEvents.map((event) => (
              <EventListCard
                key={event.id}
                data={event}
                usedBy="user"
                state={{ from: "history" }}
              />
            ))}
          </Stack>
        )}
      </Box>
    </Box>
  );
}