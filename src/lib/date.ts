import {
  format,
  isToday,
  isYesterday,
  differenceInMinutes,
  differenceInHours,
  differenceInDays,
  isThisYear,
  differenceInSeconds,
} from "date-fns";

export const formatTimestamp = (dateInput: Date): string => {
  // Ensure the input is a valid Date object
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;

  const now = new Date();

  const minutesDifference = differenceInMinutes(now, date);
  if (minutesDifference < 1) {
    return "now";
  }

  if (minutesDifference < 60) {
    return `${minutesDifference} ${
      minutesDifference === 1 ? "minute" : "minutes"
    } ago`;
  }

  const hoursDifference = differenceInHours(now, date);
  if (hoursDifference < 24 && isToday(date)) {
    return `${hoursDifference} ${hoursDifference === 1 ? "hour" : "hours"} ago`;
  }

  if (isYesterday(date)) {
    return `Yesterday • ${format(date, "h:mm a")}`; // Include time for yesterday
  }

  const daysDifference = differenceInDays(now, date);
  if (daysDifference < 7) {
    return `${daysDifference} ${daysDifference === 1 ? "day" : "days"} ago`;
  }

  if (isThisYear(date)) {
    return `${format(date, "MMM d")} • ${format(date, "h:mm a")}`; // e.g., "on Jul 10 • 8:45 PM"
  }

  return `${format(date, "MMM d, yyyy")} • ${format(date, "h:mm a")}`; // e.g., "on Jul 10, 2023 • 8:45 PM"
};

export function formatDateToCustomFormat(date: Date): string {
  return format(date, "MM-dd-yyyy 'at' h:mm a");
}
