import type {
  otpVerificationParams,
  Profile,
  studentSignInParams,
  UserConfirmationRespnse,
  UserOnbaordingInputs,
} from "@/lib/types";
import { supabase } from "./supabase";
import type { User } from "@supabase/supabase-js";
import { prepareImageUpload } from "@/lib/helper";

export const checkAdminAddressValidity = async (
  email: string
): Promise<UserConfirmationRespnse> => {
  const { data, error } = await supabase.functions.invoke("user-confirmation", {
    body: { email },
  });
  if (error) throw new Error("Unauthorized Email");
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
  // Remove any push subscriptions for this user so logged-out devices stop receiving pushes
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      await supabase.from("push_subscriptions").delete().eq("user_id", user.id);
    }
  } catch (e) {
    // ignore errors here; proceed to sign out
  }

  let { error } = await supabase.auth.signOut();
  if (error) throw new Error("We could not log you out");
};

export const studentSignUp = async ({
  email,
  regNumber,
}: studentSignInParams) => {
  const hasAccount = await checkUserExistence(regNumber);
  if (hasAccount) {
    const user = await studentSignIn({ regNumber, email });
    return { user, profile: null };
  }
  const { data, error } = await supabase.auth.signUp({
    email,
    password: regNumber.toLowerCase(),
    options: {
      data: {
        role: "student",
        reg_number: regNumber.toLowerCase(),
        is_new: true,
      },
    },
  });

  if (error) throw new Error("We could not sign you up!");
  const { data: profileData, error: createProfileError } = await supabase
    .from("profiles")
    .insert([
      {
        role: "student",
        email,
        id: data.user?.id,
        reg_number: regNumber.toUpperCase(),
      },
    ])
    .select("*")
    .single();

  if (createProfileError) throw new Error("We could not create your profile!");

  return { user: data.user as User, profile: profileData as Profile };
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

export async function updateUserProfile({
  image,
  id,
  name,
}: UserOnbaordingInputs) {
  const {
    hasImage,
    image: imageTobeUploaded,
    imagePath,
    imageURL,
  } = prepareImageUpload({
    image,
    bucketName: "profile_images",
    folderPath: "users",
  });
  if (hasImage) {
    const { error: imageUploadError } = await supabase.storage
      .from("profile_images")
      .upload(imagePath, imageTobeUploaded);

    if (imageUploadError) throw new Error("We could not upload the image");
  }
  const { error } = await supabase
    .from("profiles")
    .update(hasImage ? { name, image_url: imageURL } : { name })
    .eq("id", id);

  if (error) throw new Error("We could not update your profile");
}

export async function updateNewUser() {
  const { error: profileUpdate } = await supabase.auth.updateUser({
    data: { is_new: false },
  });
  if (profileUpdate) throw new Error("An Error Occured 101");
}
