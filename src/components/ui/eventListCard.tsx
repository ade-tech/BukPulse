import {
  Box,
  HStack,
  Image,
  Link,
  Skeleton,
  SkeletonText,
  Span,
  Stack,
  Text,
} from "@chakra-ui/react";
import { IoCalendarClear } from "react-icons/io5";
import { IoIosTime } from "react-icons/io";
import { PiUsersFill } from "react-icons/pi";

export default function EventListCard() {
  return (
    <Link
      w={"full"}
      bg={"bg.surface"}
      rounded={"md"}
      px={3}
      py={3}
      gap={3}
      display={"flex"}
      alignItems={"center"}
      mb={4}
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
        <Stack gap={0} fontSize={"sm"}>
          <Text>
            Event by{" "}
            <Span fontWeight={"semibold"} color={"accent.primary"}>
              Adelopo Adekunle
            </Span>
          </Text>
          <HStack fontSize={"xs"} fontWeight={"light"}>
            <Box as={IoCalendarClear} color={"accent.primary"} boxSize={3} />{" "}
            <Text>20th Decemeber 2020 . 12PM WAT</Text>
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
      gap={3}
      display={"flex"}
      justifyContent={"center"}
      alignItems={"center"}
      h={"28"}
      mt={4}
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
      w={"full"}
      bg={"bg.surface"}
      rounded={"md"}
      px={3}
      py={3}
      gap={3}
      display={"flex"}
      alignItems={"center"}
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
