import { useEffect, useState } from "react";

export default function useGetImageURL(
  image: FileList | File | null | undefined
) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (!image) {
      setImagePreview(null);
      return;
    }

    const file: File | undefined =
      (image as FileList)?.[0] ?? (image as File | undefined);

    if (!file || !(file instanceof File)) {
      setImagePreview(null);
      return;
    }

    const url = URL.createObjectURL(file);
    setImagePreview(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [image]);

  return { imagePreview };
}
