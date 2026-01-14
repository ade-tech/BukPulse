import type { OtherProfileInformation, Profile } from "@/lib/types";
import { supabase } from "./supabase";

export async function getProfileFromId(id: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data as Profile;
}

export async function getUserOtherProfileData(targetUserId: string) {
  const [followers, postCount, recentPosts] = await Promise.all([
    supabase
      .from("follows")
      .select("*", { count: "exact", head: true })
      .eq("followed_id", targetUserId),
    supabase
      .from("posts")
      .select("*", { count: "exact", head: true })
      .eq("poster_id", targetUserId),

    supabase
      .from("posts")
      .select("*")
      .eq("poster_id", targetUserId)
      .order("created_at", { ascending: false })
      .limit(9),
  ]);

  if (followers.error) throw followers.error;
  if (postCount.error) throw postCount.error;
  if (recentPosts.error) throw recentPosts.error;
  return {
    followersCount: followers.count || 0,
    totalPosts: postCount.count || 0,
    posts: recentPosts.data || [],
  } as OtherProfileInformation;
}
