import EventListCard, {
  EventListCardSkeleton,
} from "@/components/ui/eventListCard";
import Filter from "@/components/ui/filter";
import MiniButton from "@/components/ui/miniButton";
import { useGetPendingEvents } from "@/hooks/useEvent";
import { CATEGORIES, type Category } from "@/lib/types";
import { Box, Heading, HStack, Text } from "@chakra-ui/react";
import { useState } from "react";
import { HiArrowLeft } from "react-icons/hi2";
import { PiEmptyBold } from "react-icons/pi";

export default function ApproveEvent() {
  const [curState, setCurState] = useState<Category | "all">("all");
  const { pendingEvents, isGettingPendingEvents } = useGetPendingEvents();
  const filteredEvents =
    curState === "all"
      ? pendingEvents
      : pendingEvents?.filter((cur) => cur.event_category === curState);
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
        <MiniButton ml={0} bg={"bg.surface"}>
          <HiArrowLeft />
          Back
        </MiniButton>

        <Heading textStyle={"2xl"} lineHeight={2} fontWeight={"bold"}>
          Approve Events
        </Heading>
      </HStack>
      <Box w={"full"} flex={1} overflow={"hidden"} overflowY={"auto"}>
        <Filter
          filterValues={["all", ...CATEGORIES]}
          filterState={curState}
          filterUpdate={setCurState}
        />
        {isGettingPendingEvents &&
          Array.from({ length: 6 }).map((_, i) => (
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
                ? "No Pending Events"
                : "No Pending Events for this category"}
            </Text>
          </Box>
        ) : (
          filteredEvents?.map((cur) => (
            <EventListCard data={cur} key={cur.id} />
          ))
        )}
      </Box>
    </Box>
  );
}
