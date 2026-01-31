import {
  Box,
  Button,
  ButtonGroup,
  HStack,
  Image,
  Skeleton,
  SkeletonText,
  Span,
  Stack,
  Tag,
  Text,
} from "@chakra-ui/react";
import { FaLocationDot } from "react-icons/fa6";
import { IoCalendarClear } from "react-icons/io5";
import { format, parse } from "date-fns";
import type { Event } from "@/lib/types";
import { Link } from "react-router";
import { Capitalize } from "@/lib/Captialize";

export default function EventCard() {
  return (
    <Stack
      w={"full"}
      bg={"bg.surface"}
      rounded={"md"}
      pos={"relative"}
      maxW="470px"
      mb={4}
      pb={4}
    >
      <Box
        aspectRatio={2.5 / 1}
        w={"full"}
        bg={"bg.muted"}
        roundedTop={"lg"}
        overflow="hidden"
      >
        <Image
          roundedTop={"lg"}
          src={"/Artboard 1.jpg"}
          width="100%"
          height="100%"
          objectFit="cover"
        />
      </Box>
      <Box px={4} pb={1} mt={2}>
        <Text lineHeight={1.2} fontWeight={"semibold"} fontSize={"lg"}>
          The Importance of a good Family
        </Text>
        <Stack mt={1} gap={2}>
          <Text>
            Event by{" "}
            <Span fontWeight={"semibold"} color={"accent.primary"}>
              Adelopo Adekunle
            </Span>
          </Text>
          <HStack fontSize={"sm"} fontWeight={"light"}>
            <Box as={IoCalendarClear} color={"accent.primary"} boxSize={5} />{" "}
            <Text>20th Decemeber 2020 . 12PM WAT</Text>
          </HStack>
          <HStack fontSize={"sm"} fontWeight={"light"}>
            <Box as={FaLocationDot} color={"accent.primary"} boxSize={5} />{" "}
            <Text>Online . Google Meet</Text>
          </HStack>
        </Stack>
        <ButtonGroup w={"full"} mt={3}>
          <Button rounded={"full"} w={"1/2"} bg={"accent.primary"}>
            Attend
          </Button>
          <Button rounded={"full"} w={"1/2"} variant={"outline"}>
            Share
          </Button>
        </ButtonGroup>
      </Box>
    </Stack>
  );
}
export function EventAdminCard({
  data,
  isOrdinaryAdmin = false,
}: {
  data: Event;
  isOrdinaryAdmin?: boolean;
}) {
  const linkState = isOrdinaryAdmin && { from: "history" };
  const linkPath = isOrdinaryAdmin
    ? `/events/${data.id}`
    : `/admin/approve-events/${data.id}`;
  return (
    <Link
      to={linkPath}
      style={{ textDecoration: "none", width: "100%" }}
      state={linkState}
    >
      <Stack
        w={"full"}
        bg={"bg.surface"}
        rounded={"md"}
        pos={"relative"}
        maxW="470px"
        mb={4}
        pb={4}
      >
        <Tag.Root
          pos={"absolute"}
          top={2}
          right={2}
          rounded={"md"}
          colorPalette={data.event_status === "pending" ? "orange" : "green"}
        >
          <Tag.Label>{Capitalize(data.event_status)}</Tag.Label>
        </Tag.Root>
        <Box
          aspectRatio={2.5 / 1}
          w={"full"}
          bg={"bg.muted"}
          roundedTop={"lg"}
          overflow="hidden"
        >
          <Image
            roundedTop={"lg"}
            src={data.event_image_url}
            width="100%"
            height="100%"
            objectFit="cover"
          />
        </Box>
        <Box px={4} pb={1} mt={2}>
          <Text lineHeight={1.2} mb={2} fontWeight={"semibold"} fontSize={"lg"}>
            {data.event_title}
          </Text>
          <HStack mt={1} gap={2}>
            <HStack w={"1/2"} fontSize={"sm"} fontWeight={"light"}>
              <Box as={IoCalendarClear} color={"accent.primary"} boxSize={5} />{" "}
              <Text lineHeight={1.2}>
                {format(new Date(data.event_date), "do MMM, yyyy")}.
                <br />{" "}
                {format(
                  parse(data.event_time, "HH:mm:ss", new Date()),
                  "h:mm a",
                )}
              </Text>
            </HStack>
            <HStack fontSize={"sm"} fontWeight={"light"}>
              <Box as={FaLocationDot} color={"accent.primary"} boxSize={5} />{" "}
              <Text>{data.event_location}</Text>
            </HStack>
          </HStack>
        </Box>
      </Stack>
    </Link>
  );
}

export function EventsCardSkeleton() {
  return (
    <Box
      w={"full"}
      h={"250px"}
      gap={3}
      justifyContent={"flex-start"}
      px={4}
      py={4}
      bg={"bg.surface"}
      rounded={"md"}
    >
      <Skeleton height="28" w={"full"} mb={2} rounded={"md"} />
      <Stack w={"full"}>
        <HStack w={"full"}>
          <HStack display={"flex"} w={"full"}>
            <Skeleton height="6" width="full" rounded={"md"} />
          </HStack>
        </HStack>
        <SkeletonText noOfLines={2} rounded={"md"} />
      </Stack>
    </Box>
  );
}
