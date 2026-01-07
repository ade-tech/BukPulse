import type React from "react";

export interface UserConfirmationRespnse {
  allowed: boolean;
}
export interface otpVerificationParams {
  email: string;
  token: string;
}
export interface studentSignInParams {
  email: string;
  regNumber: string;
}
export interface Profile {
  id: string;
  created_at: string;
  role: string;
  reg_number: string;
  email: string;
  name: string;
  description: string;
  image_url: string;
}
export interface UserOnbaordingInputs {
  image?: FileList;
  name: string;
  id: string;
}

export interface FollowEventParams {
  follower_id: string;
  followed_id: string;
}

export interface LikeEventParams {
  liker_id: string;
  post_id: string;
}

export interface ConsoleItemProps {
  title: string;
  icon: React.ReactElement;
  to: string;
  isLast?: boolean;
}
