import type { CreateNewModeratorInputs } from "@/lib/types";
import { supabase } from "./supabase";
import { prepareImageUpload } from "@/lib/helper";

export const createModeratorAccount = async ({
  role,
  email,
  name,
  description,
  image,
}: CreateNewModeratorInputs) => {
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
  const { error } = await supabase.functions.invoke("create-moderator", {
    body: hasImage
      ? {
          email,
          role: role.toLowerCase(),
          name,
          description,
          image_url: imageURL,
        }
      : { email, role: role.toLowerCase(), name, description },
  });

  if (error) throw error;
};

export const getSuperAdminId = async (): Promise<string> => {
  const { data, error } = await supabase
    .from("profiles")
    .select("id")
    .eq("role", "super_admin")
    .single();

  if (error) {
    throw new Error("We could not get it!");
  }
  return data.id;
};
