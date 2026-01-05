"use client";

import {
  Toaster as ChakraToaster,
  Portal,
  Spinner,
  Stack,
  Toast,
  createToaster,
} from "@chakra-ui/react";

export const toaster = createToaster({
  placement: "top",
  pauseOnPageIdle: true,
});

export const Toaster = () => {
  return (
    <Portal>
      <ChakraToaster toaster={toaster} insetInline={{ mdDown: "4" }}>
        {(toast) => (
          <Toast.Root
            width={"2xs"}
            rounded={"full"}
            display={"flex"}
            alignItems={"center"}
            justifyContent={"space-around"}
            textAlign={"center"}
          >
            {toast.type === "loading" ? (
              <Spinner size="sm" color="accent.primary" />
            ) : (
              <Toast.Indicator />
            )}
            <Stack
              gap="1"
              flex="1"
              maxWidth="100%"
              display={"flex"}
              alignItems={"center"}
            >
              {toast.title && <Toast.Title>{toast.title}</Toast.Title>}
              {toast.description && (
                <Toast.Description>{toast.description}</Toast.Description>
              )}
            </Stack>
            {toast.action && (
              <Toast.ActionTrigger rounded={"full"} colorPalette={"green"}>
                {toast.action.label}
              </Toast.ActionTrigger>
            )}
            {toast.meta?.closable && <Toast.CloseTrigger />}
          </Toast.Root>
        )}
      </ChakraToaster>
    </Portal>
  );
};
