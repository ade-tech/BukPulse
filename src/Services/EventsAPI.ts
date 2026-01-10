import type { CreateEventInputs } from "@/lib/types";
import { supabase } from "./supabase";
import { prepareImageUpload } from "@/lib/helper";

export const createNewEvent = async ({
  creator_id,
  event_category,
  event_date,
  event_description,
  event_image,
  event_location,
  event_time,
  event_title,
}: CreateEventInputs) => {
  const { image, imagePath, imageURL } = prepareImageUpload({
    image: event_image,
    bucketName: "events_images",
    folderPath: "events",
  });

  const { error: imageUploadError } = await supabase.storage
    .from("profile_images")
    .upload(imagePath, image);

  if (imageUploadError) throw new Error("We could not upload the image");
  const { error } = await supabase.from("events").insert([
    {
      creator_id,
      event_date,
      event_category: event_category.join(""),
      event_description,
      event_location,
      event_time,
      event_title,
      event_image_url: imageURL,
    },
  ]);
  if (error) throw error;
};
