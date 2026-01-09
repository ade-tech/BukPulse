import { EventAdminCard } from "@/components/ui/eventCard";
import EventListCard, {
  AdminEventListCard,
} from "@/components/ui/eventListCard";
import { Box, Tabs, Heading, IconButton } from "@chakra-ui/react";
import { HiPlus } from "react-icons/hi2";

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
      pos={"relative"}
    >
      <Heading textStyle={"2xl"} ml={2} lineHeight={2} fontWeight={"bold"}>
        Events
      </Heading>
      <Demo />
      <IconButton
        rounded={"full"}
        size={"xl"}
        pos={"fixed"}
        bottom={"28"}
        right={6}
        boxShadow={"2xl"}
        bg={"accent.primary"}
      >
        <HiPlus />
      </IconButton>
    </Box>
  );
}
const Demo = () => {
  return (
    <Tabs.Root
      defaultValue="upcoming"
      size={"md"}
      fitted
      lazyMount
      variant="plain"
      css={{
        "--tabs-indicator-bg": "colors.accent.primary",
        "--tabs-indicator-shadow": "shadows.xs",
        "--tabs-trigger-radius": "radii.full",
      }}
    >
      <Tabs.List
        rounded={"full"}
        p={2}
        bg={"bg.surface"}
        backdropFilter="saturate(180%) blur(6px)"
        w={"full"}
      >
        <Tabs.Trigger
          color={"text.primary"}
          _selected={{ color: "white" }}
          value="upcoming"
        >
          Upcoming{" "}
        </Tabs.Trigger>
        <Tabs.Trigger
          color={"text.primary"}
          _selected={{ color: "white" }}
          value="projects"
        >
          Past Events
        </Tabs.Trigger>
        <Tabs.Indicator />
      </Tabs.List>
      <Tabs.Content value="upcoming">
        <EventAdminCard />
        <EventListCard />
        <AdminEventListCard />
      </Tabs.Content>

      <Tabs.Content value="projects">Manage your projects</Tabs.Content>
    </Tabs.Root>
  );
};
