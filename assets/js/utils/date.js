export const formatIsoStrToLocal = (dtIsoStr) =>
  new Date(dtIsoStr + "Z").toLocaleString("en-US", {
    timeStyle: "short",
    dateStyle: "full",
  });
