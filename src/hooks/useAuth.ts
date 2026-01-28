import type {
  otpVerificationParams,
  studentSignInParams,
  UserOnbaordingInputs,
} from "@/lib/types";
import {
  checkAdminAddressValidity,
  logout,
  sendOTP,
  studentSignUp,
  updateNewUser,
  updateUserProfile as updateUserProfileAPI,
  verifyAdminOTP,
} from "@/Services/AuthAPI";
import { fecthAllModerators } from "@/Services/FollowAPI";
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

/**
 * Fetches the list of all moderators.
 *
 * @returns An object with `data` (the fetched moderators array or `undefined` if not loaded) and `isLoading` (`true` while the request is in progress, `false` otherwise)
 */
export function useFetchModerators() {
  const { data, isLoading } = useQuery({
    queryKey: ["All Moderators"],
    queryFn: () => fecthAllModerators(),
  });
  return { data, isLoading };
}

/**
 * Creates a mutation hook for updating a new user's data.
 *
 * @returns An object containing:
 * - `updateUser` — the mutation function to trigger the update.
 * - `isUpdatingUser` — `true` if the update is in progress, `false` otherwise.
 */
export function useUpdateNewUser() {
  const { mutate: updateUser, isPending: isUpdatingUser } = useMutation({
    mutationFn: updateNewUser,
  });

  return { updateUser, isUpdatingUser };
}

/**
 * Create a React Query mutation hook for sending a one-time password (OTP).
 *
 * @returns An object containing:
 * - `send` — Mutation function that triggers sending the OTP.
 * - `isSending` — `true` while the send mutation is pending, `false` otherwise.
 */
export function useSendOTP() {
  const { mutate: send, isPending: isSending } = useMutation({
    mutationFn: sendOTP,
  });

  return { send, isSending };
}