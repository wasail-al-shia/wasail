export const formatIsoStrToLocal = (dtIsoStr) => {
  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };
  return new Date(dtIsoStr + "Z").toLocaleString("en-US", options);
};

export const formatIsoStrToLocalDate = (dtIsoStr) => {
  const dateObj = new Date(dtIsoStr + "T00:00:00");
  return new Intl.DateTimeFormat("en-US").format(dateObj);
};
