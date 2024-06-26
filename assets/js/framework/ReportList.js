import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { request } from "../utils/graph-ql";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import Report from "./Report";
import BreadCrumbs from "../kmui/BreadCrumbs";
import { DialogContext } from "../context/DialogContext";
import { SessionContext } from "../context/SessionContext";
import FabAddButton from "../kmui/FabAddButton";
import Spinner from "../kmui/Spinner";
import { HEADER_HEIGHT } from "../consts";
import ShareIconButton from "../kmui/ShareIconButton";
import IconButton from "@mui/material/IconButton";
import PictureAsPdfOutlinedIcon from "@mui/icons-material/PictureAsPdfOutlined";
import BackButton from "../kmui/BackButton";
import { useLocation } from "react-router-dom";
import {
  bookName,
  sectionName,
  chapterName,
  sectionCrumb,
  chapterCrumb,
  navBookLink,
  navSectionLink,
  generateChapterReference,
} from "../utils/app";
import Container from "@mui/material/Container";
import { replace } from "../utils/obj";
import { flipParenthesis } from "../utils/string";
import { randomHue } from "../utils/sys";
import groupBy from "lodash/groupBy";
import maxBy from "lodash/maxBy";
import { Heading4, Heading5 } from "../kmui/Heading";
import { generateChapterPdf } from "../utils/pdf";

const fetchChapter = ({ queryKey: [, chapterId] }) =>
  request(`{
    chapter(chapterId: ${chapterId}) {
      id
      chapterNo
      nameEng
      nameArb
      descEng
      descArb
      section {
        id
        sectionNo
        nameEng
        book {
          id
          nameEng
          code
          volumeNo
        }
      }
    }
  }`).then(({ chapter }) => chapter);

const fetchReports = ({ queryKey: [, chapterId] }) =>
  request(`{
    reports(chapterId: ${chapterId}) {
      id
      chapterId
      reportNo
      headingEng
      review
      hide 
      notes
      texts {
        id
        fragmentNo
        textEng
        textArb
      }
      comments {
        id
        commentSeqNo
        commentEng
        commentArb
      }
    }
  }`).then(({ reports }) => reports);

const fetchEasyGuideReportFragments = () =>
  request(`{
      easyGuideReportFragments {
        reportId
        easyGuide {
          id
          abbreviated
        }
      }
    }`).then(({ easyGuideReportFragments }) =>
    groupBy(
      easyGuideReportFragments.map((f) => ({
        reportId: f.reportId,
        abbreviated: f.easyGuide.abbreviated,
      })),
      (x) => x.reportId
    )
  );

const fetchAllEasyGuides = () =>
  request(`{
      allEasyGuides {
        id
        abbreviated
        easyGuideFragments {
          id
          fragSeqNo
        }
      }
    }`).then(({ allEasyGuides }) =>
    allEasyGuides.map((g) => ({
      id: g.id,
      abbreviated: g.abbreviated,
      maxFragSeqNo:
        g.easyGuideFragments.length > 0
          ? maxBy(g.easyGuideFragments, (f) => f.fragSeqNo).fragSeqNo
          : 0,
    }))
  );

export default () => {
  const { state } = useLocation();
  const { openDialog } = React.useContext(DialogContext);
  const { isAdmin, isReviewer } = React.useContext(SessionContext);
  const { chapterId } = useParams();
  const reportsDataQueryKey = ["reports", chapterId];
  const { data: reports = [], isFetching: fetchingReports } = useQuery(
    reportsDataQueryKey,
    fetchReports
  );
  const { data: chapter, isFetching: fetchingChapter } = useQuery({
    queryKey: ["chapter", chapterId],
    queryFn: fetchChapter,
    placeholderData: {
      section: {
        book: {},
      },
    },
  });
  const egFragDataQueryKey = ["easyGuideReportFragments"];
  const { data: easyGuideReportFragments = [] } = useQuery(
    egFragDataQueryKey,
    fetchEasyGuideReportFragments
  );
  const allEgDataQueryKey = ["allEasyGuides"];
  const { data: allEasyGuides = [] } = useQuery(
    allEgDataQueryKey,
    fetchAllEasyGuides
  );
  const nextSeqNo =
    reports.length > 0 ? Math.max(...reports.map((r) => r.reportNo)) + 1 : null;
  const [srcStream, setSrcStream] = useState("");

  const reportFields = [
    {
      name: "reportNo",
      label: "Report No",
      type: "number",
      size: "small",
      sx: { width: 100 },
      defaultValue: nextSeqNo,
      rules: { required: true },
      md: 4,
      disabled: !isAdmin,
    },
    {
      name: "review",
      label: "Needs review?",
      type: "radio",
      defaultValue: "yes",
      md: 4,
      options: [
        {
          value: "yes",
          label: "Yes",
        },
        {
          value: "no",
          label: "No",
        },
      ],
    },
    {
      name: "hide",
      label: "Hide?",
      type: "radio",
      defaultValue: "no",
      md: 4,
      options: [
        {
          value: "yes",
          label: "Yes",
        },
        {
          value: "no",
          label: "No",
        },
      ],
    },
    {
      name: "headingEng",
      label: "Heading Eng",
      type: "text",
      size: "small",
      md: 12,
      fullWidth: true,
      defaultValue: "Hadith " + (nextSeqNo || ""),
      rules: { required: true },
      disabled: !isAdmin,
    },
    {
      name: "easyGuideFragNo",
      label: "Easy Guide Frag No",
      type: "number",
      size: "small",
      md: 6,
    },
    {
      name: "easyGuide",
      label: "Easy Guide",
      type: "autocomplete",
      freeSolo: true,
      options: allEasyGuides,
      defaultValue: null,
      md: 6,
      getOptionLabel: (g) => (g ? `${g.abbreviated} (${g.maxFragSeqNo})` : ""),
      isOptionEqualToValue: (x, y) => x.id == y.id,
    },
    {
      name: "notes",
      label: "Internal Notes",
      type: "text",
      multiline: true,
      rows: 4,
      inputProps: {
        style: { fontSize: "1.1rem", fontFamily: "Overpass Variable" },
      },
      md: 12,
      fullWidth: true,
    },
  ];
  const reportFragFields = [
    {
      name: "textArb",
      label: "Text Arabic",
      type: "text",
      size: "small",
      inputProps: {
        dir: "rtl",
        style: {
          lineHeight: 1.5,
          fontSize: "1.5rem",
          fontFamily: "Noto Naskh Arabic Variable",
        },
      },
      fullWidth: true,
      multiline: true,
      rules: { required: true },
      rows: 7,
      md: 12,
    },
    {
      name: "textEng",
      label: "Text English",
      size: "small",
      type: "text",
      fullWidth: true,
      inputProps: {
        style: { fontSize: "1.0rem", fontFamily: "Overpass Variable" },
      },
      multiline: true,
      rules: { required: true },
      rows: 12,
      md: 12,
    },
  ];

  const crumbDefs = !fetchingChapter && [
    {
      to: "/",
      crumbName: "Library",
    },
    {
      to: navBookLink(chapter.section.book.id),
      crumbName: bookName(chapter.section.book),
    },
    {
      to: navSectionLink(chapter.section.id),
      crumbName: sectionCrumb(
        chapter.section.sectionNo,
        chapter.section.nameEng
      ),
    },
    {
      crumbName: chapterCrumb(chapter.chapterNo, chapter.nameEng),
    },
  ];

  const hue = randomHue();

  return (
    <Spinner open={fetchingChapter || fetchingReports}>
      <BreadCrumbs crumbDefs={crumbDefs} />
      <Container maxWidth="lg">
        <Stack
          spacing={5}
          sx={{
            backgroundColor: "primary.paper",
            paddingLeft: "0.875rem",
            paddingRight: "0.875rem",
            paddingBottom: "0.875rem",
          }}
        >
          <Box sx={{ height: `calc(2 * ${HEADER_HEIGHT})` }} />
          {state?.showBackButton && (
            <Box sx={{ width: "100%" }}>
              <BackButton />
            </Box>
          )}
          <Heading4>{sectionName(chapter.section)}</Heading4>
          <Heading5>
            {chapterName(chapter)}
            <Tooltip title="Download Chapter">
              <IconButton
                size="small"
                variant="contained"
                sx={{ color: "primary.dark2" }}
                onClick={() => generateChapterPdf(chapter.id, setSrcStream)}
              >
                <PictureAsPdfOutlinedIcon size="small" />
              </IconButton>
            </Tooltip>
            <ShareIconButton
              title="Share Link To Chapter"
              retrieveTextToCopy={() => generateChapterReference(chapter)}
              snackMessage="Chapter link copied to clipboard"
            />
          </Heading5>
          {/* <iframe width="970" height="1330" src={srcStream} /> */}
          {reports
            .filter((r) => isReviewer || !r.hide)
            .map((report) => (
              <Report
                key={report.id}
                dataQueryKeys={[reportsDataQueryKey, egFragDataQueryKey]}
                hue={hue}
                lightness={95}
                report={{ ...report, chapter }}
                easyGuideFragments={easyGuideReportFragments[report.id]}
                onEdit={() =>
                  openDialog("dataEntry", {
                    key: report.id,
                    title: "Update report",
                    dataQueryKeys: [
                      reportsDataQueryKey,
                      allEgDataQueryKey,
                      egFragDataQueryKey,
                      ["easyGuide"], //defined in EasyGuide.js
                    ],
                    fields: reportFields,
                    mutationApi: "updateReport",
                    defaultValues: {
                      ...report,
                      review: report.review ? "yes" : "no",
                      hide: report.hide ? "yes" : "no",
                    },
                    basePayload: { reportId: report.id },
                    transformPayload,
                    deleteApi: isAdmin ? "deleteReport" : null,
                    deletePayload: {
                      reportId: report.id,
                    },
                  })
                }
              />
            ))}
        </Stack>
      </Container>
      <FabAddButton
        buttonText="Report"
        dataEntryProps={{
          key: `addreport${nextSeqNo}`,
          title: "Add report",
          fields: reportFields.concat(reportFragFields),
          dataQueryKeys: [reportsDataQueryKey],
          onlyDirty: false,
          mutationApi: "addReportFrag",
          basePayload: { chapterId: chapter.id },
          transformPayload,
        }}
      />
    </Spinner>
  );
};

const transformPayload = (payload) => {
  return replace(payload, [
    {
      key: "review",
      value: payload.review == "yes" ? true : false,
    },
    {
      key: "hide",
      value: payload.hide == "yes" ? true : false,
    },
    {
      key: "textArb",
      value: payload.textArb && flipParenthesis(payload.textArb),
    },
    {
      key: "easyGuide",
      newKey: "easyGuideId",
      value: payload.easyGuide?.id,
    },
  ]);
};
