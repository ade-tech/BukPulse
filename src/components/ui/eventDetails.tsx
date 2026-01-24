import {
  Box,
  HStack,
  Image,
  Heading,
  Skeleton,
  Stack,
  SkeletonText,
  Text,
  ButtonGroup,
  Button,
  Spinner,
  Field,
  Textarea,
  Tag,
} from "@chakra-ui/react";
import { HiArrowLeft } from "react-icons/hi2";
import MiniButton from "./miniButton";
import { useNavigate, useParams } from "react-router";
import {
  useApproveEvent,
  useFetchEvent,
  userejectEventApproval,
} from "@/hooks/useEvent";
import {
  useFetchEventAttendees,
  useAttendEvent,
  useUnattendEvent,
  useIsAttending,
} from "@/hooks/useEvent";
import { IoCalendarClear } from "react-icons/io5";
import { IoIosTime } from "react-icons/io";
import { format, isValid, parse } from "date-fns";
import { FaLocationDot } from "react-icons/fa6";
import { toaster } from "./toaster";
import AppDrawer from "./AppDrawer";
import { useForm, type SubmitHandler } from "react-hook-form";
import { Capitalize } from "@/lib/Captialize";
import { useCurrentUser } from "@/contexts/AuthContext";
import { playSound, sounds } from "@/lib/Sounds";
import {
  useNotifyAllUsers,
  useSendPushNotification,
} from "@/hooks/usePushNotifications";
interface EventRejectionFormInput {
  rejection_reason: string;
}

export default function EventDetails() {
  const { id } = useParams();
  const { isSuperAdmin, currentUser } = useCurrentUser();
  const navigate = useNavigate();
  const { eventData, isFetchingEvent } = useFetchEvent(id!);
  const { notifyAllUsers } = useNotifyAllUsers();
  const { attendeesCount, isLoadingAttendees } = useFetchEventAttendees(id!);
  const { isAttending, isChecking } = useIsAttending(id!);
  const { attend, isPending: isAttendingMutate } = useAttendEvent();
  const { unattend, isPending: isUnattendingMutate } = useUnattendEvent();
  const { sendNotification } = useSendPushNotification();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EventRejectionFormInput>();
  const { mutate: approveEvent, isPending } = useApproveEvent();
  const { mutate: rejectEvent, isPending: isRejecting } =
    userejectEventApproval();
  const formattedEventDate = (() => {
    const raw = eventData?.event_date;
    if (!raw) return "";
    const d = new Date(raw as any);
    return isValid(d) ? format(d, "do MMMM, yyyy.") : "";
  })();
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
          Event Detail
        </Heading>
      </HStack>
      {isFetchingEvent && (
        <Stack w={"full"} flex={1} alignItems={"center"}>
          <EventsCardSkeleton />
        </Stack>
      )}
      {!isFetchingEvent && (
        <Box w={"full"} flex={1} overflow={"hidden"} overflowY={"auto"} pt={5}>
          <Box
            aspectRatio={2.5 / 1}
            w={"full"}
            bg={"bg.muted"}
            rounded={"lg"}
            overflow="hidden"
          >
            <Image
              roundedTop={"lg"}
              src={eventData?.event_image_url}
              width="100%"
              height="100%"
              objectPosition={"top"}
              objectFit="cover"
            />
          </Box>
          <Heading
            textStyle={"2xl"}
            lineHeight={1}
            mt={5}
            mb={3}
            fontWeight={"bold"}
          >
            {eventData?.event_title}
          </Heading>
          <Text color={"text.secondary"}>{eventData?.event_description}</Text>
          <Tag.Root size="lg" colorPalette={"blue"} w={"fit-content"} mt={3}>
            <Tag.Label>
              {Capitalize(eventData?.event_category || "All")}
            </Tag.Label>
          </Tag.Root>
          <Stack fontSize={"lg"} fontWeight={"normal"} mt={4}>
            <HStack gap={3}>
              <HStack>
                <Box
                  as={IoCalendarClear}
                  color={"accent.primary"}
                  boxSize={5}
                />{" "}
                <Text>{formattedEventDate || "Date not set"}</Text>
              </HStack>
              <HStack>
                <Box as={IoIosTime} color={"accent.primary"} boxSize={5} />{" "}
                {eventData?.event_time && (
                  <Text>
                    {format(
                      parse(eventData.event_time, "HH:mm:ss", new Date()),
                      "h:mm a",
                    )}
                  </Text>
                )}
              </HStack>
            </HStack>
            <HStack>
              <Box as={FaLocationDot} color={"accent.primary"} boxSize={5} />{" "}
              <Text>{eventData?.event_location}</Text>
            </HStack>
          </Stack>
          <ButtonGroup w={"11/12"} mt={5}>
            {isSuperAdmin ? (
              <>
                {eventData?.event_status === "pending" && (
                  <Button
                    rounded={"full"}
                    w={"1/2"}
                    disabled={isPending}
                    bg={"accent.primary"}
                    onClick={() => {
                      approveEvent(eventData?.id!, {
                        onSuccess: () => {
                          notifyAllUsers({
                            actorId: currentUser?.id!,
                            title: `New Event: ${eventData.event_title}`,
                            url: `/events/${eventData.id}`,
                            body: `${eventData.event_description}`,
                            tag: "new-event",
                          });
                          playSound(sounds.success);
                          toaster.create({
                            title: "Event Approved!",
                          });
                          navigate(-1);
                        },
                      });
                    }}
                  >
                    Approve
                  </Button>
                )}
                <AppDrawer
                  placement="bottom"
                  trigger={
                    <Button
                      rounded={"full"}
                      w={"1/2"}
                      color={"white"}
                      bg={"red.600"}
                      variant={"solid"}
                    >
                      Unapprove
                    </Button>
                  }
                  drawerTitle="Reject Event Approval"
                  drawerContent={(store) => {
                    const submitFn: SubmitHandler<EventRejectionFormInput> = ({
                      rejection_reason,
                    }) => {
                      rejectEvent(
                        {
                          event_id: eventData?.id!,
                          reason: rejection_reason,
                        },
                        {
                          onSuccess: (data) => {
                            sendNotification({
                              userIds: [data.creator_id],
                              title: "Event Approval Rejected",
                              body: `Event was rejected because ${data.rejection_reason}`,
                              url: `/events/${data.id}`,
                              tag: "event-rejection",
                            });
                            toaster.create({
                              title: "Approval Rejection Successful!",
                            });
                            playSound(sounds.success);
                            store.setOpen(false);
                            navigate(-1);
                          },
                        },
                      );
                    };
                    return (
                      <form className="mt-6! mb-6! flex flex-col gap-3">
                        <Field.Root
                          w={"full"}
                          invalid={!!errors.rejection_reason}
                        >
                          <Textarea
                            {...register("rejection_reason", {
                              required: "You reject an event without a reason",
                              validate: (input) => {
                                return (
                                  input.length > 10 || "Enter a valid reason!"
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
                            placeholder={"Enter Rejection Reason"}
                            resize={"none"}
                            _placeholder={{
                              fontSize: "sm",
                              color: "text.secondary",
                              fontWeight: "light",
                            }}
                          />
                          {errors.rejection_reason && (
                            <Field.ErrorText>
                              {errors.rejection_reason.message}
                            </Field.ErrorText>
                          )}
                        </Field.Root>
                        <Button
                          onClick={handleSubmit(submitFn)}
                          disabled={isRejecting}
                          w={"full"}
                          size={"xl"}
                          bg={"red.600"}
                          rounded={"lg"}
                        >
                          Reject Approval Request
                        </Button>
                      </form>
                    );
                  }}
                />{" "}
              </>
            ) : (
              <HStack w={"full"} justifyContent={"space-between"}>
                <Button
                  w={"3/5"}
                  size={"xl"}
                  bg={isAttending ? "red.600" : "accent.primary"}
                  rounded={"lg"}
                  disabled={
                    isChecking ||
                    isLoadingAttendees ||
                    isAttendingMutate ||
                    isUnattendingMutate
                  }
                  onClick={() => {
                    if (isAttending) {
                      unattend(eventData?.id!);
                      playSound(sounds.error);
                      toaster.create({
                        title: "You have unattended the event",
                      });
                    } else {
                      attend(eventData?.id!);
                      playSound(sounds.success);
                      toaster.create({ title: "You are now attending" });
                    }
                  }}
                >
                  {(isAttendingMutate || isUnattendingMutate) && (
                    <Spinner size="sm" mr={3} />
                  )}
                  {isAttending ? "Unattend" : "Attend Event"}
                </Button>
                <Text color={"text.secondary"}>
                  {isLoadingAttendees
                    ? "..."
                    : `${attendeesCount ?? 0} attending`}
                </Text>
              </HStack>
            )}
          </ButtonGroup>
        </Box>
      )}
    </Box>
  );
}
export function EventsCardSkeleton() {
  return (
    <Box
      w={"full"}
      gap={3}
      justifyContent={"flex-start"}
      px={4}
      py={4}
      rounded={"md"}
    >
      <Skeleton height="48" w={"full"} mb={2} rounded={"md"} />
      <Stack w={"full"}>
        <HStack w={"full"}>
          <HStack display={"flex"} w={"full"}>
            <Skeleton height="6" width="full" rounded={"md"} />
          </HStack>
        </HStack>
        <SkeletonText noOfLines={3} rounded={"md"} />
      </Stack>
    </Box>
  );
}
