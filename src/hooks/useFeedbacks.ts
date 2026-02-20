import { SendFeedback } from "@/Services/FeedbackAPI";
import { useMutation } from "@tanstack/react-query";

export function useSendFeedback() {
  const { mutate: send, isPending: isSending } = useMutation({
    mutationFn: SendFeedback,
  });

  return { send, isSending };
}
