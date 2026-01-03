import type { FollowEventParams, Profile } from "@/lib/types";
import { supabase } from "./supabase";

export async function FollowModerator({
  followed_id,
  follower_id,
}: FollowEventParams) {
  const { error } = await supabase
    .from("follows")
    .insert([{ followed_id, follower_id }]);

  if (error) throw new Error("We could not make that happen");
}

export async function fecthAllModerators() {
  const { data: moderatorProfiles, error } = await supabase
    .from("follows")
    .select("*")
    .contains("role", ["super_admin", "admin"]);

  if (error) throw new Error("We could not fetch users");
  return moderatorProfiles as Profile[];
}
