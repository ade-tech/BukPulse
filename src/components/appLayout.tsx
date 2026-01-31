import { Box, HStack, Stack } from "@chakra-ui/react";
import { NavLink, Outlet, useLocation } from "react-router";
import Menu from "./ui/menu";
import Logo from "./ui/logo";
import { useCurrentUser } from "@/contexts/AuthContext";
import { IoMdNotifications } from "react-icons/io";
import { IoSearch } from "react-icons/io5";

export default function AppLayout() {
  const { currentUser } = useCurrentUser();
  const location = useLocation();

  // Updated regex to match "/notification" (singular) as seen in your NavLink
  const cleanPages = [/^\/search$/, /^\/notification$/];

  const hiddenRoutes = [/^\/news\/[^/]+$/, /^\/events\/[^/]+$/, /^\/account$/];

  const showCleanPage = cleanPages.some((pattern) =>
    pattern.test(location.pathname),
  );

  const shouldHideActions = hiddenRoutes.some((pattern) =>
    pattern.test(location.pathname),
  );

  return (
    <Stack
      bg={"bg.page"}
      w={"screen"}
      h={"100dvh"}
      mx={"auto"}
      position={"relative"}
      p={0}
      m={0}
    >
      {/* Hide the entire Header (Logo + Icons) if it is a 'clean page' */}
      {!showCleanPage && (
        <HStack
          w={"full"}
          p={3}
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          <Logo />

          {currentUser &&
            !currentUser.user_metadata.is_new &&
            !shouldHideActions && (
              <HStack
                bg={"bg.surface/60"}
                boxShadow={"sm"}
                backdropFilter="saturate(180%) blur(6px)"
                rounded={"full"}
                py={"2"}
                px={3}
              >
                <NavLink
                  to={"/notification"}
                  className="flex justify-center gap-1 flex-col items-center rounded-full h-full"
                >
                  {({ isActive }: { isActive: boolean }) => (
                    <Box
                      as={IoMdNotifications}
                      boxSize={6}
                      color={isActive ? "accent.primary" : "text.primary"}
                      transition="all 0.2s ease-in-out"
                    />
                  )}
                </NavLink>
                <NavLink
                  to={"/search"}
                  className="flex justify-center gap-1 flex-col items-center rounded-full h-full"
                >
                  {({ isActive }: { isActive: boolean }) => (
                    <Box
                      as={IoSearch}
                      boxSize={6}
                      color={isActive ? "accent.primary" : "text.primary"}
                      transition="all 0.2s ease-in-out"
                    />
                  )}
                </NavLink>
              </HStack>
            )}
        </HStack>
      )}

      <Outlet />

      {/* Hide Menu if it is a 'clean page' */}
      {currentUser && !currentUser.user_metadata.is_new && !showCleanPage && (
        <Menu />
      )}
    </Stack>
  );
}
