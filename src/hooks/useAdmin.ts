import { createModeratorAccount } from "@/Services/AdminAPI";
import { useMutation } from "@tanstack/react-query";

export function useCreateNewModerator() {
  const { mutate: createModerator, isPending: isCreatingModerator } =
    useMutation({
      mutationFn: createModeratorAccount,
    });
  return { createModerator, isCreatingModerator };
}
