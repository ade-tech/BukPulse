import { Stack } from "@chakra-ui/react";
import { GoHomeFill } from "react-icons/go";
import { IoCalendarClear } from "react-icons/io5";
import { HiMiniNewspaper } from "react-icons/hi2";
import { RiAccountCircleFill } from "react-icons/ri";

import MenuBlock from "./menuBlock";

export default function Menu() {
  return (
    <Stack
      w={"10/12"}
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
      gridTemplateColumns={"repeat(4,1fr)"}
      p={1}
    >
      <MenuBlock title="Home" icon={GoHomeFill} to="/" />
      <MenuBlock title="Events" icon={IoCalendarClear} to="/events" />
      <MenuBlock title="News" icon={HiMiniNewspaper} to="/news" />
      <MenuBlock title="Accounts" icon={RiAccountCircleFill} to="/account" />
    </Stack>
  );
}
