const dayjs = require("dayjs");
const customParseFormat = require("dayjs/plugin/customParseFormat");

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
