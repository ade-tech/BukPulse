import AccountsToFollow from "@/components/ui/accountsToFollow";
import ImageUpload from "@/components/ui/imageUpload";
import { toaster } from "@/components/ui/toaster";
import { useCurrentUser } from "@/contexts/AuthContext";
import { useUpdateUserProfile } from "@/hooks/useAuth";
import { acceptedFormats } from "@/lib/constants";
import type { UserOnbaordingInputs } from "@/lib/types";
import {
  Box,
  Button,
  Field,
  Heading,
  Input,
  Spacer,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { HiArrowLeft } from "react-icons/hi2";

export default function UserOnbaording() {
  const [step, setStep] = useState<number>(0);
  const { currentUser } = useCurrentUser();
  const {
    register,
    formState: { errors },
    handleSubmit,
    trigger,
    watch,
  } = useForm<UserOnbaordingInputs>();
  const image = watch("image");

  const { updateUserProfile, isUpdatingUserProfile } = useUpdateUserProfile();

  const SubmitHandler: SubmitHandler<UserOnbaordingInputs> = ({
    image,
    name,
  }) => {
    updateUserProfile(
      { name, image, id: currentUser?.id! },
      {
        onSuccess: () => setStep((curStep) => (curStep += 1)),
        onError: (error) => {
          console.error(error);
          toaster.create({ title: "Error Occured" });
        },
      }
    );
  };
  return (
    <Stack
      bg={"bg.page"}
      w={"full"}
      h={"full"}
      display={"flex"}
      alignItems={"start"}
      overflow={"hidden"}
      pos={"relative"}
    >
      <form className="flex-1 w-full">
        {step === 0 && (
          <Box
            w={"full"}
            h={"full"}
            mt={10}
            display={"flex"}
            flexDir={"column"}
            textAlign={"center"}
          >
            <Heading
              textStyle={"2xl"}
              lineHeight={2}
              fontWeight={"bold"}
              textAlign={"center"}
              color={"accent.primary"}
            >
              Pick a profile picture
            </Heading>
            <Text
              fontSize={"sm"}
              lineHeight={1.3}
              color={"text.primary"}
              textAlign={"center"}
              fontWeight={"light"}
              mb={16}
            >
              Have a clear selfie of yourself? Upload it now!
            </Text>
            <Box flex={1}>
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
            </Box>

            <Stack w={"11/12"} mx={"auto"} mb={14}>
              <Button
                disabled={isUpdatingUserProfile}
                onClick={async () => {
                  const isValid = await trigger("image");
                  if (!isValid) return;
                  setStep((curStep) => (curStep += 1));
                }}
                w={"full"}
                size={"lg"}
                bg={"accent.primary"}
                rounded={"lg"}
              >
                Next
              </Button>
              <Button
                disabled={isUpdatingUserProfile}
                onClick={() => setStep((curStep) => (curStep += 1))}
                w={"full"}
                color={"accent.primary"}
                size={"lg"}
                rounded={"lg"}
                _hover={{ bg: "none" }}
                variant={"ghost"}
              >
                Skip for now
              </Button>
            </Stack>
          </Box>
        )}
        {step === 1 && (
          <Box
            w={"full"}
            h={"full"}
            display={"flex"}
            alignItems={"center"}
            flexDir={"column"}
            pt={36}
          >
            <Button
              disabled={isUpdatingUserProfile}
              onClick={() => {
                setStep((curStep) =>
                  curStep !== 0 ? (curStep -= 1) : curStep
                );
              }}
              variant={"outline"}
              top={2}
              left={5}
              pos={"absolute"}
              size={"2xs"}
              rounded={"full"}
            >
              <HiArrowLeft />
              Back
            </Button>
            <Heading
              textStyle={"2xl"}
              lineHeight={2}
              fontWeight={"bold"}
              textAlign={"center"}
              color={"accent.primary"}
            >
              Let’s get your name
            </Heading>
            <Text
              fontSize={"sm"}
              lineHeight={1.3}
              color={"text.primary"}
              textAlign={"center"}
              fontWeight={"light"}
              mb={16}
            >
              Enter your full legal name as it appears <br />
              on official records.
            </Text>
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
                placeholder={"Enter your Full Name"}
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
            <Spacer />
            <Button
              disabled={isUpdatingUserProfile}
              mb={8}
              onClick={async () => {
                const isValid = await trigger("name");
                if (!isValid) return;
                handleSubmit(SubmitHandler)();
              }}
              w={"11/12"}
              size={"lg"}
              bg={"accent.primary"}
              rounded={"lg"}
            >
              Next
            </Button>
          </Box>
        )}
      </form>

      {step === 2 && (
        <AccountsToFollow user_id={currentUser?.id!} setStep={setStep} />
      )}
    </Stack>
  );
}
