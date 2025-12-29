import { Box, Text } from "@chakra-ui/react";
import type React from "react";
import { NavLink } from "react-router";

interface MenuBlockProps {
  icon: React.ElementType;
  to: string;
  title: string;
}
export default function MenuBlock({ icon, title, to }: MenuBlockProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex justify-center gap-1 flex-col items-center rounded-full h-full ${
          isActive ? "dark:bg-gray-950/60 bg-gray-100 text-blue-500" : ""
        }`
      }
    >
      {({ isActive }: { isActive: boolean }) => (
        <>
          <Box
            as={icon}
            boxSize={6}
            color={isActive ? "accent.primary" : "text.primary"}
            transition="all 0.2s ease-in-out"
          />
          <Text
            textStyle={"2xs"}
            fontWeight={"regular"}
            transition="all 0.2s ease-in-out"
            color={isActive ? "accent.primary" : "text.primary"}
          >
            {title}
          </Text>
        </>
      )}
    </NavLink>
  );
}
