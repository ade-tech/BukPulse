import type { ButtonProps } from "@chakra-ui/react";
import type { ReactNode } from "react";

export type Category =
  | "social"
  | "official"
  | "academic"
  | "sport"
  | "politics"
  | "religious";

export type EventStatus = "pending" | "approved" | "disapproved";
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

export interface CreateNewModeratorInputs {
  image?: FileList;
  role: string;
  description: string;
  name: string;
  email: string;
}
export interface ImagePrepResult {
  hasImage: boolean;
  image: File | null;
  imagePath: string;
  imageURL: string;
}

export interface ImagePrepOptions {
  image?: FileList | null;
  bucketName: string;
  folderPath: string;
}

export interface MiniButtonProps extends ButtonProps {}
export interface Event {
  id: string;
  created_at: string;
  creator_id: string;
  event_title: string;
  event_time: string;
  event_date: string;
  event_image_url: string;
  attendees: number;
  event_description: string;
  event_location: string;
  event_category: Category;
  event_status: EventStatus;
}
export interface CreateEventInputs {
  creator_id: string;
  event_title: string;
  event_date: string;
  event_image: FileList;
  event_time: string;
  event_description: string;
  event_category: Category[];
  event_location: string;
}

interface DrawerStore {
  open: boolean;
  setOpen: (open: boolean) => void;
}
export interface AppDrawerProps {
  trigger: ReactNode;
  drawerContent: ReactNode | ((store: DrawerStore) => ReactNode);
  drawerTitle: string;
  placement: "top" | "bottom";
}
