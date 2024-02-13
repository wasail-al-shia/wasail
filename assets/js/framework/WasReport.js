import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { request } from "../utils/graph-ql";
import ViewReport from "./ViewReport";

const fetchReportId = ({ queryKey: [, reportNo] }) =>
  request(`{
    was_report_id(reportNo: ${reportNo})
  }`).then(({ was_report_id }) => was_report_id);

export default function () {
  const { reportNo } = useParams();
  const { data: wasReportId } = useQuery(
    ["wasReportId", reportNo],
    fetchReportId
  );
  return wasReportId ? <ViewReport wasReportId={wasReportId} /> : null;
}
