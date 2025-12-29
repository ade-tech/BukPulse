import type { otpVerificationParams } from "@/lib/types";
import { checkAdminAddressValidity, verifyAdminOTP } from "@/Services/AuthAPI";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCheckAdminAddressValidity = () => {
  const {
    mutate: checkValidity,
    isPending: isCheckingValidity,
    error,
  } = useMutation({
    mutationFn: (email: string) => checkAdminAddressValidity(email),
  });

  return { checkValidity, isCheckingValidity, error };
};
export const useverifyAdminOTP = () => {
  const queryClient = useQueryClient();
  const { mutate: verifyOTP, isPending: isVerifyingOTP } = useMutation({
    mutationFn: ({ email, token }: otpVerificationParams) =>
      verifyAdminOTP({ email, token }),
    onSuccess: () => queryClient.invalidateQueries(),
  });

  return { verifyOTP, isVerifyingOTP };
};
