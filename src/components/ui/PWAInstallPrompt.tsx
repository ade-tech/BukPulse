import { useEffect, useState } from "react";
import {
  Drawer,
  Button,
  Text,
  VStack,
  Icon,
  Box,
  useDisclosure,
} from "@chakra-ui/react";
import { MdGetApp, MdIosShare } from "react-icons/md";

const COOLDOWN_HOURS = 48;
const SHOW_CHANCE = 0.3;

export const PwaInstallDrawer = () => {
  const { open, onOpen, onClose } = useDisclosure();
  const [isIOS, setIsIOS] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true;

    if (isStandalone) return;

    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    const lastDismissed = localStorage.getItem("pwa_prompt_dismissed");
    if (lastDismissed) {
      const timePassed =
        (Date.now() - parseInt(lastDismissed, 10)) / (1000 * 60 * 60);
      if (timePassed < COOLDOWN_HOURS) return;
    }

    const roll = Math.random();
    if (roll > SHOW_CHANCE) return;

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      onOpen();
    };

    if (isIosDevice) {
      onOpen();
    } else {
      window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    }

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
    };
  }, [onOpen]);

  const handleDismiss = () => {
    localStorage.setItem("pwa_prompt_dismissed", Date.now().toString());
    onClose();
  };

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setDeferredPrompt(null);
      onClose();
    }
  };

  return (
    <Drawer.Root
      open={open}
      onOpenChange={(e) => (e.open ? onOpen() : handleDismiss())}
      placement="bottom"
    >
      <Drawer.Backdrop />
      <Drawer.Positioner>
        <Drawer.Content borderTopRadius="xl">
          <Drawer.Header borderBottomWidth="1px">
            <Drawer.Title>Install App Experience</Drawer.Title>
            <Drawer.CloseTrigger asChild>
              <Button size="sm" variant="ghost">
                X
              </Button>
            </Drawer.CloseTrigger>
          </Drawer.Header>

          <Drawer.Body pt={4} pb={4}>
            <VStack gap={4} align="stretch">
              <Text>
                For the best experience, full-screen view, and offline access,
                add this app to your home screen.
              </Text>

              {isIOS ? (
                <Box
                  p={4}
                  bg="gray.50"
                  borderRadius="md"
                  border="1px dashed"
                  borderColor="gray.300"
                >
                  <Text fontSize="sm" fontWeight="bold" mb={2}>
                    To install on iOS:
                  </Text>
                  <Text
                    fontSize="sm"
                    display="flex"
                    alignItems="center"
                    gap={2}
                  >
                    1. Tap the Share button <Icon as={MdIosShare} boxSize={5} />
                  </Text>
                  <Text fontSize="sm">
                    2. Scroll down and select "Add to Home Screen"
                  </Text>
                </Box>
              ) : (
                <Button
                  colorPalette="blue"
                  size="lg"
                  width="full"
                  onClick={handleInstallClick}
                >
                  <Icon as={MdGetApp} mr={2} />
                  Add to Home Screen
                </Button>
              )}
            </VStack>
          </Drawer.Body>

          <Drawer.Footer>
            <Button variant="ghost" mr={3} onClick={handleDismiss}>
              Maybe later
            </Button>
          </Drawer.Footer>
        </Drawer.Content>
      </Drawer.Positioner>
    </Drawer.Root>
  );
};
