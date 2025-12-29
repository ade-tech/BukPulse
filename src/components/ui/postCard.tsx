import { Box, Image, Stack, Text } from "@chakra-ui/react";
import PostHeader from "./postHeader";
import PostActions from "./postActions";

export default function PostCard() {
  return (
    <Stack w={"full"} bg={"bg.surface"} rounded={"md"} maxW="470px" mb={4}>
      <PostHeader />
      <Box px={4} pb={1}>
        <Text lineHeight={1.2} fontWeight={"light"} fontSize={"md"}>
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Minima
        </Text>
      </Box>
      <Box aspectRatio={1 / 1} w={"full"} bg={"bg.muted"} overflow={"hidden"}>
        <Image
          src={"/Artboard 1.jpg"}
          width="100%"
          height="100%"
          objectFit="cover"
        />
      </Box>
      <PostActions />
    </Stack>
  );
}

//    bgGradient="linear(to-tr, yellow.400, pink.500, purple.600)"

//  <IconButton
//           icon={<MoreHorizontal size={20} />}
//           variant="ghost"
//           size="sm"
//           aria-label="More options"
//         />
