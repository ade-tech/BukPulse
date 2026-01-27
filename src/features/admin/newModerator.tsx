import ImageUpload from "@/components/ui/imageUpload";
import MiniButton from "@/components/ui/miniButton";
import { toaster } from "@/components/ui/toaster";
import { useCreateNewModerator } from "@/hooks/useAdmin";
import { acceptedFormats } from "@/lib/constants";
import type { CreateNewModeratorInputs } from "@/lib/types";
import {
  Box,
  Button,
  Field,
  Heading,
  HStack,
  Input,
  Spinner,
  Stack,
  Textarea,
} from "@chakra-ui/react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { HiArrowLeft } from "react-icons/hi2";
import { useNavigate } from "react-router";

export default function NewModerator() {
  const navigate = useNavigate();
  const {
    watch,
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<CreateNewModeratorInputs>();
  const { createModerator, isCreatingModerator } = useCreateNewModerator();

  const submitFn: SubmitHandler<CreateNewModeratorInputs> = ({
    name,
    role,
    email,
    image,
    description,
  }) => {
    createModerator(
      { name, role, email, image, description },
      {
        onSuccess: () => {
          navigate(-1);
          toaster.create({
            title: "Moderator created succesfully!",
          });
        },
        onError: (error) =>
          toaster.create({
            title: error.message,
          }),
      },
    );
  };

  const image = watch("image");

  return (
    <Box
      w={"full"}
      h={"full"}
      maxW={"570px"}
      mx={"auto"}
      px={5}
      rounded={"md"}
      overflow={"hidden"}
      className="no-scrollbar"
      pos={"relative"}
    >
      <HStack justifyContent={"flex-center"} w={"full"} gap={4} mb={10}>
        <MiniButton ml={0} disabled={isCreatingModerator}>
          <HiArrowLeft />
          Back
        </MiniButton>

        <Heading alignSelf={"center"} textStyle={"2xl"} fontWeight={"bold"}>
          Create Moderator
        </Heading>
      </HStack>
      <form onSubmit={handleSubmit(submitFn)}>
        <Stack gap={4} flex={1} overflow={"hidden"} overflowY={"auto"}>
          <ImageUpload
            accepts={acceptedFormats}
            error={errors.image}
            register={register("image", {
              validate: (imageFile) => {
                if (!imageFile || !imageFile[0]) return true;
                if (!acceptedFormats.includes(imageFile[0].type))
                  return "File uploaded is in the wrong format";
                if (imageFile[0]?.size > 10 * 1024 * 1024)
                  return "Image size is too large!";
              },
            })}
            watchedImage={image}
          />
          <Field.Root mt={5} w={"11/12"} mx={"auto"} invalid={!!errors.email}>
            <Input
              {...register("email", {
                required: "You cannot proceed without entering your an email!",
                validate: (value) => {
                  const pattern =
                    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                  return pattern.test(value) || "Enter a valid Email Address";
                },
              })}
              rounded={"lg"}
              size={"xl"}
              color={"accent.primary"}
              focusRing={"none"}
              _focus={{
                outline: "none",
                border: "none",
              }}
              bg={"bg.surface"}
              placeholder={"Enter your Moderator's email"}
              _placeholder={{
                fontSize: "sm",
                color: " bg.page",
                fontWeight: "light",
              }}
              type={"text"}
            />
            {errors.email && (
              <Field.ErrorText>{errors.email.message}</Field.ErrorText>
            )}
          </Field.Root>
          <Field.Root w={"11/12"} mx={"auto"} invalid={!!errors.name}>
            <Input
              {...register("name", {
                required: "You cannot proceed without entering your name!",
                validate: (input) => {
                  return input.length > 5 || "Enter a correct name!";
                },
              })}
              rounded={"lg"}
              size={"xl"}
              color={"accent.primary"}
              focusRing={"none"}
              _focus={{
                outline: "none",
                border: "none",
              }}
              bg={"bg.surface"}
              placeholder={"Enter your Moderator's name e.g SUGBUK"}
              _placeholder={{
                fontSize: "sm",
                color: " bg.page",
                fontWeight: "light",
              }}
              type={"text"}
            />
            {errors.name && (
              <Field.ErrorText>{errors.name.message}</Field.ErrorText>
            )}
          </Field.Root>
          <Field.Root w={"11/12"} mx={"auto"} invalid={!!errors.role}>
            <Input
              {...register("role")}
              rounded={"lg"}
              size={"xl"}
              color={"accent.primary"}
              focusRing={"none"}
              _focus={{
                outline: "none",
                border: "none",
              }}
              bg={"bg.surface"}
              value={"Admin"}
              disabled
              type={"text"}
            />
          </Field.Root>

          <Field.Root w={"11/12"} mx={"auto"} invalid={!!errors.name}>
            <Textarea
              {...register("description", {
                required: "You cannot proceed without an account description",
                validate: (input) => {
                  return input.length > 10 || "Enter a correct description!";
                },
              })}
              rounded={"lg"}
              size={"xl"}
              color={"accent.primary"}
              focusRing={"none"}
              _focus={{
                outline: "none",
                border: "none",
              }}
              bg={"bg.surface"}
              placeholder={"Enter your Moderator account description"}
              resize={"none"}
              _placeholder={{
                fontSize: "sm",
                color: " bg.page",
                fontWeight: "light",
              }}
            />
            {errors.name && (
              <Field.ErrorText>{errors.name.message}</Field.ErrorText>
            )}
          </Field.Root>
          <Button
            disabled={isCreatingModerator}
            mx={"auto"}
            onClick={() => {
              handleSubmit(submitFn)();
            }}
            w={"11/12"}
            display={"flex"}
            alignItems={"center"}
            justifyContent={"center"}
            size={"lg"}
            bg={"accent.primary"}
            rounded={"lg"}
          >
            {isCreatingModerator ? (
              <Spinner size={"sm"} right={5} color={"text.primary"} />
            ) : (
              "Create Moderator"
            )}
          </Button>
        </Stack>
      </form>
    </Box>
  );
}
