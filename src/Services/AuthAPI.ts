import type {
  otpVerificationParams,
  UserConfirmationRespnse,
} from "@/lib/types";
import { supabase } from "./supabase";

export const checkAdminAddressValidity = async (
  email: string
): Promise<UserConfirmationRespnse> => {
  const { data, error } = await supabase.functions.invoke("user-confirmation", {
    body: { email },
  });
  if (error) throw new Error("Unauthorized Email");
  console.log(data);
  if ((data as UserConfirmationRespnse).allowed) {
    const { error: otpError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: false,
      },
    });

    if (otpError) throw new Error("OTP could not be sent");
  }

  return data;
};
export const verifyAdminOTP = async ({
  email,
  token,
}: otpVerificationParams) => {
  const { error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: "email",
  });

  if (error) throw new Error("Invalid OTP");
};
