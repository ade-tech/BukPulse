import {
  Box,
  HStack,
  Image,
  Skeleton,
  SkeletonText,
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
import { PiUsersFill } from "react-icons/pi";
import { formatNumbers } from "@/lib/FormatNumbers";

/**
 * Renders an admin-facing event card that links to either the public event page or the admin approval page.
 *
 * @param data - Event data used to populate the card (title, image, date, time, location, and status).
 * @param isOrdinaryAdmin - When true, the card links to `/events/{id}` and includes a link state of `{ from: "history" }`; when false, the card links to `/admin/approve-events/{id}`.
 * @returns A JSX element representing the clickable event card.
 */
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
            <HStack w={"3/5"} fontSize={"sm"} fontWeight={"light"}>
              <Box as={IoCalendarClear} color={"accent.primary"} boxSize={5} />{" "}
              <Text lineHeight={1.2}>
                {format(new Date(data.event_date), "do MMM, yyyy")}.{" "}
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
          <HStack mt={2} fontSize={"sm"} fontWeight={"light"}>
            <Box as={PiUsersFill} color={"accent.primary"} boxSize={5} />{" "}
            <Text>{formatNumbers(data.attendees)} Attendees</Text>
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
