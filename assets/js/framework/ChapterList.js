import React from "react";
import { useQuery } from "react-query";
import { request } from "../utils/graph-ql";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { DialogContext } from "../context/DialogContext";
import FabAddButton from "../kmui/FabAddButton";
import BreadCrumbs from "../kmui/BreadCrumbs";
import Spinner from "../kmui/Spinner";
import MainWrapper from "./MainWrapper";
import EditNoteIcon from "@mui/icons-material/EditNote";
import { SessionContext } from "../context/SessionContext";
import minBy from "lodash/minBy";
import maxBy from "lodash/maxBy";
import {
  navBookLink,
  bookName,
  sectionName,
  sectionCrumb,
  navChapterLink,
} from "../utils/app";
import { capitalizeFirstLetter } from "../utils/string";
import { replace } from "../utils/obj";
import { MAX_WIDTH_CONTENT } from "../consts";

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
    }
  }`).then(({ section }) => section);

const fetchChapters = ({ queryKey: [_, sectionId] }) =>
  request(`{
    chapters(sectionId: ${sectionId}) {
      id
      chapterNo
      nameEng
      nameArb
    }
  }`).then(({ chapters }) => chapters);

const fetchReportRange = ({ queryKey: [_, sectionId] }) =>
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
  const { isAdmin } = React.useContext(SessionContext);
  const { data: chapters = [], isFetching: fetchingChapters } = useQuery(
    ["chapters", sectionId],
    fetchChapters
  );
  const { data: section = {}, isFetching: fetchingSection } = useQuery(
    ["section", sectionId],
    fetchSection
  );

  const { data: reportRange = [] } = useQuery(
    ["reportRange", sectionId],
    fetchReportRange
  );

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
    transformPayload: (payload) =>
      replace(payload, [
        {
          key: "nameEng",
          value: capitalizeFirstLetter(payload.nameEng),
        },
      ]),
  });

  const ReportRangeChapter = ({ chapterId }) => {
    const rangeRec = reportRange.find((r) => r.entityId == chapterId);
    return rangeRec ? (
      <Typography variant="footer">
        {`(Reports: ${rangeRec.startReportNo} - ${rangeRec.endReportNo})`}
      </Typography>
    ) : null;
  };

  const ChapterCard = ({ chapter }) => (
    <Stack
      sx={{
        width: "100%",
        maxWidth: MAX_WIDTH_CONTENT,
        backgroundColor: "primary.paper",
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
          <strong>Chapter {chapter.chapterNo}:&nbsp;</strong>
        ) : null}
        {chapter.nameEng}
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
      <MainWrapper>
        <Stack alignItems="center" spacing={3}>
          <Typography align="center" variant="h5">
            {sectionName(section)}
          </Typography>
          {chapters
            .filter((c) => isAdmin || c.chapterNo > 0)
            .map((chapter) => (
              <ChapterCard key={chapter.id} chapter={chapter} />
            ))}
        </Stack>
      </MainWrapper>
      <FabAddButton
        buttonText="Chapter"
        dataEntryProps={{
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
        }}
      />
    </Spinner>
  );
};
