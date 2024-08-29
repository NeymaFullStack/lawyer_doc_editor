const dayjs = require("dayjs");
const customParseFormat = require("dayjs/plugin/customParseFormat");
import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(duration);
dayjs.extend(relativeTime);
// Extend dayjs with customParseFormat plugin
dayjs.extend(customParseFormat);

export const dtFormat = (date) => {
  let formattedDate = dayjs(date).format("MMMM D[th], YYYY");
  let formattedTime = dayjs(date).format("h:mmA");
  let formattedDateTime = `${formattedDate} • ${formattedTime}`;
  return formattedDateTime;
};

export const dtYYMMDD12hrFormat = (date, current = false) => {
  let formattedDate = dayjs(date).format("YYYY-MM-DD");
  let formattedTime = current ? "Now" : dayjs(date).format("h:mmA");
  let formattedDateTime = `${formattedDate} • ${formattedTime}`;
  return formattedDateTime;
};

export const dtYYMMDDat12hrFormat = (date, current = false) => {
  let formattedDate = dayjs(date).format("YYYY-MM-DD");
  let formattedTime = current ? "Now" : dayjs(date).format("h:mmA");
  let formattedDateTime = `${formattedDate} at ${formattedTime}`;
  return formattedDateTime;
};

export const getTimePassed = (dateTime) => {
  const now = dayjs();
  const past = dayjs(dateTime);
  const diffInSeconds = now.diff(past, "second");

  if (diffInSeconds < 60) {
    return `${diffInSeconds} seconds`;
  }

  const diffInMinutes = now.diff(past, "minute");
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minutes`;
  }

  const diffInHours = now.diff(past, "hour");
  if (diffInHours < 24) {
    return `${diffInHours} hours`;
  }

  const diffInDays = now.diff(past, "day");
  return `${diffInDays} ${diffInDays > 1 ? "days" : "day"}`;
};
