import type { otpVerificationParams, studentSignInParams } from "@/lib/types";
import {
  checkAdminAddressValidity,
  logout,
  studentSignUp,
  verifyAdminOTP,
} from "@/Services/AuthAPI";
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

export const useLogout = () => {
  const queryClient = useQueryClient();
  const { mutate: logoutUser, isPending: isLoggingOut } = useMutation({
    mutationFn: () => logout(),
    onSuccess: () => queryClient.invalidateQueries(),
  });

  return { logoutUser, isLoggingOut };
};
export function useUserSignUp() {
  const { mutate: signUp, isPending: isSigningUp } = useMutation({
    mutationFn: ({ regNumber, email }: studentSignInParams) =>
      studentSignUp({ regNumber, email }),
  });
  return { signUp, isSigningUp };
}
