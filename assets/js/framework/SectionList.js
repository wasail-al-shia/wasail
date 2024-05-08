import React from "react";
import { useQuery } from "react-query";
import { request } from "../utils/graph-ql";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { DialogContext } from "../context/DialogContext";
import FabAddButton from "../kmui/FabAddButton";
import BreadCrumbs from "../kmui/BreadCrumbs";
import Spinner from "../kmui/Spinner";
import EditNoteIcon from "@mui/icons-material/EditNote";
import { SessionContext } from "../context/SessionContext";
import { bookName, sectionName, navSectionLink } from "../utils/app";
import Container from "@mui/material/Container";
import { Heading4 } from "../kmui/Heading";
import { HEADER_HEIGHT } from "../consts";

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

const fetchReportRangeBook = ({ queryKey: [_, bookId] }) =>
  request(`{
    reportRangeBook(bookId: ${bookId}) {
      entityId
      startReportNo
      endReportNo
    }
  }`).then(({ reportRangeBook }) => reportRangeBook);

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

  const { data: reportRange = [] } = useQuery(
    ["reportRangeBook", bookId],
    fetchReportRangeBook
  );

  const nextSectionNo = Math.max(...sections.map((s) => s.sectionNo)) + 1;

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

  const ReportRangeSection = ({ section }) => {
    const rangeRec = reportRange.find((r) => r.entityId == section.id);
    return rangeRec ? (
      <>
        <Typography sx={{ color: "primary.dark2" }} variant="reportRange">
          {`Reports: ${rangeRec.startReportNo} - ${rangeRec.endReportNo}`}
        </Typography>
        <Typography sx={{ color: "primary.dark2" }} variant="footer">
          {`(${section.chapters.length} Chapters)`}
        </Typography>
      </>
    ) : null;
  };

  const SectionCard = ({ section }) => (
    <Stack
      sx={{
        width: "100%",
        padding: "0.5rem",
        backgroundColor: "primary.header2",
        borderRadius: 1,
        "&:hover": {
          backgroundColor: "primary.header1",
          cursor: "pointer",
        },
      }}
      onClick={() => navigate(navSectionLink(section.id))}
      direction="column"
    >
      <Typography variant="h5">
        {sectionName(section)}
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
      </Typography>
      {section.sectionNo ? <ReportRangeSection section={section} /> : null}
      <Typography dir="rtl" variant="h6a">
        {section.nameArb}
      </Typography>
    </Stack>
  );

  return (
    <Spinner open={fetchingSections || fetchingBook}>
      <BreadCrumbs crumbDefs={crumbDefs} />
      <Box sx={{ height: `calc(2 * ${HEADER_HEIGHT})` }} />
      <Container maxWidth="lg">
        <Stack sx={{ marginTop: 5 }} spacing={3}>
          <Heading4>{bookName(book)}</Heading4>
          {sections.map((section) => (
            <SectionCard key={section.id} section={section} />
          ))}
        </Stack>
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
      </Container>
    </Spinner>
  );
};
