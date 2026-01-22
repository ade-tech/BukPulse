import {
  Box,
  HStack,
  Image,
  Skeleton,
  SkeletonText,
  Span,
  Stack,
  Text,
} from "@chakra-ui/react";
import { IoCalendarClear } from "react-icons/io5";
import { IoIosTime } from "react-icons/io";
import { PiUsersFill } from "react-icons/pi";
import { format, parse } from "date-fns";
import type { Event } from "@/lib/types";
import { Link } from "react-router";
import { formatNumbers } from "@/lib/FormatNumbers";
import { FaLocationDot } from "react-icons/fa6";
import { MdVerified } from "react-icons/md";

export default function EventListCard({
  data,
  usedBy = "admin",
}: {
  data: Event;
  usedBy?: "admin" | "user";
}) {
  return (
    <Link
      className="w-full bg-white dark:bg-gray-900 rounded-xl px-3! py-3! flex gap-3 items-center mb-4!"
      to={
        usedBy === "admin"
          ? `/admin/approve-events/${data.id}`
          : `/events/${data.id}`
      }
    >
      <Box
        flexBasis={"1/4"}
        aspectRatio={1.5 / 1}
        w={"full"}
        bg={"bg.muted"}
        rounded={"md"}
        overflow="hidden"
      >
        <Image
          roundedTop={"sm"}
          src={data.event_image_url}
          width="100%"
          height="100%"
          objectFit="cover"
        />
      </Box>
      <Stack gap={1}>
        <Text lineHeight={1.1} fontWeight={"bold"} fontSize={"md"}>
          {data.event_title.length > 25
            ? `${data.event_title.slice(0, 25)}...`
            : data.event_title}
        </Text>
        <Stack gap={0} fontSize={"sm"}>
          <Text>
            Event by{" "}
            <Span
              fontWeight={"semibold"}
              display={"inline-flex"}
              gap={1}
              alignItems={"center"}
              color={"accent.primary"}
            >
              {data.profiles.name}{" "}
              <Box as={MdVerified} color="accent.primary" />
            </Span>
          </Text>
          <HStack fontSize={"xs"} fontWeight={"light"}>
            <Box as={IoCalendarClear} color={"accent.primary"} boxSize={3} />{" "}
            <Text>
              {format(new Date(data.event_date), "do MMM yyyy")} .{" "}
              {format(parse(data.event_time, "HH:mm:ss", new Date()), "h:mm a")}
            </Text>
          </HStack>
          <HStack w={"full"} fontSize={"xs"} fontWeight={"light"}>
            <HStack>
              <Box as={PiUsersFill} color={"accent.primary"} boxSize={3} />{" "}
              <Text>{formatNumbers(data.attendees)} Attendees</Text>
            </HStack>
            <HStack>
              <Box as={FaLocationDot} color={"accent.primary"} boxSize={3} />{" "}
              <Text>
                {data.event_location.length > 15
                  ? `${data.event_location.slice(0, 15)}...`
                  : data.event_location}
              </Text>
            </HStack>
          </HStack>
        </Stack>
      </Stack>
    </Link>
  );
}

export const EventListCardSkeleton = () => {
  return (
    <HStack
      w={"full"}
      bg={"bg.surface"}
      rounded={"md"}
      px={3}
      py={3}
      gap={2}
      mb={2}
      display={"flex"}
      justifyContent={"center"}
      alignItems={"center"}
      h={"28"}
    >
      <Skeleton height="full" w={"1/3"} rounded={"md"} />

      <Stack w={"2/3"} gap={0.5}>
        <Skeleton height="6" width="full" rounded={"md"} mb={1} />
        <SkeletonText noOfLines={2} rounded={"md"} />
      </Stack>
    </HStack>
  );
};
export const AdminEventListCard = () => {
  return (
    <Link
      className="w-full bg-white dark:bg-gray-900 rounded-xl px-3! py-3! flex gap-3 items-center mb-4!"
      to={`/admin/approve-events`}
    >
      <Box
        flexBasis={"1/4"}
        aspectRatio={1.5 / 1}
        w={"full"}
        bg={"bg.muted"}
        rounded={"md"}
        overflow="hidden"
      >
        <Image
          roundedTop={"sm"}
          src={"/Artboard 1.jpg"}
          width="100%"
          height="100%"
          objectFit="cover"
        />
      </Box>
      <Stack gap={0.5}>
        <Text lineHeight={1.1} fontWeight={"normal"} fontSize={"md"}>
          The Importance of a good Family
        </Text>
        <HStack gap={3} fontSize={"sm"}>
          <HStack fontSize={"xs"} fontWeight={"light"}>
            <Box as={IoCalendarClear} color={"accent.primary"} boxSize={3} />{" "}
            <Text>20th Decemeber 2020</Text>
          </HStack>
          <HStack fontSize={"xs"} fontWeight={"light"}>
            <Box as={IoIosTime} color={"accent.primary"} boxSize={3} />{" "}
            <Text>12PM WAT</Text>
          </HStack>
        </HStack>
        <HStack fontSize={"xs"} fontWeight={"light"}>
          <Box as={PiUsersFill} color={"accent.primary"} boxSize={3} />{" "}
          <Text>140 Attendees</Text>
        </HStack>
      </Stack>
    </Link>
  );
};
