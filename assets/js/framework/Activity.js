import React from "react";
import { useQuery } from "react-query";
import { request } from "../utils/graph-ql";
import MainWrapper from "./MainWrapper";
import Subheader from "./Subheader";
import Spinner from "../kmui/Spinner";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { formatIsoStrToLocal } from "../utils/date";
import {
  navChapterLink,
  navReportLink,
  navSearchReultsLink,
} from "../utils/app";

const columns = [
  {
    id: "insertedAt",
    label: "Date",
    format: (v, _rowData) => formatIsoStrToLocal(v),
  },
  { id: "ip", label: "IP" },
  {
    id: "region",
    label: "Region/Country",
    format: (v, rowData) => `${v} (${rowData.country})`,
  },
  { id: "city", label: "City" },
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
      ip
      country
      region
      city
      chapterId
      reportId
      searchStr
      insertedAt
    }
  }`).then(({ recentActivity }) => recentActivity);

const fetchActivityCount = () =>
  request(`{
    totalActivityCount
  }`).then(({ totalActivityCount }) => totalActivityCount);

export default function () {
  const { data: recentActivity = [], isFetching } = useQuery(
    ["recentActivity", 200],
    fetchRecentActivity
  );
  const { data: totalActivityCount = 0 } = useQuery(
    ["totalActivityCount"],
    fetchActivityCount
  );
  return (
    <Spinner open={isFetching}>
      <Subheader />
      <MainWrapper>
        <Typography variant="h6">
          Total Activity Count: {totalActivityCount}
        </Typography>
        <Paper sx={{ width: "100%", overflow: "hidden" }}>
          <TableContainer sx={{ maxHeight: "90vh" }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      style={{ minWidth: column.minWidth }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {recentActivity.map((row) => {
                  return (
                    <TableRow key={row.id} hover tabIndex={-1}>
                      {columns.map((column) => {
                        const value = row[column.id];
                        return (
                          <TableCell key={column.id} align={column.align}>
                            {column.format ? column.format(value, row) : value}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </MainWrapper>
    </Spinner>
  );
}
