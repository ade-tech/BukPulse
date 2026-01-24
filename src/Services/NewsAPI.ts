import type {
  CreateNewsInput,
  Post,
  FetchNewsParams,
  FetchNewsResponse,
  AddCommentParams,
  Comment,
  Event,
} from "@/lib/types";
import { supabase } from "./supabase";
import { prepareImageUpload } from "@/lib/helper";

export async function fetchLatestTenNews() {
  const { data, error } = await supabase
    .from("posts")
    .select("*, profiles(name ,image_url, description)")
    .order("created_at", { ascending: false })
    .limit(10);

  if (error) throw error;
  return data as Post[];
}

export const CreateNews = async ({
  post_caption,
  poster_id,
  post_image,
}: CreateNewsInput) => {
  const { image, imagePath, hasImage, imageURL } = prepareImageUpload({
    image: post_image,
    bucketName: "posts_images",
    folderPath: "posts",
  });

  if (hasImage) {
    const { error: imageUploadError } = await supabase.storage
      .from("posts_images")
      .upload(imagePath, image);

    if (imageUploadError) throw new Error("We could not upload the image");
  }
  const { data, error } = await supabase
    .from("posts")
    .insert([
      {
        post_caption,
        poster_id,
        post_image_url: hasImage ? imageURL : null,
      },
    ])
    .select()
    .single();
  if (error) throw error;
  return data as Event;
};

export const fetchPosts = async ({
  limit = 10,
  lastPostDate,
  userId,
  followedOnly = false,
}: FetchNewsParams): Promise<FetchNewsResponse> => {
  let query = supabase
    .from("posts")
    .select("*, profiles(name ,image_url,  description)")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (lastPostDate) {
    query = query.lt("created_at", lastPostDate);
  }

  if (followedOnly && userId) {
    const { data: followedUsers } = await supabase
      .from("follows")
      .select("followed_id")
      .eq("follower_id", userId);

    if (followedUsers && followedUsers.length > 0) {
      const followedIds = followedUsers.map((f) => f.followed_id);
      query = query.in("poster_id", followedIds);
    } else {
      return { posts: [], hasMore: false };
    }
  }

  const { data, error } = await query;
  if (error) throw error;
  const hasMore = data.length === limit;
  return { posts: data as Post[], hasMore };
};

export const fetchNewPosts = async (
  sinceDate: string,
  userId?: string | null,
  followedOnly: boolean = false,
): Promise<Post[]> => {
  let query = supabase
    .from("posts")
    .select("*, profiles(name ,image_url, description)")
    .gt("created_at", sinceDate)
    .order("created_at", { ascending: false });

  if (followedOnly && userId) {
    const { data: followedUsers } = await supabase
      .from("follows")
      .select("followed_id")
      .eq("follower_id", userId);

    if (followedUsers && followedUsers.length > 0) {
      const followedIds = followedUsers.map((f) => f.followed_id);
      query = query.in("poster_id", followedIds);
    } else {
      return [];
    }
  }

  const { data, error } = await query;

  if (error) throw error;

  return data || [];
};

export const fetchNewsDetail = async (id: string) => {
  const { data: post, error } = await supabase
    .from("posts")
    .select("*, profiles(name,image_url, description)")
    .eq("id", id)
    .single();
  if (error) throw error;
  return post as Post;
};

export const addComment = async ({
  comment,
  commenter_id,
  post_id,
}: AddCommentParams) => {
  const { error } = await supabase.from("comments").insert([
    {
      comment,
      commenter_id,
      post_id,
    },
  ]);
  if (error) throw error;
};

export const fetchCommentForPost = async (postId: string) => {
  const { data, error } = await supabase
    .from("comments")
    .select(
      `
      *,
      profiles:commenter_id (
        name,
        image_url,
        reg_number,
        description,
        role
      )
    `,
    )
    .eq("post_id", postId)
    .order("created_at", { ascending: true });

  if (error) throw error;

  return data as Comment[];
};

export interface LikeParams {
  postId: string;
  userId: string;
}

export const likePost = async ({ postId, userId }: LikeParams) => {
  const { data, error } = await supabase
    .from("likes")
    .insert({
      post_id: postId,
      liker_id: userId,
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const unlikePost = async ({ postId, userId }: LikeParams) => {
  const { data, error } = await supabase
    .from("likes")
    .delete()
    .eq("post_id", postId)
    .eq("liker_id", userId)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const checkIfUserLikedPost = async ({ postId, userId }: LikeParams) => {
  const { data, error } = await supabase
    .from("likes")
    .select("id")
    .eq("post_id", postId)
    .eq("liker_id", userId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return !!data;
};
