import { Stack } from "@chakra-ui/react";
import Logo from "./logo";

export default function PagePreloader() {
  return (
    <Stack
      pos={"absolute"}
      zIndex={100}
      w={"full"}
      h={"100dvh"}
      top={0}
      bg={"bg.page"}
      m={0}
      p={0}
      left={0}
      display={"flex"}
      alignItems={"center"}
      justifyContent={"center"}
    >
      <Logo animation="pulse" />
    </Stack>
  );
}
