import { PushNotificationButton } from "@/components/pushNotificationButton";
import { Box } from "@chakra-ui/react";

export default function Home() {
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
      <PushNotificationButton />
    </Box>
  );
}
