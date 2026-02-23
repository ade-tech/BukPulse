import {
  Box,
  Heading,
  Text,
  HStack,
  Field,
  Textarea,
  Select,
  createListCollection,
  Portal,
  Button,
} from "@chakra-ui/react";
import MiniButton from "./miniButton";
import { HiArrowLeft } from "react-icons/hi2";
import { useForm, Controller, type SubmitHandler } from "react-hook-form";
import GeneralInput from "./generalInput";
import { useSendFeedback } from "@/hooks/useFeedbacks";
import { toaster } from "./toaster";
import { useCurrentUser } from "@/contexts/AuthContext";
import { useNavigate } from "react-router";
import { useNotifySuperAdmin } from "@/hooks/usePushNotifications";

export interface FeedbackInput {
  category: string;
  title: string;
  description: string;
  creator_id: string;
}
interface FeedbackFormInput {
  category: string;
  title: string;
  description: string;
  creator_id: string;
}
const inputCategories = createListCollection({
  items: [
    { label: "News", value: "news" },
    { label: "Events", value: "events" },
    { label: "Accounts", value: "accounts" },
  ],
});

export default function Feedback() {
  const { send, isSending } = useSendFeedback();
  const { notifyAdmin } = useNotifySuperAdmin();
  const navigate = useNavigate();
  const { currentUser } = useCurrentUser();
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FeedbackFormInput>();

  const SubmitFn: SubmitHandler<FeedbackFormInput> = ({
    title,
    category,
    description,
  }) => {
    if (!currentUser?.id) {
      toaster.error({
        title: "You must be logged in to submit feedback.",
      });
      return;
    }
    if (!category) {
      toaster.error({
        title: "Please select a category.",
      });
      return;
    }
    send(
      {
        title,
        category,
        description,
        creator_id: currentUser?.id!,
      },
      {
        onSuccess: () => {
          toaster.success({
            title: "Feedback submitted!",
          });
          reset();
          navigate(-1);
          notifyAdmin({
            actorId: currentUser?.id!,
            title: "We have a new feedback",
            tag: "bukpulse-feedback",
            url: "/admin/feedback",
            body: "Open the app to check the feedback from users",
          });
        },
        onError: (error) => {
          toaster.error({
            title: error.message,
          });
        },
      },
    );
  };

  return (
    <Box
      w={"full"}
      h={"full"}
      maxW={"570px"}
      mx={"auto"}
      pt={2}
      rounded={"md"}
      overflow={"hidden"}
      display={"flex"}
      flexDir={"column"}
      className="no-scrollbar"
      px={5}
    >
      <HStack w={"full"}>
        <MiniButton ml={0} bg={"bg.surface"}>
          <HiArrowLeft />
          Back
        </MiniButton>

        <Heading textStyle={"2xl"} lineHeight={2} fontWeight={"bold"}>
          Send Feedback
        </Heading>
      </HStack>
      <Text fontSize={"sm"} mt={4} color={"text.secondary"}>
        Fill the form below to give us insight on what you think about BukPulse
        so that we can improve on them.
      </Text>
      <HStack flex={1} pt={8}>
        <form
          className="w-full h-full gap-4 flex flex-col"
          onSubmit={handleSubmit(SubmitFn)}
        >
          <GeneralInput<FeedbackFormInput>
            type={"text"}
            placeholder="Feedback title"
            register={register}
            name="title"
            errors={errors}
          />
          <Field.Root w="full" invalid={!!errors.description}>
            <Textarea
              {...register("description", {
                required: "You cannot proceed without a description",
                validate: (input) =>
                  input.length > 10 || "Enter a correct description!",
              })}
              rounded="lg"
              size="xl"
              color="text.primary"
              fontSize="sm"
              focusRing="none"
              _focus={{ outline: "none", border: "none" }}
              bg="bg.surface"
              placeholder="Enter Description"
              resize="none"
              _placeholder={{
                fontSize: "sm",
                color: "text.secondary",
                fontWeight: "light",
              }}
            />
            {errors.description && (
              <Field.ErrorText>{errors.description.message}</Field.ErrorText>
            )}
          </Field.Root>
          <Field.Root invalid={!!errors.category} width="full" rounded={"xl"}>
            <Controller
              control={control}
              name="category"
              rules={{ required: "You have to select a category" }}
              render={({ field }) => (
                <Select.Root
                  size="lg"
                  name={field.name}
                  value={field.value ? [field.value] : []}
                  onValueChange={({ value }) =>
                    field.onChange(value?.[0] || "")
                  }
                  onInteractOutside={() => field.onBlur()}
                  collection={inputCategories}
                  bg="bg.surface"
                  rounded={"lg"}
                  focusRing="none"
                  _focus={{ outline: "none", border: "none" }}
                  outline={"none"}
                  border={"none"}
                >
                  <Select.HiddenSelect />
                  <Select.Control>
                    <Select.Trigger>
                      <Select.ValueText
                        placeholder="Select Event Category"
                        fontSize="sm"
                      />
                    </Select.Trigger>
                    <Select.IndicatorGroup>
                      <Select.Indicator />
                    </Select.IndicatorGroup>
                  </Select.Control>
                  <Portal>
                    <Select.Positioner>
                      <Select.Content zIndex={2000}>
                        {inputCategories.items.map((category) => (
                          <Select.Item item={category} key={category.value}>
                            {category.label}
                            <Select.ItemIndicator />
                          </Select.Item>
                        ))}
                      </Select.Content>
                    </Select.Positioner>
                  </Portal>
                </Select.Root>
              )}
            />
            <Field.ErrorText>{errors.category?.message}</Field.ErrorText>
          </Field.Root>
          <Button
            size={"xl"}
            rounded={"md"}
            color={"bg.page"}
            bg={"accent.primary"}
            disabled={isSending}
            type="submit"
          >
            Submit Review
          </Button>
        </form>
      </HStack>
    </Box>
  );
}
