import {
  fetchAllFeedback,
  fetchFeedbackById,
  markAsRead,
  SendFeedback,
} from "@/Services/FeedbackAPI";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useSendFeedback() {
  const queryClient = useQueryClient();
  const { mutate: send, isPending: isSending } = useMutation({
    mutationFn: SendFeedback,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["Feedbacks"],
      });
    },
  });

  return { send, isSending };
}

export function useFecthFeedbacks() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["Feedbacks"],
    queryFn: fetchAllFeedback,
  });
  return { data, isLoading, isError, error };
}

export function useFetchFeedback(feedbackId?: string) {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["Feedback", feedbackId],
    queryFn: () => fetchFeedbackById(feedbackId!),
    enabled: !!feedbackId,
  });

  return { data, isLoading, isError, error };
}

export function useMarkAsRead() {
  const queryClient = useQueryClient();
  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["Feedbacks"],
      });
      queryClient.invalidateQueries({
        queryKey: ["Feedback"],
      });
    },
  });

  return { mutate, isPending, isError, error };
}
