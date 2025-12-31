import { Stack } from "@chakra-ui/react";
import { GoHomeFill } from "react-icons/go";
import { IoCalendarClear } from "react-icons/io5";
import { HiMiniNewspaper } from "react-icons/hi2";
import { RiAccountCircleFill } from "react-icons/ri";
import { MdAdminPanelSettings } from "react-icons/md";

import MenuBlock from "./menuBlock";
import { UseAuth } from "@/contexts/AuthContext";

export default function Menu() {
  const { isSuperAdmin, isLoading } = UseAuth();
  const hasAdminFeatures = !isLoading && isSuperAdmin;
  return (
    <Stack
      w={hasAdminFeatures ? "11/12" : "10/12"}
      bg={"bg.surface/60"}
      mx={"auto"}
      h={16}
      pos={"absolute"}
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
