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
