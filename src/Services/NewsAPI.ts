import type {
  CreateNewsInput,
  Post,
  FetchNewsParams,
  FetchNewsResponse,
} from "@/lib/types";
import { supabase } from "./supabase";
import { prepareImageUpload } from "@/lib/helper";

export async function fetchLatestTenNews() {
  const { data, error } = await supabase
    .from("posts")
    .select("*, profiles(name , description)")
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
  const { error } = await supabase.from("posts").insert([
    {
      post_caption,
      poster_id,
      post_image_url: hasImage ? imageURL : null,
    },
  ]);
  if (error) throw error;
};
export const fetchPosts = async ({
  limit = 10,
  lastPostDate,
}: FetchNewsParams): Promise<FetchNewsResponse> => {
  let query = supabase
    .from("posts")
    .select("*, profiles(name , description)")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (lastPostDate) {
    query = query.lt("created_at", lastPostDate);
  }
  const { data, error } = await query;
  if (error) throw error;
  const hasMore = data.length === limit;
  return { posts: data as Post[], hasMore };
};

export const fetchNewPosts = async (sinceDate: string): Promise<Post[]> => {
  const { data, error } = await supabase
    .from("posts")
    .select("*, profiles(name , description)")
    .gt("created_at", sinceDate)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data || [];
};
