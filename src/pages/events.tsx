import EventListCard, {
  EventListCardSkeleton,
} from "@/components/ui/eventListCard";
import Filter from "@/components/ui/filter";
import { useCurrentUser } from "@/contexts/AuthContext";
import { useFetchAllUpcomingEvents } from "@/hooks/useEvent";
import AdminEvents from "@/features/admin/events";
import { CATEGORIES, type Category } from "@/lib/types";
import { Box, Heading, Stack, Text } from "@chakra-ui/react";
import { useState } from "react";
import { PiEmptyBold } from "react-icons/pi";

export default function Events() {
  const { isAdmin } = useCurrentUser();
  const [curState, setCurState] = useState<Category | "all">("all");
  const { upcomingEventsData, isFetchingEvents } = useFetchAllUpcomingEvents();
  const filteredEvents =
    curState === "all"
      ? upcomingEventsData
      : upcomingEventsData?.filter((cur) => cur.event_category === curState);

  // If user is admin, render the admin events component
  if (isAdmin) {
    return <AdminEvents />;
  }

  // Regular user view
  return (
    <Stack
      w={"full"}
      h={"full"}
      pt={2}
      px={4}
      rounded={"md"}
      overflow={"hidden"}
      overflowY={"auto"}
      className="no-scrollbar"
      pos={"relative"}
    >
      <Heading textStyle={"2xl"} ml={2} lineHeight={2} fontWeight={"bold"}>
        Events
      </Heading>
      <Filter
        filterValues={["all", ...CATEGORIES]}
        filterState={curState}
        filterUpdate={setCurState}
      />

      <Box w={"full"} flex={1} overflow={"hidden"} overflowY={"auto"}>
        {isFetchingEvents &&
          Array.from({ length: 5 }).map((_, i) => (
            <EventListCardSkeleton key={i} />
          ))}

        {filteredEvents?.length === 0 ? (
          <Box
            w={"full"}
            h={"4/5"}
            display={"flex"}
            alignItems={"center"}
            justifyContent={"center"}
            flexDir={"column"}
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
              {curState === "all"
                ? "No upcoming Events now, Check back later"
                : "No Upcoming Events for this category"}
            </Text>
          </Box>
        ) : (
          filteredEvents?.map((cur) => (
            <EventListCard usedBy="user" data={cur} key={cur.id} />
          ))
        )}
      </Box>
    </Stack>
  );
}
