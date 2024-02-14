import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { request } from "../utils/graph-ql";
import ViewReport from "./ViewReport";

const fetchReportId = ({ queryKey: [, reportNo] }) =>
  request(`{
    ws_report_id(reportNo: ${reportNo})
  }`).then(({ ws_report_id }) => ws_report_id);

export default function () {
  const { reportNo } = useParams();
  const { data: wsReportId } = useQuery(
    ["wsReportId", reportNo],
    fetchReportId
  );
  return wsReportId ? <ViewReport wsReportId={wsReportId} /> : null;
}
