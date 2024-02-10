import React from "react";
import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import { useParams } from "react-router-dom";
import { request } from "../utils/graph-ql";
import { useQuery } from "react-query";
import { DialogContext } from "../context/DialogContext";
import SectionCard from "../kmui/SectionCard";
import FabAddButton from "../kmui/FabAddButton";
import BreadCrumbs from "../kmui/BreadCrumbs";
import Spinner from "../kmui/Spinner";
import MainWrapper from "./MainWrapper";

const fetchBook = ({ queryKey: [_, bookId] }) =>
  request(`{
    book(bookId: ${bookId}) {
      id
      nameEng
      authorEng
      volumeNo
    }
  }`).then(({ book }) => book);
const fetchSections = ({ queryKey: [_, bookId] }) =>
  request(`{
    sections(bookId: ${bookId}) {
      id
      bookId
      sectionNo
      nameEng
      nameArb
      descEng
      descArb
    }
  }`).then(({ sections }) => sections);

export default () => {
  const { bookId } = useParams();
  const { openDialog } = React.useContext(DialogContext);
  const { data: sections = [], isFetching: fetchingSections } = useQuery(
    ["sections", bookId],
    fetchSections
  );
  const { data: book = {}, isFetching: fetchingBook } = useQuery(
    ["book", bookId],
    fetchBook
  );

  const nextSeqNo = Math.max(...sections.map((s) => s.sectionNo)) + 1;

  const dialogFields = [
    {
      name: "sectionNo",
      label: "Section No",
      type: "number",
      size: "small",
      sx: { width: 120 },
      defaultValue: nextSeqNo,
      rules: { required: true },
      md: 4,
    },
    {
      name: "nameEng",
      label: "Section Name",
      type: "text",
      size: "small",
      fullWidth: true,
      md: 12,
    },
    {
      name: "descEng",
      label: "Desc Eng",
      type: "text",
      size: "small",
      multiline: true,
      rows: 3,
      fullWidth: true,
      md: 12,
    },
    {
      name: "descArb",
      label: "Desc Arb",
      type: "text",
      size: "small",
      multiline: true,
      rows: 3,
      fullWidth: true,
      md: 12,
    },
  ];

  const crumbDefs = [
    {
      id: "lib",
      to: "/",
      crumbName: "Library",
    },
    {
      id: "name",
      crumbName:
        book.nameEng + (book.volumeNo > 0 ? " Vol. " + book.volumeNo : ""),
    },
  ];

  return (
    <Spinner open={fetchingSections || fetchingBook}>
      <BreadCrumbs crumbDefs={crumbDefs} />
      <MainWrapper hasBreadcrumbs={true}>
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="flex-start"
          spacing={10}
          sx={{ marginTop: 5 }}
        >
          {sections.map((s) => (
            <Grid key={s.id}>
              <SectionCard
                section={s}
                onEdit={() =>
                  openDialog("dataEntry", {
                    key: s.id,
                    title: "Update Section",
                    dataQueryKeys: ["sections"],
                    fields: dialogFields,
                    mutationApi: "updateSection",
                    defaultValues: s,
                    basePayload: {
                      bookId: book.id,
                      sectionId: s.id,
                      sectionNo: s.sectionNo,
                    },
                    deleteApi: "deleteSection",
                    deletePayload: {
                      sectionId: s.id,
                    },
                  })
                }
              />
            </Grid>
          ))}
        </Grid>
      </MainWrapper>
      <FabAddButton
        buttonText="Add Section"
        dataEntryProps={{
          key: nextSeqNo,
          title: "Add Section",
          fields: dialogFields,
          dataQueryKeys: ["sections"],
          mutationApi: "addSection",
          basePayload: { bookId: book.id },
        }}
      />
    </Spinner>
  );
};
