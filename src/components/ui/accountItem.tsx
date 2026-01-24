import { HStack } from "@chakra-ui/react";
import type { ReactNode } from "react";

export default function AccountItem({
  isLast,
  bg,
  children,
}: {
  isLast?: boolean;
  bg?: string;
  children: ReactNode;
}) {
  return (
    <HStack
      mx={4}
      py={1}
      borderColor={"text.secondary/10"}
      borderBottomWidth={isLast ? 0 : 1}
      bg={bg}
    >
      {children}
    </HStack>
  );
}
