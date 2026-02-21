import {
  fetchAllFeedback,
  fetchFeedbackById,
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
