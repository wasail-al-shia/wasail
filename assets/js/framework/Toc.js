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
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddIcon from "@mui/icons-material/Add";
import EditNoteIcon from "@mui/icons-material/EditNote";
import { SessionContext } from "../context/SessionContext";
import { navChapterLink } from "../utils/app";

const fetchBook = ({ queryKey: [_, bookId] }) =>
  request(`{
    book(bookId: ${bookId}) {
      id
      nameEng
      code
      authorEng
      volumeNo
    }
  }`).then(({ book }) => book);

const fetchSections = ({ queryKey: [_, bookId] }) =>
  request(`{
    sections(bookId: ${bookId}) {
      id
      sectionNo
      nameEng
      nameArb
      descEng
      descArb
      chapters {
        id
        chapterNo
        nameEng
        nameArb
        descEng
        descArb
      }
    }
  }`).then(({ sections }) => sections);

export default () => {
  const navigate = useNavigate();
  const { bookId } = useParams();
  const { openDialog } = React.useContext(DialogContext);
  const { isAdmin } = React.useContext(SessionContext);
  const { data: sections = [], isFetching: fetchingSections } = useQuery(
    ["sections", bookId],
    fetchSections
  );
  const { data: book = {}, isFetching: fetchingBook } = useQuery(
    ["book", bookId],
    fetchBook
  );

  const nextSectionNo = Math.max(...sections.map((s) => s.sectionNo)) + 1;
  const nextChapterNo = (section) =>
    Math.max(...section.chapters.map((c) => c.chapterNo)) + 1;

  const sectionDialogFields = [
    {
      name: "sectionNo",
      label: "Section No",
      type: "number",
      size: "small",
      sx: { width: 120 },
      rules: { required: true },
      defaultValue: nextSectionNo,
    },
    {
      name: "nameEng",
      label: "Name Eng",
      type: "text",
      size: "small",
      rules: { required: true },
      fullWidth: true,
      md: 12,
    },
    {
      name: "nameArb",
      label: "Name Arabic",
      type: "text",
      size: "small",
      rules: { required: true },
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

  const crumbDefs = [
    {
      to: "/",
      crumbName: "Library",
    },
    {
      crumbName:
        book.nameEng + (book.volumeNo > 0 ? ` Vol. ${book.volumeNo}` : ""),
    },
  ];

  const updateSectionDialogProps = (section) => ({
    key: section.id,
    title: "Update Section",
    dataQueryKeys: ["sections"],
    fields: sectionDialogFields,
    mutationApi: "updateSection",
    defaultValues: section,
    basePayload: { sectionId: section.id },
    deleteApi: "deleteSection",
    deletePayload: {
      sectionId: section.id,
    },
  });

  const addChapterDialogProps = (section) => ({
    key: nextChapterNo(section),
    title: "Add Chapter",
    fields: chapterDialogFields,
    dataQueryKeys: ["sections"],
    mutationApi: "addChapter",
    basePayload: { sectionId: section.id },
  });

  const updateChapterDialogProps = (chapter) => ({
    key: chapter.id,
    title: "Update Chapter",
    dataQueryKeys: ["sections"],
    fields: chapterDialogFields,
    mutationApi: "updateChapter",
    defaultValues: chapter,
    basePayload: { chapterId: chapter.id },
    deleteApi: "deleteChapter",
    deletePayload: {
      chapterId: chapter.id,
    },
  });

  const SectionCard = ({ section }) => (
    <Stack
      sx={{
        width: "100%",
        paddingLeft: 3,
        paddingRight: 10,
        backgroundColor: "primary.header2",
      }}
      spacing={5}
      direction="column"
    >
      <Typography variant="h5">
        Section {section.sectionNo}: {section.nameEng}
        {isAdmin && (
          <EditNoteIcon
            sx={{ marginRight: 3 }}
            size="small"
            onClick={(e) => {
              openDialog("dataEntry", updateSectionDialogProps(section));
              e.stopPropagation();
            }}
          />
        )}
        {isAdmin && (
          <AddIcon
            sx={{ marginRight: 3 }}
            size="small"
            onClick={(e) => {
              openDialog("dataEntry", addChapterDialogProps(section));
              e.stopPropagation();
            }}
          />
        )}
      </Typography>
      <Typography dir="rtl" variant="h6a">
        {section.nameArb}
      </Typography>
    </Stack>
  );

  const ChapterCard = ({ chapter }) => (
    <Stack
      sx={{
        backgroundColor: "primary.paper",
        borderRadius: 1,
        border: "1px solid gray",
        padding: 5,
        "&:hover": {
          border: "2px solid gray",
          cursor: "pointer",
        },
      }}
      onClick={() => navigate(navChapterLink(chapter.id))}
      spacing={5}
      direction="column"
    >
      <Typography variant="h6">
        <strong>Chapter {chapter.chapterNo}:</strong> {chapter.nameEng}
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
      <Typography dir="rtl" variant="h6a">
        {chapter.nameArb}
      </Typography>
    </Stack>
  );

  return (
    <Spinner open={fetchingSections || fetchingBook}>
      <BreadCrumbs crumbDefs={crumbDefs} />
      <MainWrapper hasBreadcrumbs={true}>
        {sections.map((section) => (
          <Accordion
            disableGutters
            sx={{
              padding: 0,
              margin: 3,
              backgroundColor: "primary.header2",
            }}
            key={section.id}
          >
            <AccordionSummary
              expandIcon={
                <ExpandMoreIcon
                  sx={{
                    color: "primary.dark",
                    backgroundColor: "primary.backdrop",
                    borderRadius: 1,
                    fontSize: "2.0rem",
                    fontWeight: 500,
                  }}
                />
              }
              id={section.id}
            >
              <SectionCard section={section} />
            </AccordionSummary>
            <AccordionDetails>
              {section.chapters.map((chapter) => (
                <ChapterCard key={chapter.id} chapter={chapter} />
              ))}
            </AccordionDetails>
          </Accordion>
        ))}
      </MainWrapper>
      <FabAddButton
        buttonText="Section"
        dataEntryProps={{
          key: nextSectionNo,
          title: "Add Section",
          fields: sectionDialogFields,
          dataQueryKeys: ["sections"],
          mutationApi: "addSection",
          basePayload: { bookId: book.id },
        }}
      />
    </Spinner>
  );
};
