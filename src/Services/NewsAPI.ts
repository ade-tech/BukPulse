import type { CreateNewsInput, Post } from "@/lib/types";
import { supabase } from "./supabase";
import { prepareImageUpload } from "@/lib/helper";

export async function fetchLatestTenNews() {
  const { data, error } = await supabase
    .from("posts")
    .select("*, profiles(name , description)")
    .order("created_at", { ascending: false }) // Newest time at the top
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

  const { error: imageUploadError } = await supabase.storage
    .from("posts_images")
    .upload(imagePath, image);

  if (imageUploadError) throw new Error("We could not upload the image");
  const { error } = await supabase.from("posts").insert([
    {
      post_caption,
      poster_id,
      post_image_url: hasImage ? imageURL : null,
    },
  ]);
  if (error) throw error;
};
