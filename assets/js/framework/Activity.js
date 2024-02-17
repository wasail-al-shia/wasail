import React from "react";
import { useQuery } from "react-query";
import { request } from "../utils/graph-ql";
import MainWrapper from "./MainWrapper";
import Subheader from "./Subheader";
import Spinner from "../kmui/Spinner";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

const columns = [
  { id: "activityType", label: "Activity Type", minWidth: 170 },
  { id: "ip", label: "IP", minWidth: 100 },
  { id: "country", label: "Country", minWidth: 100 },
  { id: "region", label: "Region", minWidth: 100 },
  { id: "city", label: "City", minWidth: 100 },
  { id: "chapterId", label: "Chapter Id", minWidth: 100 },
  { id: "reportId", label: "Report Id", minWidth: 100 },
  { id: "searchStr", label: "Search Str", minWidth: 100 },
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
    }
  }`).then(({ recentActivity }) => recentActivity);

const fetchActivityCount = () =>
  request(`{
    totalActivityCount
  }`).then(({ totalActivityCount }) => totalActivityCount);

export default function () {
  const { data: recentActivity = [], isFetching } = useQuery(
    ["recentActivity", 100],
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
          <TableContainer sx={{ maxHeight: 440 }}>
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
                            {value}
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
