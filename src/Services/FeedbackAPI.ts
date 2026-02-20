import type { FeedbackInput } from "@/components/ui/Feedback";
import { supabase } from "./supabase";

export const SendFeedback = async ({
  title,
  category,
  description,
  creator_id,
}: FeedbackInput) => {
  const { data, error } = await supabase.from("feedback").insert([
    {
      title,
      category,
      description,
      creator_id,
    },
  ]);

  if (error) {
    console.error(error);
    throw error;
  }

  return data;
};
