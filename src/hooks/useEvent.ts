import {
  approveEvent,
  createNewEvent,
  fetchAllUpcomingEvents,
  fetchEvent,
  attendEvent,
  unattendEvent,
  fetchEventAttendees,
  isUserAttending,
  getPendingEvents,
  rejectEventApproval,
  fetchPastAttendedEvents,
} from "@/Services/EventsAPI";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useCreateNewEvent() {
  const { mutate: createEvent, isPending: isCreatingEvent } = useMutation({
    mutationFn: createNewEvent,
  });

  return { createEvent, isCreatingEvent };
}

export function useGetPendingEvents() {
  const { data: pendingEvents, isLoading: isGettingPendingEvents } = useQuery({
    queryKey: ["Pendng Events"],
    queryFn: getPendingEvents,
  });

  return { pendingEvents, isGettingPendingEvents };
}

export function useFetchEvent(id: string) {
  const { data: eventData, isLoading: isFetchingEvent } = useQuery({
    queryKey: ["Event", id],
    queryFn: ({ queryKey }) => fetchEvent(queryKey[1]),
    enabled: !!id,
  });

  return { eventData, isFetchingEvent };
}
export function useFetchAllUpcomingEvents() {
  const { data: upcomingEventsData, isLoading: isFetchingEvents } = useQuery({
    queryKey: ["Upcoming Events"],
    queryFn: fetchAllUpcomingEvents,
  });

  return { upcomingEventsData, isFetchingEvents };
}

export function useFetchEventAttendees(id: string) {
  const { data: attendeesCount, isLoading: isLoadingAttendees } = useQuery({
    queryKey: ["EventAttendees", id],
    queryFn: () => fetchEventAttendees(id),
    enabled: !!id,
  });

  return { attendeesCount, isLoadingAttendees };
}

export function useIsAttending(id: string) {
  const { data: isAttending, isLoading: isChecking } = useQuery({
    queryKey: ["IsAttending", id],
    queryFn: () => isUserAttending(id),
    enabled: !!id,
  });

  return { isAttending, isChecking };
}

export function useAttendEvent() {
  const queryClient = useQueryClient();
  const { mutate: attend, isPending } = useMutation({
    mutationFn: (event_id: string) => attendEvent(event_id),
    onMutate: async (event_id: string) => {
      await queryClient.cancelQueries({
        queryKey: ["EventAttendees", event_id],
      });
      await queryClient.cancelQueries({ queryKey: ["IsAttending", event_id] });

      const previousCount = queryClient.getQueryData<number>([
        "EventAttendees",
        event_id,
      ]);
      const previousIsAttending = queryClient.getQueryData<boolean>([
        "IsAttending",
        event_id,
      ]);

      queryClient.setQueryData(
        ["EventAttendees", event_id],
        (old: number | undefined) => (old ?? 0) + 1
      );
      queryClient.setQueryData(["IsAttending", event_id], true);

      return { previousCount, previousIsAttending };
    },
    onError: (_err, event_id, context: any) => {
      queryClient.setQueryData(
        ["EventAttendees", event_id],
        context?.previousCount
      );
      queryClient.setQueryData(
        ["IsAttending", event_id],
        context?.previousIsAttending
      );
    },
    onSettled: (_data, _err, event_id) => {
      queryClient.invalidateQueries({ queryKey: ["Event", event_id] });
      queryClient.invalidateQueries({ queryKey: ["EventAttendees", event_id] });
      queryClient.invalidateQueries({ queryKey: ["IsAttending", event_id] });
    },
  });

  return { attend, isPending };
}

export function useUnattendEvent() {
  const queryClient = useQueryClient();
  const { mutate: unattend, isPending } = useMutation({
    mutationFn: (event_id: string) => unattendEvent(event_id),
    onMutate: async (event_id: string) => {
      await queryClient.cancelQueries({
        queryKey: ["EventAttendees", event_id],
      });
      await queryClient.cancelQueries({ queryKey: ["IsAttending", event_id] });

      const previousCount = queryClient.getQueryData<number>([
        "EventAttendees",
        event_id,
      ]);
      const previousIsAttending = queryClient.getQueryData<boolean>([
        "IsAttending",
        event_id,
      ]);

      queryClient.setQueryData(
        ["EventAttendees", event_id],
        (old: number | undefined) => Math.max((old ?? 1) - 1, 0)
      );
      queryClient.setQueryData(["IsAttending", event_id], false);

      return { previousCount, previousIsAttending };
    },
    onError: (_err, event_id, context: any) => {
      queryClient.setQueryData(
        ["EventAttendees", event_id],
        context?.previousCount
      );
      queryClient.setQueryData(
        ["IsAttending", event_id],
        context?.previousIsAttending
      );
    },
    onSettled: (_data, _err, event_id) => {
      queryClient.invalidateQueries({ queryKey: ["Event", event_id] });
      queryClient.invalidateQueries({ queryKey: ["EventAttendees", event_id] });
      queryClient.invalidateQueries({ queryKey: ["IsAttending", event_id] });
    },
  });

  return { unattend, isPending };
}

export function useApproveEvent() {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: approveEvent,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["Pending Events"],
      });
      queryClient.invalidateQueries({
        queryKey: ["Event", variables],
      });
    },
  });
  return { mutate, isPending };
}
export function userejectEventApproval() {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: rejectEventApproval,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["Pending Events"],
      });
      queryClient.invalidateQueries({
        queryKey: ["Event", variables],
      });
    },
  });
  return { mutate, isPending };
}

export function useFetchPastAttendedEvents() {
  const { data: pastAttendedEvents, isLoading: isLoadingPastEvents } = useQuery(
    {
      queryKey: ["Past Attended Events"],
      queryFn: fetchPastAttendedEvents,
    }
  );

  return { pastAttendedEvents, isLoadingPastEvents };
}
