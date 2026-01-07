import { Box } from "@chakra-ui/react";
import EventCard from "../components/ui/eventCard";
import EventListCard from "@/components/ui/eventListCard";

export default function Events() {
  return (
    <Box
      w={"full"}
      h={"full"}
      pt={2}
      px={4}
      rounded={"md"}
      overflow={"hidden"}
      overflowY={"auto"}
      className="no-scrollbar"
    >
      <EventCard />
      <EventListCard />
    </Box>
  );
}
