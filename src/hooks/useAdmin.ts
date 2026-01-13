import { createModeratorAccount, getSuperAdminId } from "@/Services/AdminAPI";
import { useMutation, useQuery } from "@tanstack/react-query";

export function useCreateNewModerator() {
  const { mutate: createModerator, isPending: isCreatingModerator } =
    useMutation({
      mutationFn: createModeratorAccount,
    });
  return { createModerator, isCreatingModerator };
}
export const useGetSuperAdminId = () => {
  const { data } = useQuery({
    queryKey: ["Super Admin ID"],
    queryFn: getSuperAdminId,
  });
  return data;
};
