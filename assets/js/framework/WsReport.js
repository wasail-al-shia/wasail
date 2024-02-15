import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { request } from "../utils/graph-ql";
import ViewReport from "./ViewReport";

const fetchReportId = ({ queryKey: [, reportNo] }) =>
  request(`{
    wsReportId(reportNo: ${reportNo})
  }`).then(({ wsReportId }) => wsReportId);

export default function () {
  const { reportNo } = useParams();
  const { data: wsReportId } = useQuery(
    ["wsReportId", reportNo],
    fetchReportId
  );
  return wsReportId ? <ViewReport wsReportId={wsReportId} /> : null;
}
