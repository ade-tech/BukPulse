import type { FeedbackInput } from "@/components/ui/Feedback";
import { supabase } from "./supabase";
import type { Feedback } from "@/lib/types";

export const SendFeedback = async ({
  title,
  category,
  description,
  creator_id,
}: FeedbackInput) => {
  const { data, error } = await supabase
    .from("feedback")
    .insert([
      {
        title,
        category,
        description,
        creator_id,
      },
    ])
    .select();

  if (error) {
    console.error(error);
    throw error;
  }

  return data;
};

export const fetchAllFeedback = async () => {
  const { data, error } = await supabase
    .from("feedback")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as Feedback[];
};

export const fetchFeedbackById = async (feedbackId: string) => {
  const { data, error } = await supabase
    .from("feedback")
    .select("*")
    .eq("id", feedbackId)
    .single();

  if (error) throw error;
  return data as Feedback;
};
