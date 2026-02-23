import MiniButton from "@/components/ui/miniButton";
import { useFecthFeedbacks } from "@/hooks/useFeedbacks";
import { Capitalize } from "@/lib/Captialize";
import type { Feedback } from "@/lib/types";
import {
  Box,
  HStack,
  Heading,
  Skeleton,
  Stack,
  Tag,
  Text,
} from "@chakra-ui/react";
import type { ReactNode } from "react";
import { HiArrowLeft } from "react-icons/hi2";
import { PiEmptyBold } from "react-icons/pi";
import { Link } from "react-router";

export default function AdminFeedback() {
  const { data, isLoading } = useFecthFeedbacks();
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
          View Feedbacks
        </Heading>
      </HStack>
      <Stack gap={3} flex={1} pt={8}>
        {isLoading &&
          Array.from({ length: 5 }).map((_, i) => (
            <FeedbackItemSkeleton key={i} />
          ))}
        {!isLoading && data?.length === 0 && <FeedbackEmptyState />}
        {data &&
          data.map((cur) => (
            <FeedbackItem
              key={cur.id}
              category={cur.category}
              title={cur.title}
              status={cur.status}
              description={cur.description}
              id={cur.id}
            />
          ))}
      </Stack>
    </Box>
  );
}

function FeedbackItem({
  title,
  description,
  category,
  id,
  status,
}: Omit<Feedback, "created_at" | "creator_id">): ReactNode {
  return (
    <Box
      w={"full"}
      minH={"fit-content"}
      display={"flex"}
      gap={3}
      flexShrink={0}
      justifyContent={"flex-start"}
      px={4}
      py={4}
      bg={status === "read" ? "bg.page" : "bg.surface"}
      rounded={"lg"}
    >
      <Link
        to={`/admin/feedback/${id}`}
        className="w-full h-full flex flex-col"
      >
        <HStack alignItems={"center"}>
          <Text lineHeight={1.2} mb={2} fontWeight={"semibold"} fontSize={"lg"}>
            {title.slice(0, 20)}
            {title.length > 35 && "..."}
          </Text>
          <Tag.Root
            rounded={"md"}
            colorPalette={status === "unread" ? "orange" : "green"}
            mb={"2"}
            px={"2"}
          >
            <Tag.Label>{Capitalize(category || "general")}</Tag.Label>
          </Tag.Root>
        </HStack>
        <Text color={"text.secondary"}>{description}</Text>
      </Link>
    </Box>
  );
}

function FeedbackItemSkeleton(): ReactNode {
  return (
    <Box
      w={"full"}
      minH={"fit-content"}
      display={"flex"}
      gap={3}
      flexShrink={0}
      justifyContent={"flex-start"}
      px={4}
      py={4}
      bg={"bg.surface"}
      mb={2}
      rounded={"lg"}
    >
      <Stack gap={2} w={"full"}>
        <HStack gap={4} height="5" w={"full"}>
          <Skeleton height="full" w={"2/3"} rounded={"md"} />
          <Skeleton height="full" w={"1/3"} rounded={"md"} />
        </HStack>
        <Skeleton height="5" width="full" rounded={"md"} mb={1} />
      </Stack>
    </Box>
  );
}

function FeedbackEmptyState(): ReactNode {
  return (
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
        No Feedback Available
      </Text>
    </Box>
  );
}
