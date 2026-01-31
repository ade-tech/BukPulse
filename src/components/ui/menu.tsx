import { Stack } from "@chakra-ui/react";
import { GoHomeFill } from "react-icons/go";
import { IoCalendarClear } from "react-icons/io5";
import { HiMiniNewspaper } from "react-icons/hi2";
import { RiAccountCircleFill } from "react-icons/ri";
import { MdAdminPanelSettings } from "react-icons/md";
import { useLocation } from "react-router";

import MenuBlock from "./menuBlock";
import { useCurrentUser } from "@/contexts/AuthContext";
/**
 * Render the bottom navigation menu for the app.
 *
 * The menu shows navigation items: "For You", "Events", "News", and "Accounts".
 * When the current user is a super admin (and user data has finished loading), an additional
 * "Console" item is included and the layout adjusts accordingly.
 *
 * The menu is hidden (returns `null`) for routes matching:
 * - `/news/:id`
 * - `/events/:id`
 * - `/account`
 * - `/account/:id`
 *
 * @returns The navigation bar JSX element, or `null` when the menu should be hidden for the current route.
 */
export default function Menu() {
  const { isSuperAdmin, isLoading } = useCurrentUser();
  const location = useLocation();
  const shouldHideMenu = () => {
    const path = location.pathname;

    const hiddenRoutes = [
      /^\/news\/[^/]+$/,
      /^\/events\/[^/]+$/,
      /^\/account$/,
      /^\/account\/[^/]+$/,
    ];

    return hiddenRoutes.some((pattern) => pattern.test(path));
  };
  const hasAdminFeatures = !isLoading && isSuperAdmin;

  if (shouldHideMenu()) return null;
  return (
    <Stack
      w={hasAdminFeatures ? "11/12" : "10/12"}
      bg={"bg.surface/60"}
      mx={"auto"}
      h={16}
      pos={"fixed"}
      bottom={5}
      rounded={"full"}
      left={0}
      right={0}
      boxShadow={"sm"}
      backdropFilter="saturate(180%) blur(6px)"
      display={"grid"}
      gridTemplateColumns={
        !isLoading && isSuperAdmin ? "repeat(5,1fr)" : "repeat(4,1fr)"
      }
      p={1}
    >
      <MenuBlock title="For You" icon={GoHomeFill} to="/" />
      <MenuBlock title="Events" icon={IoCalendarClear} to="/events" />
      <MenuBlock title="News" icon={HiMiniNewspaper} to="/news" />
      {isSuperAdmin && (
        <MenuBlock title="Console" icon={MdAdminPanelSettings} to="/admin" />
      )}
      <MenuBlock title="Accounts" icon={RiAccountCircleFill} to="/account" />
    </Stack>
  );
}