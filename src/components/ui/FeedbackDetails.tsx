import { useEffect } from "react";
import MiniButton from "@/components/ui/miniButton";
import { useFetchFeedback, useMarkAsRead } from "@/hooks/useFeedbacks";
import { Capitalize } from "@/lib/Captialize";
import {
  Box,
  Heading,
  HStack,
  Skeleton,
  SkeletonText,
  Stack,
  Tag,
  Text,
} from "@chakra-ui/react";
import { HiArrowLeft } from "react-icons/hi2";
import { PiEmptyBold } from "react-icons/pi";
import { useParams } from "react-router";

export default function FeedbackDetails() {
  const { id } = useParams();
  const { mutate } = useMarkAsRead();
  const { data: feedback, isLoading, isError, error } = useFetchFeedback(id);
  const displayCategory = feedback
    ? Array.isArray(feedback.category)
      ? feedback.category[0]
      : (feedback.category as string)
    : "general";

  useEffect(() => {
    if (!isLoading && feedback && feedback.status !== "read") {
      mutate(id!);
    }
  }, [feedback, id, isLoading, mutate]);

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
          Feedback Detail
        </Heading>
      </HStack>

      {isLoading && (
        <Stack w={"full"} flex={1} pt={6}>
          <FeedbackDetailsSkeleton />
        </Stack>
      )}

      {!isLoading && !feedback && (
        <Box
          w={"full"}
          h={"4/5"}
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
          flexDir={"column"}
        >
          <PiEmptyBold size={"48"} className="mb-3!" />
          <Text fontSize={"3xl"} fontWeight={"extrabold"} lineHeight={1}>
            Nothing Here!
          </Text>
          <Text fontWeight={"light"} fontSize={"md"}>
            Feedback not found
          </Text>
        </Box>
      )}
      {!isLoading && isError && (
        <Text color={"red.500"} fontSize={"sm"} mt={4}>
          {(error as Error)?.message || "Failed to load feedback detail."}
        </Text>
      )}

      {!isLoading && feedback && (
        <Box w={"full"} flex={1} overflow={"hidden"} overflowY={"auto"} pt={5}>
          <Heading
            textStyle={"2xl"}
            lineHeight={1.2}
            mb={3}
            fontWeight={"bold"}
          >
            {feedback.title}
          </Heading>
          <Text color={"text.secondary"} whiteSpace={"pre-wrap"}>
            {feedback.description}
          </Text>
          <Tag.Root
            size="lg"
            colorPalette={feedback.status === "unread" ? "orange" : "green"}
            w={"fit-content"}
            mt={4}
          >
            <Tag.Label>{Capitalize(displayCategory || "general")}</Tag.Label>
          </Tag.Root>
        </Box>
      )}
    </Box>
  );
}

function FeedbackDetailsSkeleton() {
  return (
    <Box w={"full"} px={1} py={2}>
      <Skeleton height="8" width="2/3" rounded={"md"} mb={4} />
      <SkeletonText noOfLines={6} rounded={"md"} />
      <Skeleton height="8" width="28" rounded={"md"} mt={4} />
    </Box>
  );
}
