import ConsoleItem from "@/components/ui/consoleItem";
import { Box, Heading, Stack, Text } from "@chakra-ui/react";
import { PiListDashesFill } from "react-icons/pi";
import { IoPersonAdd } from "react-icons/io5";
import { MdFeedback } from "react-icons/md";
import { MdEmojiEvents } from "react-icons/md";
import { PiFlagPennantFill } from "react-icons/pi";

export default function AdminConsole() {
  return (
    <Box
      w={"full"}
      h={"full"}
      maxW={"570px"}
      mx={"auto"}
      px={5}
      rounded={"md"}
      overflow={"hidden"}
      overflowY={"auto"}
      className="no-scrollbar"
      pos={"relative"}
    >
      <Heading
        textStyle={"2xl"}
        lineHeight={2}
        fontWeight={"bold"}
        color={"white"}
      >
        Admin Console
      </Heading>
      <Stack mt={5} w={"full"}>
        <Text ml={2} fontWeight={"bold"} textStyle={"lg"}>
          Moderators
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
          <ConsoleItem
            to="/admin/new-moderator"
            title="Create New Moderator Account"
            icon={<IoPersonAdd />}
          />
          <ConsoleItem
            to="/admin/moderators"
            title="View All Moderators"
            icon={<PiListDashesFill />}
            isLast={true}
          />
        </Stack>
      </Stack>
      <Stack mt={5} w={"full"}>
        <Text ml={2} fontWeight={"bold"} textStyle={"lg"}>
          Events
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
          <ConsoleItem
            to="/admin/approve-events"
            title="Approve Events"
            icon={<MdEmojiEvents />}
          />
          <ConsoleItem
            to="/admin/view-events"
            title="Events History"
            icon={<PiListDashesFill />}
            isLast={true}
          />
        </Stack>
      </Stack>
      <Stack mt={5} w={"full"}>
        <Text ml={2} fontWeight={"bold"} textStyle={"lg"}>
          Contents and Privacy
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
          <ConsoleItem
            to="/admin/flagged-contents"
            title="Review Flagged Contents"
            icon={<PiFlagPennantFill />}
          />
          <ConsoleItem
            to="/admin/feedback"
            title="Review Feedbacks"
            icon={<MdFeedback />}
            isLast={true}
          />
        </Stack>
      </Stack>
    </Box>
  );
}
