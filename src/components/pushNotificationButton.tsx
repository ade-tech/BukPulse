import { Button, Text, Box, Stack } from "@chakra-ui/react";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import { HiBell, HiBellSlash } from "react-icons/hi2";

export const PushNotificationButton = () => {
  const { isSupported, isSubscribed, loading, error, subscribe, unsubscribe } =
    usePushNotifications();

  if (!isSupported) {
    return (
      <Box p={4} bg="red.50" borderRadius="md">
        <Text fontSize="sm" color="red.600">
          ❌ Push notifications are not supported in this browser
        </Text>
      </Box>
    );
  }

  const handleTestNotification = async () => {
    if ("serviceWorker" in navigator && "Notification" in window) {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        const registration = await navigator.serviceWorker.ready;
        registration.showNotification("Test Notification", {
          body: "This is a test notification from BukPulse!",
          icon: "/192bukp.png",
          badge: "/192bukp.png",
          tag: "test",
        });
      }
    }
  };

  return (
    <Stack gap={3} p={4} bg="bg.surface" borderRadius="lg">
      <Text fontWeight="bold" fontSize="lg">
        Push Notifications
      </Text>

      <Text fontSize="sm" color="fg.muted">
        {isSubscribed
          ? "✅ You are subscribed to push notifications"
          : "🔔 Enable push notifications to stay updated"}
      </Text>

      <Stack direction="row" gap={2}>
        <Button
          onClick={isSubscribed ? unsubscribe : subscribe}
          loading={loading} // Changed from isLoading
          colorScheme={isSubscribed ? "red" : "blue"}
          size="md"
        >
          {isSubscribed ? <HiBellSlash /> : <HiBell />}
          {isSubscribed ? "Disable Notifications" : "Enable Notifications"}
        </Button>

        {isSubscribed && (
          <Button onClick={handleTestNotification} variant="outline" size="md">
            Test Notification
          </Button>
        )}
      </Stack>

      {error && (
        <Text fontSize="sm" color="red.500" mt={2}>
          ⚠️ {error}
        </Text>
      )}
    </Stack>
  );
};
