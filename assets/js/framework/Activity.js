import React from "react";
import { useQuery } from "react-query";
import { request } from "../utils/graph-ql";
import Spinner from "../kmui/Spinner";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";
import Box from "@mui/material/Box";
import { formatIsoStrToLocal, formatIsoStrToLocalDate } from "../utils/date";
import Container from "@mui/material/Container";
import { HEADER_HEIGHT } from "../consts";
import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import {
  navChapterLink,
  navReportLink,
  navSearchResultsLink,
} from "../utils/app";
import { UAParser } from "ua-parser-js";
import WsTable from "../kmui/WsTable";

const columns = [
  {
    id: "insertedAt",
    label: "Date",
    format: (v, _rowData) => formatIsoStrToLocal(v),
  },
  {
    id: "ip",
    label: "IP",
  },
  {
    id: "userAgent",
    label: "User Agent",
    format: (v, _rowData) => {
      if (!v) return "-";
      const { browser, device, os } = UAParser(v);
      return [browser.name, os.name, device.type].filter((x) => x).join(", ");
    },
  },
  {
    id: "country",
    label: "Location",
    format: (v, rowData) =>
      v ? `${rowData.city}, ${rowData.region} (${v})` : "-",
  },
  {
    id: "activityType",
    label: "Activity",
    format: (v, rowData) => {
      switch (v) {
        case "view_chapter":
          return (
            <Link
              to={navChapterLink(rowData.chapterId)}
            >{`chapter: ${rowData.chapterId}`}</Link>
          );
        case "view_report":
          return (
            <Link
              to={navReportLink(rowData.reportId)}
            >{`report: ${rowData.reportId}`}</Link>
          );
        case "feedback":
          return (
            <Link
              to={navReportLink(rowData.reportId)}
            >{`fdbck: ${rowData.desc}`}</Link>
          );
        case "contact":
          return `cntct: ${rowData.desc}`;
        case "search":
          return (
            <Link
              to={navSearchResultsLink(rowData.searchStr)}
              state={{ searchStr: rowData.searchStr }}
            >
              {`srch: ${rowData.searchStr}`}
            </Link>
          );
        default:
          return v;
      }
    },
  },
];

const fetchRecentActivity = ({ queryKey: [_, n] }) =>
  request(`{
    recentActivity(n: ${n}) {
      id
      activityType
      userAgent
      ip
      country
      region
      city
      chapterId
      reportId
      searchStr
      desc
      insertedAt
    }
  }`).then(({ recentActivity }) => recentActivity);

const fetchUniqueVisitors = ({ queryKey: [_, n] }) =>
  request(`{
    uniqueVisitorsByDay(n: ${n}) {
      date
      numVisitors
    }
  }`).then(({ uniqueVisitorsByDay }) => uniqueVisitorsByDay);

const fetchActivityCount = ({ queryKey: [_, n] }) =>
  request(`{
    activityCount(n: ${n})
  }`).then(({ activityCount }) => activityCount);

const NUM_DAYS = 30;

export default function () {
  const { data: recentActivity = [], isFetching } = useQuery(
    ["recentActivity", 300],
    fetchRecentActivity
  );

  const { data: uniqueVisitors = [] } = useQuery(
    ["uniqueVisitors", NUM_DAYS],
    fetchUniqueVisitors
  );

  const { data: activityCount = 0 } = useQuery(
    ["activityCount", NUM_DAYS],
    fetchActivityCount
  );

  const avgUniq = (
    uniqueVisitors.map((x) => x.numVisitors).reduce((acc, n) => acc + n, 0) /
    NUM_DAYS
  ).toFixed(1);
  const avgCnt = (activityCount / NUM_DAYS).toFixed(1);

  return (
    <Spinner open={isFetching}>
      <Container sx={{ marginTop: 10 }} maxWidth="lg">
        <Box sx={{ height: HEADER_HEIGHT }} />
        <Grid container spacing={5}>
          <Grid xs={9}>
            <Typography variant="h6">Avg Daily Activity: {avgCnt}</Typography>
            <WsTable vh={90} columnDefs={columns} data={recentActivity} />
          </Grid>
          <Grid xs={3}>
            <Typography variant="h6">
              {`Avg Daily Visitors: ${avgUniq}`}
            </Typography>
            <WsTable
              vh={90}
              columnDefs={[
                {
                  id: "date",
                  label: "Date",
                  format: (v, _rowData) => formatIsoStrToLocalDate(v),
                },
                {
                  id: "numVisitors",
                  label: "# Visitors",
                },
              ]}
              data={uniqueVisitors}
            />
          </Grid>
        </Grid>
      </Container>
    </Spinner>
  );
}
