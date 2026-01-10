import { createNewEvent } from "@/Services/EventsAPI";
import { useMutation } from "@tanstack/react-query";

export function useCreateNewEvent() {
  const { mutate: createEvent, isPending: isCreatingEvent } = useMutation({
    mutationFn: createNewEvent,
  });

  return { createEvent, isCreatingEvent };
}
