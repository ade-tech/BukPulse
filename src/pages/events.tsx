import AppDrawer from "@/components/ui/AppDrawer";
import { EventAdminCard } from "@/components/ui/eventCard";
import EventListCard, {
  AdminEventListCard,
  EventListCardSkeleton,
} from "@/components/ui/eventListCard";
import Filter from "@/components/ui/filter";
import GeneralInput from "@/components/ui/generalInput";
import MiniButton from "@/components/ui/miniButton";
import { toaster } from "@/components/ui/toaster";
import { useCurrentUser } from "@/contexts/AuthContext";
import { useGetSuperAdminId } from "@/hooks/useAdmin";
import { useCreateNewEvent, useFetchAllUpcomingEvents } from "@/hooks/useEvent";
import useGetImageURL from "@/hooks/useGetImageURL";
import { useSendPushNotification } from "@/hooks/usePushNotifications";
import { CATEGORIES, type Category, type CreateEventInputs } from "@/lib/types";
import {
  Box,
  Tabs,
  Heading,
  IconButton,
  Field,
  Select,
  createListCollection,
  Portal,
  HStack,
  Button,
  Textarea,
  Icon,
  Input,
  Image,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { HiPlus } from "react-icons/hi2";
import { LuUpload } from "react-icons/lu";
import { PiEmptyBold } from "react-icons/pi";

const inputCategories = createListCollection({
  items: [
    { label: "Social", value: "social" },
    { label: "Official", value: "official" },
    { label: "Academic", value: "academic" },
    { label: "Sport", value: "sport" },
    { label: "Politics", value: "politics" },
    { label: "Religious", value: "religious" },
  ],
});

export default function Events() {
  const {
    register,
    control,
    watch,
    reset,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateEventInputs>();
  const { currentUser, isAdmin, isSuperAdmin } = useCurrentUser();
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const watchedImage = watch("event_image");
  const { imagePreview } = useGetImageURL(watchedImage);
  const { createEvent, isCreatingEvent } = useCreateNewEvent();
  const { sendNotification } = useSendPushNotification();
  const adminID = useGetSuperAdminId();
  const [curState, setCurState] = useState<Category | "all">("all");
  const hasImage = imagePreview !== null;
  const { upcomingEventsData, isFetchingEvents } = useFetchAllUpcomingEvents();
  const filteredEvents =
    curState === "all"
      ? upcomingEventsData
      : upcomingEventsData?.filter((cur) => cur.event_category === curState);

  if (!isAdmin)
    return (
      <Stack
        w={"full"}
        h={"full"}
        pt={2}
        px={4}
        rounded={"md"}
        overflow={"hidden"}
        overflowY={"auto"}
        className="no-scrollbar"
        pos={"relative"}
      >
        <Heading textStyle={"2xl"} ml={2} lineHeight={2} fontWeight={"bold"}>
          Events
        </Heading>
        <Filter
          filterValues={["all", ...CATEGORIES]}
          filterState={curState}
          filterUpdate={setCurState}
        />

        <Box w={"full"} flex={1} overflow={"hidden"} overflowY={"auto"}>
          {isFetchingEvents &&
            Array.from({ length: 5 }).map((_, i) => (
              <EventListCardSkeleton key={i} />
            ))}

          {filteredEvents?.length === 0 ? (
            <Box
              w={"full"}
              h={"4/5"}
              display={"flex"}
              alignItems={"center"}
              justifyContent={"center"}
              flexDir={"column"}
            >
              <PiEmptyBold size={"48"} className="mb-3!" />
              <Text
                mx={"auto"}
                fontSize={"3xl"}
                display={"flex"}
                gap={1}
                alignItems={"center"}
                fontWeight={"extrabold"}
                lineHeight={1}
              >
                Nothing Here!
              </Text>
              <Text
                display={"inline-block"}
                fontWeight={"light"}
                fontSize={"md"}
              >
                {curState === "all"
                  ? "No upcoming Events now, Check back later"
                  : "No Upcoming Events for this category"}
              </Text>
            </Box>
          ) : (
            filteredEvents?.map((cur) => (
              <EventListCard usedBy="user" data={cur} key={cur.id} />
            ))
          )}
        </Box>
      </Stack>
    );

  return (
    <Box
      w={"full"}
      h={"full"}
      pt={2}
      px={4}
      rounded={"md"}
      overflow={"hidden"}
      overflowY={"auto"}
      className="no-scrollbar"
      pos={"relative"}
    >
      <Heading textStyle={"2xl"} ml={2} lineHeight={2} fontWeight={"bold"}>
        Events
      </Heading>
      <EventTabs />
      <AppDrawer
        drawerTitle="Create New Event"
        placement="bottom"
        trigger={
          <IconButton
            rounded={"full"}
            size={"xl"}
            pos={"fixed"}
            bottom={"28"}
            right={6}
            boxShadow={"2xl"}
            bg={"accent.primary"}
          >
            <HiPlus />
          </IconButton>
        }
        drawerContent={(store) => {
          const submitFn: SubmitHandler<CreateEventInputs> = ({
            event_category,
            event_date,
            event_description,
            event_image,
            event_location,
            event_time,
            event_title,
          }) => {
            if (!isAdmin) {
              toaster.create({
                title: "Only Moderators can create Events",
              });
              return;
            }
            createEvent(
              {
                creator_id: currentUser?.id!,
                event_category,
                event_date,
                event_description,
                event_image,
                event_location,
                event_time,
                event_title,
                isSuperAdmin,
              },
              {
                onSuccess: () => {
                  store.setOpen(false);
                  reset();
                  toaster.create({
                    title: "Event creation is Successful!",
                  });
                  // Only send if we have a valid super admin id and it's not the sender
                  if (adminID && adminID !== currentUser?.id) {
                    sendNotification({
                      userIds: [adminID],
                      title: "Event Approval Request",
                      body: `${event_title}`,
                      tag: "event",
                      url: "/",
                    });
                  }
                },
                onError: () => {
                  toaster.create({
                    title: "We could not create the event",
                  });
                },
              }
            );
          };
          return (
            <form className="mt-6! mb-6! flex flex-col gap-3">
              <Box
                aspectRatio={2.5 / 1}
                bg={"bg.surface"}
                rounded={"lg"}
                borderWidth={2}
                borderStyle={"dashed"}
                pos={"relative"}
                display={"flex"}
                flexDir={"column"}
                alignItems={"center"}
                justifyContent={"center"}
                onClick={() => imageInputRef?.current?.click()}
                overflow={"hidden"}
                className="group"
              >
                <Box
                  pos={"absolute"}
                  w={"full"}
                  h={"full"}
                  display={!hasImage ? "flex" : "none"}
                  flexDir={"column"}
                  alignItems={"center"}
                  justifyContent={"center"}
                  bg={hasImage ? "bg.surface/70" : "none"}
                  _groupHover={{
                    display: "flex",
                    bg: "bg.surface/70",
                  }}
                >
                  <Icon size="md" color="accent.primary" mb={2}>
                    <LuUpload />
                  </Icon>
                  <Box>Click here to Add Event Image</Box>
                  <Box color="text.secondary">.png, .jpg up to 5MB</Box>
                </Box>

                {imagePreview !== null && (
                  <Image
                    roundedTop={"lg"}
                    src={imagePreview}
                    width="100%"
                    height="100%"
                    objectFit="cover"
                    objectPosition={"top"}
                  />
                )}
                {hasImage && (
                  <MiniButton
                    pos={"absolute"}
                    right={2}
                    top={2}
                    size={"2xs"}
                    bg={"red.500"}
                    fontSize={"2xs"}
                    color={"white"}
                    fontWeight={"light"}
                    onClick={(e) => {
                      e.stopPropagation();
                      setValue("event_image" as any, undefined);
                      if (imageInputRef.current)
                        imageInputRef.current.value = "";
                    }}
                    variant={"solid"}
                    zIndex={10}
                  >
                    Clear
                  </MiniButton>
                )}

                <Controller
                  control={control}
                  name="event_image"
                  rules={{
                    required: "Please upload an image",
                    validate: {
                      fileSize: (files: FileList) => {
                        if (!files?.[0]) return true;
                        return files[0].size <= 5 * 1024 * 1024 || "Max 5MB";
                      },
                      fileType: (files: FileList) => {
                        if (!files?.[0]) return true;
                        return (
                          ["image/jpeg", "image/png"].includes(files[0].type) ||
                          "Only jpg/png"
                        );
                      },
                    },
                  }}
                  render={({ field: { onChange, onBlur, name } }) => (
                    <Input
                      display={"none"}
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files) {
                          onChange(e.target.files);
                        }
                      }}
                      onBlur={onBlur}
                      name={name}
                      ref={imageInputRef}
                    />
                  )}
                />
              </Box>
              <GeneralInput<CreateEventInputs>
                name="event_title"
                register={register}
                errorText="You need to include a title"
                placeholder="Event Title"
                errors={errors}
              />
              <Field.Root w={"full"} invalid={!!errors.event_description}>
                <Textarea
                  {...register("event_description", {
                    required: "You cannot proceed without an event description",
                    validate: (input) => {
                      return (
                        input.length > 10 || "Enter a correct description!"
                      );
                    },
                  })}
                  rounded={"lg"}
                  size={"xl"}
                  color={"text.primary"}
                  fontSize={"sm"}
                  focusRing={"none"}
                  _focus={{
                    outline: "none",
                    border: "none",
                  }}
                  bg={"bg.surface"}
                  placeholder={"Enter Description"}
                  resize={"none"}
                  _placeholder={{
                    fontSize: "sm",
                    color: "text.secondary",
                    fontWeight: "light",
                  }}
                />
                {errors.event_description && (
                  <Field.ErrorText>
                    {errors.event_description.message}
                  </Field.ErrorText>
                )}
              </Field.Root>

              <Field.Root
                invalid={!!errors.event_category}
                width="full"
                rounded={"xl"}
              >
                <Controller
                  control={control}
                  name="event_category"
                  rules={{
                    required: "You have to select a category",
                  }}
                  render={({ field }) => (
                    <Select.Root
                      size={"lg"}
                      name={field.name}
                      value={field.value}
                      onValueChange={({ value }) => field.onChange(value)}
                      onInteractOutside={() => field.onBlur()}
                      collection={inputCategories}
                      bg={"bg.surface"}
                      rounded={"xl"}
                    >
                      <Select.HiddenSelect />
                      <Select.Control>
                        <Select.Trigger>
                          <Select.ValueText
                            placeholder="Select Event Category"
                            fontSize={"sm"}
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
                <Field.ErrorText>
                  {errors.event_category?.message}
                </Field.ErrorText>
              </Field.Root>
              <GeneralInput<CreateEventInputs>
                name="event_location"
                register={register}
                errorText="An Event needs to have a location"
                placeholder="Event Location"
                errors={errors}
              />
              <HStack>
                <GeneralInput<CreateEventInputs>
                  name="event_date"
                  register={register}
                  errorText="You need to include an event date"
                  placeholder="Select Event Date"
                  errors={errors}
                  type="date"
                  defaultValue={new Date().toISOString().split("T")[0]}
                />
                <GeneralInput<CreateEventInputs>
                  name="event_time"
                  register={register}
                  errorText="You need to include an event time"
                  placeholder="Select Time"
                  errors={errors}
                  type="time"
                  defaultValue={new Date()
                    .toTimeString()
                    .split(" ")[0]
                    .slice(0, 5)}
                />
              </HStack>
              <Button
                onClick={handleSubmit(submitFn)}
                disabled={isCreatingEvent}
                w={"full"}
                size={"xl"}
                bg={"accent.primary"}
                rounded={"lg"}
              >
                Create Event
              </Button>
            </form>
          );
        }}
      />
    </Box>
  );
}
const EventTabs = () => {
  return (
    <Tabs.Root
      defaultValue="upcoming"
      size={"md"}
      fitted
      lazyMount
      variant="plain"
      css={{
        "--tabs-indicator-bg": "colors.accent.primary",
        "--tabs-indicator-shadow": "shadows.xs",
        "--tabs-trigger-radius": "radii.full",
      }}
    >
      <Tabs.List
        rounded={"full"}
        p={2}
        bg={"bg.surface"}
        backdropFilter="saturate(180%) blur(6px)"
        w={"full"}
      >
        <Tabs.Trigger
          color={"text.primary"}
          _selected={{ color: "white" }}
          value="upcoming"
        >
          Upcoming{" "}
        </Tabs.Trigger>
        <Tabs.Trigger
          color={"text.primary"}
          _selected={{ color: "white" }}
          value="projects"
        >
          Past Events
        </Tabs.Trigger>
        <Tabs.Indicator />
      </Tabs.List>
      <Tabs.Content value="upcoming">
        <EventAdminCard />
        <AdminEventListCard />
      </Tabs.Content>

      <Tabs.Content value="projects">Manage your projects</Tabs.Content>
    </Tabs.Root>
  );
};
