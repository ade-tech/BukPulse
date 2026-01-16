import type { CreateEventInputs, Event } from "@/lib/types";
import { supabase } from "./supabase";
import { prepareImageUpload } from "@/lib/helper";

export const createNewEvent = async ({
  creator_id,
  event_category,
  event_date,
  event_description,
  event_image,
  event_location,
  event_time,
  event_title,
  isSuperAdmin = false,
}: CreateEventInputs) => {
  const { image, imagePath, imageURL } = prepareImageUpload({
    image: event_image,
    bucketName: "events_images",
    folderPath: "events",
  });

  const { error: imageUploadError } = await supabase.storage
    .from("events_images")
    .upload(imagePath, image);

  if (imageUploadError) throw new Error("We could not upload the image");
  const { error } = await supabase.from("events").insert([
    {
      creator_id,
      event_date,
      event_category: event_category.join(""),
      event_description,
      event_location,
      event_time,
      event_title,
      event_image_url: imageURL,
      event_status: isSuperAdmin ? "approved" : "pending",
    },
  ]);
  if (error) throw error;
};
export const fetchEvent = async (id: string) => {
  const { data, error } = await supabase
    .from("events")
    .select("*, profiles ( name )")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data as Event;
};
export const fetchAllUpcomingEvents = async (creatorId?: string) => {
  const { data: userData, error: authError } = await supabase.auth.getUser();
  if (authError || !userData.user) throw new Error("Could not verify user");

  const userRole = userData.user.user_metadata.role;
  const now = new Date().toISOString();

  let query = supabase
    .from("events")
    .select("*, profiles ( name )")
    .eq("event_status", "approved")
    .gt("event_date", now);

  // If creatorId is provided (for admin role), filter by creator_id
  // super_admin sees all events, admin only sees their own
  if (creatorId && userRole !== "super_admin") {
    query = query.eq("creator_id", creatorId);
  }

  const { data, error } = await query.order("event_date", { ascending: true });

  if (error) throw error;

  return data as Event[];
};
export const FetchRandomEvents = async () => {
  const { data, error } = await supabase.from("events").select("*");
  if (error) throw error;
  return data as Event[];
};
export const getPendingEvents = async () => {
  const { data, error } = await supabase
    .from("events")
    .select("*, profiles ( name )")
    .eq("event_status", "pending");
  if (error) throw error;
  return data as Event[];
};

export const approveEvent = async (event_id: string) => {
  const { data, error } = await supabase.auth.getUser();
  if (error) throw new Error("Could not verify Authorization");

  if (data.user.user_metadata.role !== "super_admin")
    throw new Error("Only admins can approve events");

  const { data: event, error: approvalError } = await supabase
    .from("events")
    .update({ event_status: "approved" })
    .eq("id", event_id)
    .select()
    .single();
  if (approvalError) throw new Error("Could not approve Event");
  return event as Event;
};

export const rejectEventApproval = async ({
  event_id,
  reason,
}: {
  event_id: string;
  reason: string;
}) => {
  const { data, error } = await supabase.auth.getUser();
  if (error) throw new Error("Could not verify Authorization");

  if (data.user.user_metadata.role !== "super_admin")
    throw new Error("Only admins can reject event approval");

  const { data: event, error: rejectionError } = await supabase
    .from("events")
    .update({
      event_status: "rejected",
      rejection_reason: reason,
    })
    .eq("id", event_id)
    .select()
    .single();
  if (rejectionError) throw new Error("Could not reject Event");
  return event as Event;
};

export const attendEvent = async (event_id: string) => {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) throw new Error("Could not verify user");
  const attender_id = data.user.id;

  const { data: existing, error: fetchError } = await supabase
    .from("event_attendees")
    .select("*")
    .eq("event_id", event_id)
    .eq("attender_id", attender_id)
    .maybeSingle();

  if (fetchError) throw fetchError;

  if (existing) return existing;

  const { data: inserted, error: insertError } = await supabase
    .from("event_attendees")
    .insert([
      {
        event_id,
        attender_id,
      },
    ])
    .select()
    .single();

  if (insertError) throw insertError;
  return inserted;
};

export const unattendEvent = async (event_id: string) => {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) throw new Error("Could not verify user");
  const attender_id = data.user.id;

  const { error: deleteError } = await supabase
    .from("event_attendees")
    .delete()
    .eq("event_id", event_id)
    .eq("attender_id", attender_id);

  if (deleteError) throw deleteError;
  return { success: true };
};

export const fetchEventAttendees = async (event_id: string) => {
  const { count, error } = await supabase
    .from("event_attendees")
    .select("id", { count: "exact", head: true })
    .eq("event_id", event_id);

  if (error) throw error;

  return count ?? 0;
};

export const isUserAttending = async (event_id: string) => {
  const { data: userData, error: authError } = await supabase.auth.getUser();
  if (authError || !userData.user) return false;
  const attender_id = userData.user.id;

  const { data, error } = await supabase
    .from("event_attendees")
    .select("id")
    .eq("event_id", event_id)
    .eq("attender_id", attender_id)
    .maybeSingle();
  if (error) throw error;
  return !!data;
};

export const fetchPastAttendedEvents = async () => {
  const { data: userData, error: authError } = await supabase.auth.getUser();
  if (authError || !userData.user) throw new Error("Could not verify user");
  const attender_id = userData.user.id;

  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from("event_attendees")
    .select("events (*, profiles (name))")
    .eq("attender_id", attender_id);

  if (error) throw error;

  const attendedEvents = data
    ?.map((attendance: any) => attendance.events)
    .filter((event: Event | null) => {
      if (!event) return false;
      return event.event_status === "approved" && event.event_date < now;
    })
    .sort(
      (a: Event, b: Event) =>
        new Date(b.event_date).getTime() - new Date(a.event_date).getTime()
    ) as Event[];

  return attendedEvents || [];
};

export const fetchAllPastEvents = async (creatorId?: string) => {
  const { data: userData, error: authError } = await supabase.auth.getUser();
  if (authError || !userData.user) throw new Error("Could not verify user");

  const userRole = userData.user.user_metadata.role;
  const now = new Date().toISOString();

  let query = supabase
    .from("events")
    .select("*, profiles ( name )")
    .eq("event_status", "approved")
    .lt("event_date", now);

  // If creatorId is provided (for admin role), filter by creator_id
  // super_admin sees all events, admin only sees their own
  if (creatorId && userRole !== "super_admin") {
    query = query.eq("creator_id", creatorId);
  }

  const { data, error } = await query.order("event_date", { ascending: false });

  if (error) throw error;

  return data as Event[];
};
