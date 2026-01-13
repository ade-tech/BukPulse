import { useState, useEffect } from "react";
import { supabase } from "@/Services/supabase";
import { useMutation } from "@tanstack/react-query";
import { sendPushNotification } from "@/Services/NotificationAPI";

const urlBase64ToUint8Array = (base64String: string) => {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

export const usePushNotifications = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(
    null
  );
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if push notifications are supported
    const supported =
      "serviceWorker" in navigator &&
      "PushManager" in window &&
      "Notification" in window;

    setIsSupported(supported);

    if (supported) {
      checkSubscription();
    }
  }, []);

  const checkSubscription = async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      const existingSubscription =
        await registration.pushManager.getSubscription();

      setSubscription(existingSubscription);
      setIsSubscribed(!!existingSubscription);
    } catch (err) {}
  };

  const requestPermission = async () => {
    const permission = await Notification.requestPermission();
    return permission === "granted";
  };

  const subscribe = async () => {
    if (!isSupported) {
      setError("Push notifications are not supported");
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      // Request notification permission
      const hasPermission = await requestPermission();
      if (!hasPermission) {
        setError("Notification permission denied");
        setLoading(false);
        return false;
      }

      // Get service worker registration
      const registration = await navigator.serviceWorker.ready;

      // Subscribe to push notifications
      const vapidPublicKey = import.meta.env.VITE_VAPID_PUBLIC_KEY;

      if (!vapidPublicKey) {
        throw new Error("VAPID public key not found");
      }

      const convertedKey = urlBase64ToUint8Array(vapidPublicKey);

      const newSubscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: convertedKey,
      });

      // Save subscription to Supabase
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("User not authenticated");
      }

      const subscriptionJSON = newSubscription.toJSON();

      const { error: dbError } = await supabase
        .from("push_subscriptions")
        .upsert(
          {
            user_id: user.id,
            endpoint: subscriptionJSON.endpoint!,
            p256dh: subscriptionJSON.keys!.p256dh,
            auth: subscriptionJSON.keys!.auth,
          },
          {
            onConflict: "user_id,endpoint",
          }
        );

      if (dbError) throw dbError;

      setSubscription(newSubscription);
      setIsSubscribed(true);
      setLoading(false);

      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to subscribe");
      setLoading(false);
      return false;
    }
  };

  const unsubscribe = async () => {
    if (!subscription) return false;

    setLoading(true);
    setError(null);

    try {
      await subscription.unsubscribe();

      // Remove from database
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from("push_subscriptions")
          .delete()
          .eq("user_id", user.id)
          .eq("endpoint", subscription.endpoint);
      }

      setSubscription(null);
      setIsSubscribed(false);
      setLoading(false);

      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to unsubscribe");
      setLoading(false);
      return false;
    }
  };

  return {
    isSupported,
    isSubscribed,
    subscription,
    loading,
    error,
    subscribe,
    unsubscribe,
  };
};

export const useSendPushNotification = () => {
  const { mutate: sendNotification, isPending: isSendingNotification } =
    useMutation({
      mutationFn: sendPushNotification,
    });

  return { sendNotification, isSendingNotification };
};
