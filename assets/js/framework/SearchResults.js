import React from "react";
import { useQuery } from "react-query";
import { request } from "../utils/graph-ql";
import MainWrapper from "./MainWrapper";
import Subheader from "./Subheader";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import parse from "html-react-parser";
import { useNavigate, useLocation } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import { bookName, navReportLink } from "../utils/app";
import Spinner from "../kmui/Spinner";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { MAX_WIDTH_CONTENT } from "../consts";
import { stemmer } from "stemmer";

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
  const navigate = useNavigate();
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

  const BackButton = () => (
    <IconButton size="small" onClick={() => history.back()}>
      <ArrowBackIcon />
    </IconButton>
  );

  return (
    <Spinner open={isFetching}>
      <Subheader />
      <MainWrapper>
        {searchResults.length == 0 ? (
          <Stack alignItems="center">
            <Box sx={{ width: "100%" }}>
              <BackButton />
            </Box>
            <Stack
              alignItems="center"
              sx={{
                padding: 15,
                backgroundColor: "#fff",
                borderRadius: 1,
                minWidth: `min(99vw, ${MAX_WIDTH_CONTENT}px)`,
                maxWidth: MAX_WIDTH_CONTENT,
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
                    "&:hover": {
                      border: "2px solid gray",
                      cursor: "pointer",
                      backgroundColor: "primary.header3",
                    },
                  }}
                  onClick={() =>
                    navigate(navReportLink(r.reportId), {
                      state: {
                        showBackButton: true,
                      },
                    })
                  }
                  spacing={5}
                  direction="column"
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
                  <Divider sx={{ mb: 3 }} />
                  <Typography variant="h6">{r.reportHeading}</Typography>
                  <Typography variant="h6">
                    ...&nbsp;{parse(r.matchingText)}&nbsp;...
                  </Typography>
                </Box>
              ))}
            </Stack>
          </>
        )}
      </MainWrapper>
    </Spinner>
  );
}
