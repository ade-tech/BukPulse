import { Stack } from "@chakra-ui/react";
import { Outlet } from "react-router";
import Menu from "./ui/menu";
import Logo from "./ui/logo";

export default function AppLayout() {
  return (
    <Stack
      bg={"bg.page"}
      w={"screen"}
      h={"100dvh"}
      mx={"auto"}
      textAlign={"center"}
      p={"4"}
      position={"relative"}
    >
      <Logo />
      <Outlet />
      <Menu />
    </Stack>
  );
}
