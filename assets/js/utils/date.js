import { format, formatDistanceToNowStrict } from "date-fns";

export const formatIsoStr = (dtIsoStr, formatStr = "MM/dd/yyyy") => {
  return formatDate(isoToUtcDate(dtIsoStr), formatStr);
};

export const formatIsoStrLocal = (dtIsoStr, formatStr = "MM/dd/yyyy") => {
  return formatDate(isoToLocalDate(dtIsoStr), formatStr);
};

export const formatIsoStrDateTime = (dtIsoStr) => {
  return formatDateTime(new Date(dtIsoStr));
};

export const formatDate = (date, formatStr = "MM/dd/yyyy") => {
  try {
    return format(date, formatStr);
  } catch (err) {
    return "-";
  }
};

export const formatDateTime = (datetime) => {
  try {
    return format(datetime, "MM/dd/yyyy h:mm aaa");
  } catch (err) {
    return "-";
  }
};

export const dateComparator = (d1, d2) => (!d1 ? -1 : !d2 ? 1 : d1 - d2);

export const isoToUtcDate = (dtIsoStr) => {
  if (!dtIsoStr) return null;
  const date = new Date(dtIsoStr);
  let utc = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
  return utc;
};

export const isoToLocalDate = (dtIsoStr) => {
  if (!dtIsoStr) return null;
  const date = new Date(dtIsoStr);
  let local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local;
};

export const todayIso = () => {
  const date = new Date();
  let local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().split("T")[0];
};
export const nowIso = () => {
  const date = new Date();
  let local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  const split = local.toISOString().split(":");
  return `${split[0]}:${split[1]}`;
};

export const nowIsoWithSeconds = () => {
  const date = new Date();
  let local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  const split = local.toISOString().split(":");
  return `${split[0]}:${split[1]}:${split[2].split(".")[0]}`;
};

export const nowTime = () => {
  return format(new Date(), "HH:mm");
};

export const getQuarter = (jsDate) => Math.ceil((jsDate.getMonth() + 1) / 3);

export const toQuarterStr = (jsDate) =>
  `Q${getQuarter(jsDate)}-${jsDate.getFullYear()}`;

export const subtractMonths = (date, numMonths) => {
  date.setMonth(date.getMonth() - numMonths);
  return date;
};

export const getFormattedTime = (militaryTime) => {
  if (militaryTime) {
    var hours24 = parseInt(militaryTime.substring(0, 2));
    var hours = ((hours24 + 11) % 12) + 1;
    var amPm = hours24 > 11 ? "pm" : "am";
    var minutes = militaryTime.substring(3);

    return `${hours}:${minutes} ${amPm}`;
  } else return "-";
};

export const formatIsoTwitterStyle = (dtIsoStr) =>
  formatDistanceToNowStrict(isoToLocalDate(dtIsoStr), { addSuffix: true });

export const getIsoStrPastByMonth = (numMonths) =>
  formatIsoStr(subtractMonths(new Date(), numMonths), "yyyy-MM-dd");
