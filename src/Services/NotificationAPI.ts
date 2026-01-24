import type { NotificationParams, SendNotificationParams } from "@/lib/types";
import { supabase } from "./supabase";

export const sendPushNotification = async ({
  userIds,
  title,
  body,
  url,
  tag,
}: SendNotificationParams) => {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    throw new Error("Not authenticated");
  }

  if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
    throw new Error("No recipients provided for notification");
  }
  if (userIds.some((id) => typeof id !== "string" || id.trim() === "")) {
    throw new Error("Invalid recipient id in userIds");
  }

  const { data, error } = await supabase.functions.invoke(
    "send-push-notifications",
    {
      body: {
        userIds,
        title,
        body,
        url,
        tag,
      },
    },
  );

  if (error) {
    throw new Error("Notification Failed");
  }

  return data;
};

export const subscribeToPushNotifications = async () => {
  const { data: userData, error: authError } = await supabase.auth.getUser();
  if (authError || !userData.user) throw new Error("Could not verify user");

  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: import.meta.env.VITE_VAPID_PUBLIC_KEY,
  });

  const subData = subscription.toJSON();

  const { error: dbError } = await supabase.from("push_subscriptions").insert([
    {
      user_id: userData.user.id,
      endpoint: subData.endpoint,
      auth_key: subData.keys?.auth,
      p256dh_key: subData.keys?.p256dh,
      device_name: `${navigator.userAgent.substring(0, 50)}`,
      is_active: true,
    },
  ]);

  if (dbError) throw new Error("Could not save subscription");
  return subscription;
};

export const unsubscribeFromPushNotifications = async () => {
  const { data: userData, error: authError } = await supabase.auth.getUser();
  if (authError || !userData.user) throw new Error("Could not verify user");

  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.getSubscription();

  if (subscription) {
    await subscription.unsubscribe();

    const subData = subscription.toJSON();
    const { error: dbError } = await supabase
      .from("push_subscriptions")
      .update({ is_active: false })
      .eq("user_id", userData.user.id)
      .eq("endpoint", subData.endpoint!);

    if (dbError) throw new Error("Could not update subscription");
  }

  return true;
};

export const checkPushSubscriptionStatus = async () => {
  const { data: userData, error: authError } = await supabase.auth.getUser();
  if (authError || !userData.user) return false;

  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.getSubscription();

  if (!subscription) return false;

  const subData = subscription.toJSON();
  const { data, error } = await supabase
    .from("push_subscriptions")
    .select("id")
    .eq("user_id", userData.user.id)
    .eq("endpoint", subData.endpoint)
    .eq("is_active", true)
    .maybeSingle();

  if (error) throw error;
  return !!data;
};

export const notifyFollowers = async ({
  actorId,
  title,
  url,
  body,
  tag,
}: NotificationParams) => {
  try {
    const { data, error } = await supabase.functions.invoke(
      "notify-followers",
      {
        body: {
          actorId,
          title,
          body,
          url,
          tag,
        },
      },
    );

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Failed to notify followers:", error);
    throw error;
  }
};
