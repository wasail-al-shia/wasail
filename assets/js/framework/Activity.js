import React from "react";
import { useQuery } from "react-query";
import { request } from "../utils/graph-ql";
import Spinner from "../kmui/Spinner";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { formatIsoStrToLocal, formatIsoStrToLocalDate } from "../utils/date";
import Container from "@mui/material/Container";
import { HEADER_HEIGHT } from "../consts";
import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import {
  navChapterLink,
  navReportLink,
  navSearchReultsLink,
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
    id: "region",
    label: "Region/Country",
    format: (v, rowData) => `${v} (${rowData.country})`,
  },
  { id: "city", label: "City" },
  { id: "activityType", label: "Type" },
  {
    id: "chapterId",
    format: (v) => (v ? <Link to={navChapterLink(v)}>{v}</Link> : null),
    label: "Chapter Id",
  },
  {
    id: "reportId",
    format: (v) => (v ? <Link to={navReportLink(v)}>{v}</Link> : null),
    label: "Report Id",
  },
  {
    id: "searchStr",
    format: (v) =>
      v ? (
        <Link to={navSearchReultsLink(v)} state={{ searchStr: v }}>
          {v}
        </Link>
      ) : null,
    label: "Search",
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

const fetchActivityCount = () =>
  request(`{
    totalActivityCount
  }`).then(({ totalActivityCount }) => totalActivityCount);

export default function () {
  const { data: recentActivity = [], isFetching } = useQuery(
    ["recentActivity", 200],
    fetchRecentActivity
  );

  const { data: uniqueVisitors = [] } = useQuery(
    ["uniqueVisitors", 30],
    fetchUniqueVisitors
  );

  const { data: totalActivityCount = 0 } = useQuery(
    ["totalActivityCount"],
    fetchActivityCount
  );

  return (
    <Spinner open={isFetching}>
      <Container sx={{ marginTop: 10 }} maxWidth="lg">
        <Box sx={{ height: HEADER_HEIGHT }} />
        <Grid container spacing={5}>
          <Grid xs={10}>
            <Typography variant="h6">
              Activity Cnt 30 Days: {totalActivityCount}
            </Typography>
            <WsTable vh={90} columnDefs={columns} data={recentActivity} />
          </Grid>
          <Grid xs={2}>
            <Typography variant="h6">Unique Visitors:</Typography>
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
