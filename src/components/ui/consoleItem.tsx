import type { ConsoleItemProps } from "@/lib/types";
import { HStack, Text } from "@chakra-ui/react";
import { Link } from "react-router";

export default function ConsoleItem({
  title,
  icon,
  to,
  isLast = false,
}: ConsoleItemProps) {
  return (
    <HStack
      mx={4}
      py={1}
      borderColor={"text.secondary/10"}
      borderBottomWidth={isLast ? 0 : 1}
    >
      <Link
        to={to}
        className={`${isLast ? "!pb-0" : "!pb-2"} flex items-center gap-2`}
      >
        {icon}
        <Text fontSize={"sm"}>{title}</Text>
      </Link>
    </HStack>
  );
}
