import type {
  otpVerificationParams,
  studentSignInParams,
  UserConfirmationRespnse,
} from "@/lib/types";
import { supabase } from "./supabase";
import type { User } from "@supabase/supabase-js";

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

export const logout = async () => {
  let { error } = await supabase.auth.signOut();
  if (error) throw new Error("We could not log you out");
};

export const studentSignUp = async ({
  email,
  regNumber,
}: studentSignInParams) => {
  const hasAccount = await checkUserExistence(regNumber);
  if (hasAccount) {
    return studentSignIn({ regNumber, email });
  }
  const { data, error } = await supabase.auth.signUp({
    email,
    password: regNumber.toLowerCase(),
    options: {
      data: {
        role: "student",
        reg_number: regNumber.toLowerCase(),
      },
    },
  });

  if (error) throw new Error("We could not sign you up!");
  const { error: createProfileError } = await supabase.from("profiles").insert([
    {
      role: "student",
      email,
      id: data.user?.id,
      reg_number: regNumber.toUpperCase(),
    },
  ]);

  if (createProfileError) throw new Error("We could not create your profile!");
};
export async function studentSignIn({
  regNumber,
  email,
}: studentSignInParams): Promise<User | null> {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password: regNumber.toLowerCase(),
  });

  if (error) throw new Error("Wrong Registration number / Email");
  return data.user;
}

export async function checkUserExistence(regNumber: string): Promise<boolean> {
  if (!regNumber) return false;
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("reg_number", regNumber.toUpperCase())
    .maybeSingle();
  if (error) return false;

  return !!data;
}
