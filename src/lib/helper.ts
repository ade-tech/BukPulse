import { supabaseUrl } from "@/Services/supabase";
import type { ImagePrepOptions, ImagePrepResult } from "./types";

export function prepareImageUpload({
  image,
  bucketName,
  folderPath,
}: ImagePrepOptions): ImagePrepResult {
  const hasImage = !!image && image.length > 0;

  if (!hasImage) {
    return {
      hasImage: false,
      image: null,
      imagePath: "",
      imageURL: "",
    };
  }

  const file = image[0];
  const imagePath = `${folderPath}/${crypto.randomUUID()}-${file.name}`;
  const imageURL = `${supabaseUrl}/storage/v1/object/public/${bucketName}/${imagePath}`;

  return {
    hasImage,
    image: file,
    imagePath,
    imageURL,
  };
}
