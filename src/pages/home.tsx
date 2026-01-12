import { PushNotificationButton } from "@/components/pushNotificationButton";
import PostCard from "@/components/ui/postCard";
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
      <PostCard />
      <PostCard />
      <PostCard />
    </Box>
  );
}
