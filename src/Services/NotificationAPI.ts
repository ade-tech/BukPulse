import type { SendNotificationParams } from "@/lib/types";
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

  // Validate recipients to avoid accidental broadcast when IDs are undefined
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
    }
  );

  if (error) {
    throw new Error("Notification Failed");
  }

  return data;
};
