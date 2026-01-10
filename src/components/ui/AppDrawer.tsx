import type { AppDrawerProps } from "@/lib/types";
import { CloseButton, Drawer, Portal } from "@chakra-ui/react";
export default function AppDrawer({
  placement,
  drawerContent,
  drawerTitle,
  trigger,
}: AppDrawerProps) {
  return (
    <Drawer.Root placement={placement} size={"xl"}>
      <Drawer.Trigger asChild>{trigger}</Drawer.Trigger>
      <Portal>
        <Drawer.Backdrop />
        <Drawer.Positioner>
          <Drawer.Content bg={"bg.page"} roundedTop={"xl"} pt={6} px={4}>
            <Drawer.Title fontSize={"2xl"} h={"12"} ml={4} fontWeight={"bold"}>
              {drawerTitle}
            </Drawer.Title>
            <Drawer.Context>
              {(store) => (
                <Drawer.Body px={1} pb={12}>
                  {typeof drawerContent === "function"
                    ? drawerContent(store)
                    : drawerContent}
                </Drawer.Body>
              )}
            </Drawer.Context>
            <Drawer.CloseTrigger asChild>
              <CloseButton size="md" rounded={"full"} bg={"bg.surface"} />
            </Drawer.CloseTrigger>
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Drawer.Root>
  );
}
