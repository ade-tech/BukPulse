import type {
  otpVerificationParams,
  studentSignInParams,
  UserOnbaordingInputs,
} from "@/lib/types";
import {
  checkAdminAddressValidity,
  logout,
  studentSignUp,
  updateNewUser,
  updateUserProfile as updateUserProfileAPI,
  verifyAdminOTP,
} from "@/Services/AuthAPI";
import { fecthAllModerators } from "@/Services/EventsAPI";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

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

export function useUpdateUserProfile() {
  const { mutate: updateUserProfile, isPending: isUpdatingUserProfile } =
    useMutation({
      mutationFn: ({ image, id, name }: UserOnbaordingInputs) =>
        updateUserProfileAPI({ image, name, id }),
    });
  return { updateUserProfile, isUpdatingUserProfile };
}

export function useFetchModerators() {
  const { data, isLoading } = useQuery({
    queryKey: ["All Moderators"],
    queryFn: () => fecthAllModerators(),
  });
  return { data, isLoading };
}

export function useUpdateNewUser() {
  const { mutate: updateUser, isPending: isUpdatingUser } = useMutation({
    mutationFn: updateNewUser,
  });

  return { updateUser, isUpdatingUser };
}
