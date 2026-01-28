import { EventAdminCard } from "@/components/ui/eventCard";
import EventListCard, {
  EventListCardSkeleton,
} from "@/components/ui/eventListCard";
import { EventsCardSkeleton } from "@/components/ui/eventCard";
import AppDrawer from "@/components/ui/AppDrawer";
import GeneralInput from "@/components/ui/generalInput";
import MiniButton from "@/components/ui/miniButton";
import { toaster } from "@/components/ui/toaster";
import { useCurrentUser } from "@/contexts/AuthContext";
import { useGetSuperAdminId } from "@/hooks/useAdmin";
import {
  useFetchAllUpcomingEvents,
  useFetchAllPastEvents,
  useCreateNewEvent,
} from "@/hooks/useEvent";
import useGetImageURL from "@/hooks/useGetImageURL";
import {
  useNotifyAllUsers,
  useSendPushNotification,
} from "@/hooks/usePushNotifications";
import { type CreateEventInputs } from "@/lib/types";
import {
  Box,
  Stack,
  Tabs,
  Text,
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
} from "@chakra-ui/react";
import { useRef } from "react";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { HiPlus } from "react-icons/hi2";
import { LuUpload } from "react-icons/lu";
import { PiEmptyBold } from "react-icons/pi";
import PagePreloader from "@/components/ui/pagePreloader";

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
  const {
    isLoading: isAuthLoading,
    isSuperAdmin,
    currentUser,
  } = useCurrentUser();
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const watchedImage = watch("event_image");
  const { imagePreview } = useGetImageURL(watchedImage);
  const { createEvent, isCreatingEvent } = useCreateNewEvent();
  const { sendNotification } = useSendPushNotification();
  const { notifyAllUsers } = useNotifyAllUsers();
  const adminID = useGetSuperAdminId();
  const hasImage = imagePreview !== null;

  const creatorId = !isSuperAdmin && currentUser ? currentUser.id : undefined;
  const { upcomingEventsData, isFetchingEvents } =
    useFetchAllUpcomingEvents(creatorId);
  const { pastEvents, isLoadingPastEvents } = useFetchAllPastEvents(creatorId);

  if (isAuthLoading) {
    return <PagePreloader />;
  }

  // Shared empty state component
  const EmptyState = ({ message }: { message: string }) => (
    <Box
      w="full"
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexDir="column"
      flex={1}
      minH="400px"
    >
      <PiEmptyBold size="48" className="mb-3!" />
      <Text mx="auto" fontSize="2xl" fontWeight="extrabold" lineHeight={1}>
        Nothing Here!
      </Text>
      <Text fontWeight="light" fontSize="md" mt={2}>
        {message}
      </Text>
    </Box>
  );

  // Shared past events rendering
  const renderPastEvents = () => {
    if (isLoadingPastEvents) {
      return (
        <Stack gap={3}>
          {Array.from({ length: 3 }).map((_, i) => (
            <EventListCardSkeleton key={i} />
          ))}
        </Stack>
      );
    }

    if (!pastEvents || pastEvents.length === 0) {
      return (
        <EmptyState
          message={
            isSuperAdmin
              ? "No past events found"
              : "You haven't created any past events yet"
          }
        />
      );
    }

    return (
      <Stack>
        {pastEvents.map((event) => (
          <EventListCard
            key={event.id}
            data={event}
            usedBy="admin"
            state={{ from: "adminhistory" }}
          />
        ))}
      </Stack>
    );
  };

  // Shared form component
  const EventForm = ({ store }: { store: any }) => {
    const submitFn: SubmitHandler<CreateEventInputs> = ({
      event_category,
      event_date,
      event_description,
      event_image,
      event_location,
      event_time,
      event_title,
    }) => {
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
          onSuccess: (eventData) => {
            store.setOpen(false);
            reset();
            toaster.create({ title: "Event creation is Successful!" });
            console.log(isSuperAdmin, currentUser);
            if (isSuperAdmin) {
              notifyAllUsers({
                actorId: currentUser?.id!,
                title: `New Event: ${eventData.event_title}`,
                url: `/events/${eventData.id}`,
                body: eventData.event_description,
                tag: "new-event",
              });
            } else if (adminID && adminID !== currentUser?.id) {
              sendNotification({
                userIds: [adminID],
                title: "Event Approval Request",
                body: event_title,
                tag: "event",
                url: "/",
              });
            }
          },
          onError: () => {
            toaster.create({ title: "We could not create the event" });
          },
        },
      );
    };

    return (
      <form className="mt-6! mb-6! flex flex-col gap-3">
        {/* Image Upload */}
        <Box
          aspectRatio={2.5 / 1}
          bg="bg.surface"
          rounded="lg"
          borderWidth={2}
          borderStyle="dashed"
          pos="relative"
          display="flex"
          flexDir="column"
          alignItems="center"
          justifyContent="center"
          onClick={() => imageInputRef?.current?.click()}
          overflow="hidden"
          className="group"
        >
          <Box
            pos="absolute"
            w="full"
            h="full"
            display={!hasImage ? "flex" : "none"}
            flexDir="column"
            alignItems="center"
            justifyContent="center"
            bg={hasImage ? "bg.surface/70" : "none"}
            _groupHover={{ display: "flex", bg: "bg.surface/70" }}
          >
            <Icon size="md" color="accent.primary" mb={2}>
              <LuUpload />
            </Icon>
            <Box>Click here to Add Event Image</Box>
            <Box color="text.secondary">.png, .jpg up to 5MB</Box>
          </Box>

          {imagePreview && (
            <Image
              roundedTop="lg"
              src={imagePreview}
              width="100%"
              height="100%"
              objectFit="cover"
              objectPosition="top"
            />
          )}

          {hasImage && (
            <MiniButton
              pos="absolute"
              right={2}
              top={2}
              size="2xs"
              bg="red.500"
              fontSize="2xs"
              color="white"
              fontWeight="light"
              onClick={(e) => {
                e.stopPropagation();
                setValue("event_image" as any, undefined);
                if (imageInputRef.current) imageInputRef.current.value = "";
              }}
              variant="solid"
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
                fileSize: (files: FileList) =>
                  !files?.[0] || files[0].size <= 5 * 1024 * 1024 || "Max 5MB",
                fileType: (files: FileList) =>
                  !files?.[0] ||
                  ["image/jpeg", "image/png"].includes(files[0].type) ||
                  "Only jpg/png",
              },
            }}
            render={({ field: { onChange, onBlur, name } }) => (
              <Input
                display="none"
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files && onChange(e.target.files)}
                onBlur={onBlur}
                name={name}
                ref={imageInputRef}
              />
            )}
          />
        </Box>

        {/* Title */}
        <GeneralInput<CreateEventInputs>
          name="event_title"
          register={register}
          errorText="You need to include a title"
          placeholder="Event Title"
          errors={errors}
        />

        {/* Description */}
        <Field.Root w="full" invalid={!!errors.event_description}>
          <Textarea
            {...register("event_description", {
              required: "You cannot proceed without an event description",
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
          {errors.event_description && (
            <Field.ErrorText>
              {errors.event_description.message}
            </Field.ErrorText>
          )}
        </Field.Root>

        {/* Category */}
        <Field.Root invalid={!!errors.event_category} width="full" rounded="xl">
          <Controller
            control={control}
            name="event_category"
            rules={{ required: "You have to select a category" }}
            render={({ field }) => (
              <Select.Root
                size="lg"
                name={field.name}
                value={field.value}
                onValueChange={({ value }) => field.onChange(value)}
                onInteractOutside={() => field.onBlur()}
                collection={inputCategories}
                bg="bg.surface"
                rounded="xl"
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
          <Field.ErrorText>{errors.event_category?.message}</Field.ErrorText>
        </Field.Root>

        {/* Location */}
        <GeneralInput<CreateEventInputs>
          name="event_location"
          register={register}
          errorText="An Event needs to have a location"
          placeholder="Event Location"
          errors={errors}
        />

        {/* Date & Time */}
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
            defaultValue={new Date().toTimeString().split(" ")[0].slice(0, 5)}
          />
        </HStack>

        <Button
          onClick={handleSubmit(submitFn)}
          disabled={isCreatingEvent}
          w="full"
          size="xl"
          bg="accent.primary"
          rounded="lg"
        >
          Create Event
        </Button>
      </form>
    );
  };

  // Floating Action Button
  const CreateEventButton = (
    <AppDrawer
      drawerTitle="Create New Event"
      placement="bottom"
      trigger={
        <IconButton
          rounded="full"
          size="xl"
          pos="fixed"
          bottom="28"
          right={6}
          boxShadow="2xl"
          bg="accent.primary"
        >
          <HiPlus />
        </IconButton>
      }
      drawerContent={(store) => <EventForm store={store} />}
    />
  );

  // Admin view (no tabs, just past events)
  if (!isSuperAdmin) {
    return (
      <Box
        w="full"
        h="full"
        maxW="570px"
        mx="auto"
        px={4}
        py={5}
        display="flex"
        flexDir="column"
        pos="relative"
      >
        <Box
          flex={1}
          overflow="hidden"
          overflowY="auto"
          className="no-scrollbar"
        >
          {renderPastEvents()}
        </Box>
        {CreateEventButton}
      </Box>
    );
  }

  // Super admin view (with tabs)
  return (
    <Box
      w="full"
      h="full"
      maxW="570px"
      mx="auto"
      px={4}
      py={5}
      display="flex"
      flexDir="column"
      pos="relative"
      overflow="hidden"
    >
      <Tabs.Root
        defaultValue="upcoming"
        size="md"
        flex={1}
        overflowY="auto"
        className="no-scrollbar"
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
          rounded="full"
          pos="sticky"
          top="0"
          zIndex={10}
          p={2}
          bg="bg.surface"
          backdropFilter="saturate(180%) blur(6px)"
          w="full"
        >
          <Tabs.Trigger
            color="text.primary"
            _selected={{ color: "white" }}
            value="upcoming"
          >
            Upcoming
          </Tabs.Trigger>
          <Tabs.Trigger
            color="text.primary"
            _selected={{ color: "white" }}
            value="past"
          >
            Past Events
          </Tabs.Trigger>
          <Tabs.Indicator />
        </Tabs.List>

        <Box
          flex={1}
          overflow="hidden"
          overflowY="auto"
          pt={5}
          pb={16}
          className="no-scrollbar"
        >
          {/* Upcoming Tab */}
          <Tabs.Content value="upcoming">
            {isFetchingEvents ? (
              <Stack gap={3}>
                {Array.from({ length: 3 }).map((_, i) => (
                  <EventsCardSkeleton key={i} />
                ))}
              </Stack>
            ) : !upcomingEventsData || upcomingEventsData.length === 0 ? (
              <EmptyState message="No upcoming events found" />
            ) : (
              <Stack gap={3}>
                {upcomingEventsData.map((event) => (
                  <EventAdminCard key={event.id} data={event} />
                ))}
              </Stack>
            )}
          </Tabs.Content>

          {/* Past Tab */}
          <Tabs.Content value="past">{renderPastEvents()}</Tabs.Content>
        </Box>
      </Tabs.Root>
      {CreateEventButton}
    </Box>
  );
}
