import { Stack } from "@chakra-ui/react";
import { Outlet } from "react-router";
import Menu from "./ui/menu";
import Logo from "./ui/logo";
import { UseAuth } from "@/contexts/AuthContext";

export default function AppLayout() {
  const { currentUser } = UseAuth();
  return (
    <Stack
      bg={"bg.page"}
      w={"screen"}
      h={"100dvh"}
      mx={"auto"}
      p={"4"}
      position={"relative"}
    >
      <Logo />
      <Outlet />
      {currentUser && <Menu />}
    </Stack>
  );
}
