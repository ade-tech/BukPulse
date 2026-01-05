import type { FollowEventParams, Profile } from "@/lib/types";
import { supabase } from "./supabase";

export async function FollowModerator({
  followed_id,
  follower_id,
}: FollowEventParams) {
  const { data, error: eventError } = await supabase
    .from("follows")
    .select("*")
    .eq("followed_id", followed_id)
    .eq("follower_id", follower_id)
    .maybeSingle();

  if (eventError) throw new Error("We could not get the followed state");

  if (!data) {
    const { error } = await supabase
      .from("follows")
      .insert([{ followed_id, follower_id }]);

    if (error) throw new Error("We could not make that happen");
  } else {
    const { error } = await supabase
      .from("follows")
      .delete()
      .eq("follower_id", follower_id)
      .eq("followed_id", followed_id);

    if (error) throw new Error("We could not make that happen");
  }
}

export async function fecthAllModerators() {
  const { data: moderatorProfiles, error } = await supabase
    .from("profiles")
    .select("*")
    .in("role", ["super_admin", "admin"]);

  if (error) throw new Error("We could not fetch users");
  return moderatorProfiles as Profile[];
}

export async function checkFollowStatus({
  followed_id,
  follower_id,
}: FollowEventParams) {
  const { data, error: eventError } = await supabase
    .from("follows")
    .select("*")
    .eq("followed_id", followed_id)
    .eq("follower_id", follower_id)
    .maybeSingle();
  if (eventError) throw new Error("We could not get the followed state");
  return !!data;
}

export async function hasFollowedSomone(follower_id: string) {
  const { count, error } = await supabase
    .from("follows")
    .select("*", { count: "exact", head: true })
    .eq("follower_id", follower_id);

  if (error) throw error;
  return (count ?? 0) > 0;
}
