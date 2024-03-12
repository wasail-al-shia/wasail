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
import { bookName, sectionName, navSectionLink } from "../utils/app";
import minBy from "lodash/minBy";
import maxBy from "lodash/maxBy";
import { MAX_WIDTH_CONTENT } from "../consts";

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
    ["reportRange", bookId],
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

  const ReportRangeSection = ({ sectionId }) => {
    const rangeRec = reportRange.find((r) => r.entityId == sectionId);
    return rangeRec ? (
      <Typography variant="footer">
        {`(Reports: ${rangeRec.startReportNo} - ${rangeRec.endReportNo})`}
      </Typography>
    ) : null;
  };

  const SectionCard = ({ section }) => (
    <Stack
      sx={{
        width: "100%",
        maxWidth: MAX_WIDTH_CONTENT,
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
      {section.sectionNo ? <ReportRangeSection sectionId={section.id} /> : null}
      <Typography dir="rtl" variant="h6a">
        {section.nameArb}
      </Typography>
    </Stack>
  );

  return (
    <Spinner open={fetchingSections || fetchingBook}>
      <BreadCrumbs crumbDefs={crumbDefs} />
      <MainWrapper>
        <Stack alignItems="center" spacing={3}>
          <Typography align="center" variant="h5">
            {bookName(book)}
          </Typography>
          {sections
            .filter((s) => isAdmin || s.sectionNo > 0)
            .map((section) => (
              <SectionCard key={section.id} section={section} />
            ))}
        </Stack>
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
