import React from "react";
import { useQuery } from "react-query";
import { request } from "../utils/graph-ql";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import parse from "html-react-parser";
import { useLocation } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { bookName } from "../utils/app";
import Spinner from "../kmui/Spinner";
import ReportHeader from "../kmui/ReportHeader";
import BackButton from "../kmui/BackButton";
import { stemmer } from "stemmer";
import { HEADER_HEIGHT } from "../consts";

const fetchSearchResults = ({ queryKey: [_, queryStr] }) =>
  request(`{
    search(queryStr: "${queryStr}") {
      matchingText
      reportId
      reportHeading
      chapterNo
      chapterName
      sectionNo
      sectionName
      bookName
      volumeNo
    }
  }`).then(({ search }) => search);

export default function () {
  const location = useLocation();
  const queryStr = location.state?.searchStr || "";
  const stemmedQueryStr = queryStr
    .split(" ")
    .map((w) => stemmer(w))
    .join(" ");

  //console.log("stemmedQueryStr:", stemmedQueryStr);
  const { data: searchResults = [], isFetching } = useQuery(
    ["search", stemmedQueryStr],
    fetchSearchResults
  );

  return (
    <Spinner open={isFetching}>
      <Container sx={{ marginTop: 5 }} maxWidth="lg">
        <Box sx={{ height: HEADER_HEIGHT }} />
        {searchResults.length == 0 ? (
          <Stack alignItems="center">
            <Box sx={{ width: "100%" }}>
              <BackButton />
            </Box>
            <Stack
              alignItems="center"
              sx={{
                padding: 15,
                width: "100%",
                backgroundColor: "#fff",
                borderRadius: 1,
              }}
            >
              <Typography align="center" variant="h4">
                No results found!
              </Typography>
              <Box mt={5} />
              <Typography align="center" variant="h6">
                Please try the search again later. We are in the process of
                adding content to the site. Search results will improve over
                time.
              </Typography>
            </Stack>
          </Stack>
        ) : (
          <>
            <Stack
              alignItems="center"
              direction="row"
              justifyContent="space-between"
            >
              <BackButton />
              <Typography align="center" variant="h5">
                Reports matching &quot;{queryStr}&quot;
              </Typography>
              <Box />
            </Stack>
            <Stack spacing={2}>
              {searchResults.map((r, idx) => (
                <Box
                  key={idx}
                  sx={{
                    backgroundColor: "primary.paper",
                    borderRadius: 1,
                    border: "1px solid gray",
                    padding: 5,
                  }}
                  spacing={5}
                  direction="column"
                >
                  <ReportHeader
                    report={{
                      id: r.reportId,
                      headingEng: r.reportHeading,
                      reportNo: 1,
                    }}
                  />
                  <Stack
                    sx={{
                      marginBottom: 5,
                      padding: 3,
                      backgroundColor: "primary.backdrop",
                      width: "100%",
                    }}
                  >
                    <Typography variant="h5">
                      {bookName({ nameEng: r.bookName, volumeNo: r.volumeNo })}
                    </Typography>
                    <Typography variant="h6">
                      {r.sectionNo > 0
                        ? `Section ${r.sectionNo}: ${r.sectionName}`
                        : r.sectionName}
                    </Typography>
                    <Typography variant="h6">
                      {r.chapterNo > 0
                        ? `Chapter ${r.chapterNo}: ${r.chapterName}`
                        : r.chapterName}
                    </Typography>
                  </Stack>
                  <Typography variant="h6">
                    ...&nbsp;{parse(r.matchingText)}&nbsp;...
                  </Typography>
                </Box>
              ))}
            </Stack>
          </>
        )}
      </Container>
    </Spinner>
  );
}
