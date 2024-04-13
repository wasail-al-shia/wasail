export const formatIsoStrToLocal = (dtIsoStr) =>
  new Date(dtIsoStr + "Z").toLocaleString("en-US", {
    timeStyle: "short",
    dateStyle: "short",
  });

export const formatIsoStrToLocalDate = (dtIsoStr) => {
  const dateObj = new Date(dtIsoStr + "T00:00:00");
  return new Intl.DateTimeFormat("en-US").format(dateObj);
};
