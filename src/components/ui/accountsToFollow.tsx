import { Box, Button, Heading, Text } from "@chakra-ui/react";
import type React from "react";
import { HiArrowLeft } from "react-icons/hi2";
import AccountsCard from "./AccountsCard";

interface AccountsToFollow {
  setStep: React.Dispatch<React.SetStateAction<number>>;
}

export default function AccountsToFollow({ setStep }: AccountsToFollow) {
  return (
    <Box
      w={"full"}
      h={"full"}
      display={"flex"}
      alignItems={"center"}
      flexDir={"column"}
      overflow={"hidden"}
      pt={8}
    >
      <Button
        onClick={() => {
          setStep((curStep) => (curStep !== 0 ? (curStep -= 1) : curStep));
        }}
        variant={"outline"}
        top={1}
        left={5}
        pos={"absolute"}
        size={"2xs"}
        rounded={"full"}
      >
        <HiArrowLeft />
        Back
      </Button>
      <Heading
        textStyle={"2xl"}
        lineHeight={2}
        fontWeight={"bold"}
        textAlign={"center"}
        color={"accent.primary"}
      >
        Moderators you might like
      </Heading>
      <Text
        fontSize={"sm"}
        lineHeight={1.3}
        color={"text.primary"}
        textAlign={"center"}
        fontWeight={"light"}
        mb={8}
      >
        When you follow a moderator you would see
        <br /> their posts in your home timeline.
      </Text>
      <Box
        className="no-scrollbar"
        w={"full"}
        flex={1}
        overflow={"hidden"}
        overflowY={"scroll"}
        display={"flex"}
        flexDir={"column"}
        alignItems={"flex-start"}
        px={4}
      >
        <AccountsCard />
        <AccountsCard />
        <AccountsCard />
        <AccountsCard />
        <AccountsCard />
        <AccountsCard />
      </Box>
    </Box>
  );
}
