export const formatIsoStrToLocal = (dtIsoStr) =>
  new Date(dtIsoStr + "Z").toLocaleString("en-US", {
    timeStyle: "short",
    dateStyle: "short",
  });

export const formatIsoStrToLocalDate = (dtIsoStr) =>
  new Date(dtIsoStr + "Z").toLocaleString("en-US", {
    dateStyle: "short",
  });
