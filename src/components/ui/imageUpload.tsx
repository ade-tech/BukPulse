import { Box, Field, IconButton, Image, Input } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import {
  type FieldError,
  type FieldValues,
  type Path,
  type UseFormRegisterReturn,
} from "react-hook-form";
import { FaCirclePlus } from "react-icons/fa6";
interface ImageUploadProps<TFormValues extends FieldValues> {
  register: UseFormRegisterReturn<Path<TFormValues>>;
  error?: FieldError;
  watchedImage: FileList | undefined;
  accepts: string[];
}

export default function ImageUpload<TFormValues extends FieldValues>({
  register,
  watchedImage,
  error,
  accepts,
}: ImageUploadProps<TFormValues>) {
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const imageRef = useRef<HTMLInputElement | null>(null);

  const { ref, ...rest } = register;

  useEffect(() => {
    if (!watchedImage || !watchedImage[0]) return;
    const file = watchedImage[0];
    const reader = new FileReader();

    reader.onload = () => {
      if (reader.result !== null) {
        setProfilePreview(reader.result as string);
      }
    };

    reader.readAsDataURL(file);
  }, [watchedImage]);
  return (
    <Box
      aspectRatio={1 / 1}
      w={"1/2"}
      pos={"relative"}
      rounded={"full"}
      maxW={"500px"}
      mx={"auto"}
    >
      <Image
        src={profilePreview || "/default_image.png"}
        width={"full"}
        height={"full"}
        rounded={"full"}
        pos={"absolute"}
        objectFit={"cover"}
        objectPosition={"center"}
      />
      <IconButton
        pos={"absolute"}
        bg={"bg.muted"}
        rounded={"full"}
        p={3}
        size={"2xl"}
        bottom={0}
        right={0}
        onClick={() => imageRef.current?.click()}
      >
        <Box as={FaCirclePlus} color={"accent.primary"} boxSize={10} />
      </IconButton>
      <Field.Root invalid={!!error}>
        <Input
          {...rest}
          type="file"
          display={"none"}
          ref={(e) => {
            ref(e);
            imageRef.current = e;
          }}
          accept={accepts.join(",")}
        />
        <Field.ErrorText>{error?.message}</Field.ErrorText>
      </Field.Root>
    </Box>
  );
}
