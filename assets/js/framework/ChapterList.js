import React from "react";
import { useQuery, useQueryClient } from "react-query";
import { request } from "../utils/graph-ql";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { DialogContext } from "../context/DialogContext";
import BreadCrumbs from "../kmui/BreadCrumbs";
import Spinner from "../kmui/Spinner";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import Container from "@mui/material/Container";
import EditNoteIcon from "@mui/icons-material/EditNote";
import { SessionContext } from "../context/SessionContext";
import { HEADER_HEIGHT } from "../consts";
import Fab from "@mui/material/Fab";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import PictureAsPdfOutlinedIcon from "@mui/icons-material/PictureAsPdfOutlined";
import CircularProgress from "@mui/material/CircularProgress";
import AddIcon from "@mui/icons-material/Add";
import {
  navBookLink,
  bookName,
  sectionName,
  sectionCrumb,
  navChapterLink,
} from "../utils/app";
import { capitalizeFirstLetter } from "../utils/string";
import { replace } from "../utils/obj";
import { Heading4, Heading5 } from "../kmui/Heading";
import { generateChapterPdf, generateSectionPdf } from "../utils/pdf";

const fetchSection = ({ queryKey: [_, sectionId] }) =>
  request(`{
    section(sectionId: ${sectionId}) {
      id
      sectionNo
      nameEng
      book {
        id
        nameEng
        code
        volumeNo
      }
      chapters {
        id
        chapterNo
        nameEng
        nameArb
      }
    }
  }`).then(({ section }) => section);

const fetchChapters = ({ queryKey: [_, sectionId] }) =>
  request(`{
    chapters(sectionId: ${sectionId}) {
      id
      chapterNo
      nameEng
      nameArb
      reports {
        id
        reportNo
        headingEng
        hide
        review
      }
    }
  }`).then(({ chapters }) => chapters);

const fetchReportRangeSection = ({ queryKey: [_, sectionId] }) =>
  request(`{
    reportRangeSection(sectionId: ${sectionId}) {
      entityId
      startReportNo
      endReportNo
    }
  }`).then(({ reportRangeSection }) => reportRangeSection);

export default () => {
  const navigate = useNavigate();
  const { sectionId } = useParams();
  const { openDialog } = React.useContext(DialogContext);
  const { isAdmin, isReviewer, mostRecentReport } =
    React.useContext(SessionContext);
  const [downloading, setDownloading] = React.useState(false);
  const queryClient = useQueryClient();
  const { data: chapters = [], isFetching: fetchingChapters } = useQuery(
    ["chapters", sectionId],
    fetchChapters
  );
  const { data: section = {}, isFetching: fetchingSection } = useQuery(
    ["section", sectionId],
    fetchSection
  );

  const { data: reportRange = [] } = useQuery(
    ["reportRangeSection", sectionId],
    fetchReportRangeSection
  );

  React.useEffect(() => {
    if (isAdmin) queryClient.invalidateQueries(["section"]);
  }, []);

  const nextChapterNo = (section) =>
    Math.max(...section.chapters.map((c) => c.chapterNo)) + 1;

  const chapterDialogFields = [
    {
      name: "chapterNo",
      label: "Chapter No",
      type: "number",
      size: "small",
      sx: { width: 120 },
      rules: { required: true },
    },
    {
      name: "nameEng",
      label: "Chapter Name Eng",
      type: "text",
      size: "small",
      rules: { required: true },
      fullWidth: true,
      md: 12,
    },
    {
      name: "nameArb",
      label: "Chapter Name Arabic",
      type: "text",
      size: "small",
      fullWidth: true,
      md: 12,
      inputProps: {
        dir: "rtl",
        style: {
          lineHeight: 1.5,
          fontSize: "1.5rem",
          fontFamily: "Noto Naskh Arabic Variable",
        },
      },
    },
    {
      name: "descEng",
      label: "Desc English",
      type: "text",
      size: "small",
      fullWidth: true,
      multiline: true,
      rows: 3,
      md: 12,
    },
    {
      name: "descArb",
      label: "Desc Arabic",
      type: "text",
      size: "small",
      fullWidth: true,
      multiline: true,
      rows: 3,
      md: 12,
      inputProps: {
        dir: "rtl",
        style: {
          lineHeight: 1.5,
          fontSize: "1.5rem",
          fontFamily: "Noto Naskh Arabic Variable",
        },
      },
    },
  ];

  const crumbDefs = !fetchingSection && [
    {
      to: "/",
      crumbName: "Library",
    },
    {
      to: navBookLink(section.book.id),
      crumbName: bookName(section.book),
    },
    {
      crumbName: sectionCrumb(section.sectionNo, section.nameEng),
    },
  ];

  const updateChapterDialogProps = (chapter) => ({
    key: chapter.id,
    title: "Update Chapter",
    dataQueryKeys: ["chapters"],
    fields: chapterDialogFields,
    mutationApi: "updateChapter",
    defaultValues: chapter,
    basePayload: { chapterId: chapter.id },
    deleteApi: "deleteChapter",
    deletePayload: {
      chapterId: chapter.id,
    },
  });

  const ReportRangeChapter = ({ chapterId }) => {
    const rangeRec = reportRange.find((r) => r.entityId == chapterId);
    return rangeRec ? (
      <Typography sx={{ color: "primary.dark2" }} variant="reportRange">
        {`Hadith: ${rangeRec.startReportNo} - ${rangeRec.endReportNo}`}
      </Typography>
    ) : null;
  };

  const anyUnderReview = (chapter) => chapter.reports.some((r) => r.review);

  const anyUnhidden = (chapter) => chapter.reports.some((r) => !r.hide);

  const ChapterCard = ({ chapter }) => (
    <Stack
      sx={{
        width: "100%",
        backgroundColor: "primary.header3",
        borderRadius: 1,
        padding: 5,
        "&:hover": {
          backgroundColor: "primary.header2",
          cursor: "pointer",
        },
      }}
      onClick={() => navigate(navChapterLink(chapter.id))}
      direction="column"
    >
      <Typography variant="h6">
        {chapter.chapterNo ? (
          <span
            style={{
              fontWeight: "600",
              color: isReviewer && anyUnderReview(chapter) ? "#D04405" : null,
            }}
          >
            Chapter {chapter.chapterNo}:&nbsp;
          </span>
        ) : null}
        {chapter.nameEng}
        <Tooltip title="Download Chapter">
          <IconButton
            size="small"
            variant="contained"
            sx={{ color: "primary.dark2" }}
            onClick={(e) => {
              generateChapterPdf(chapter.id);
              e.stopPropagation();
            }}
          >
            <PictureAsPdfOutlinedIcon size="small" />
          </IconButton>
        </Tooltip>
        {isAdmin && (
          <EditNoteIcon
            sx={{ marginRight: 3 }}
            size="small"
            onClick={(e) => {
              openDialog("dataEntry", updateChapterDialogProps(chapter));
              e.stopPropagation();
            }}
          />
        )}
      </Typography>
      {chapter.chapterNo ? <ReportRangeChapter chapterId={chapter.id} /> : null}
      <Typography dir="rtl" variant="h6a">
        {chapter.nameArb}
      </Typography>
    </Stack>
  );

  return (
    <Spinner open={fetchingChapters || fetchingSection}>
      <BreadCrumbs crumbDefs={crumbDefs} />
      <Container maxWidth="lg">
        <Stack alignItems="center" spacing={3}>
          <Box sx={{ height: `calc(2 * ${HEADER_HEIGHT})` }} />
          <Heading4>{section.book && bookName(section.book)}</Heading4>
          <Heading5>
            {sectionName(section)}
            {downloading ? (
              <CircularProgress size="1.2rem" />
            ) : (
              <Tooltip title="Download Entire Section">
                <IconButton
                  size="small"
                  variant="contained"
                  sx={{ color: "primary.dark2" }}
                  onClick={(e) => {
                    if (!downloading) {
                      setDownloading(true);
                      setTimeout(async () => {
                        await generateSectionPdf(section.id);
                        setDownloading(false);
                      }, 0);
                    }
                    e.stopPropagation();
                  }}
                >
                  <PictureAsPdfOutlinedIcon size="small" />
                </IconButton>
              </Tooltip>
            )}
          </Heading5>
          {chapters
            .filter((c) => isReviewer || anyUnhidden(c))
            .map((chapter) => (
              <ChapterCard key={chapter.id} chapter={chapter} />
            ))}
          {isAdmin && (
            <Button
              variant="contained"
              color="primary"
              onClick={() =>
                openDialog("dataEntry", {
                  key: nextChapterNo,
                  title: "Add Chapter",
                  fields: chapterDialogFields,
                  dataQueryKeys: ["chapters"],
                  mutationApi: "addChapter",
                  basePayload: { sectionId: section.id },
                  transformPayload: (payload) =>
                    replace(payload, [
                      {
                        key: "nameEng",
                        value: capitalizeFirstLetter(payload.nameEng),
                      },
                    ]),
                })
              }
            >
              + chapter
            </Button>
          )}
        </Stack>
      </Container>
      {isAdmin && (
        <Fab
          sx={{ paddingRight: 7 }}
          variant="extended"
          size="small"
          color="primary"
          onClick={() => {
            openDialog("batchChapter", {
              key: section.id + section.chapters.length,
              section,
              defaultValues: {
                chapterNo:
                  section.chapters.length > 0
                    ? mostRecentReport?.chapter.chapterNo + 1
                    : null,
                startingReportNo:
                  section.chapters.length > 0
                    ? mostRecentReport?.reportNo + 1
                    : null,
              },
              dataQueryKeys: [
                "section",
                "chapters",
                "reports",
                "reportRangeSection",
                "mostRecentReport",
              ],
            });
          }}
        >
          <AddIcon sx={{ mr: 1 }} />
          Chapter # Hadith
        </Fab>
      )}
    </Spinner>
  );
};
