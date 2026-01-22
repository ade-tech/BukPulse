import {
  differenceInSeconds,
  differenceInMinutes,
  differenceInHours,
  differenceInDays,
  format,
} from "date-fns";

export function getTime(isoString: string | Date): string {
  const now = new Date();
  const date = new Date(isoString);

  if (isNaN(date.getTime())) {
    return "";
  }

  const diffInSeconds = differenceInSeconds(now, date);
  const diffInMinutes = differenceInMinutes(now, date);
  const diffInHours = differenceInHours(now, date);
  const diffInDays = differenceInDays(now, date);

  if (diffInSeconds < 60) {
    return "just now";
  }

  if (diffInMinutes < 60) {
    return `${diffInMinutes}m`;
  }

  if (diffInHours < 24) {
    return `${diffInHours}h`;
  }

  if (diffInDays <= 7) {
    return `${diffInDays}d`;
  }

  return format(date, "MM/dd/yyyy");
}

export function getTimeSent(isoString: string | Date): string {
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return "";
  return format(date, "h:mm a");
}
