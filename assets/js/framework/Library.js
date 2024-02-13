import React from "react";
import { useQuery } from "react-query";
import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import { request } from "../utils/graph-ql";
import { DialogContext } from "../context/DialogContext";
import BookCover from "../kmui/BookCover";
import FabAddButton from "../kmui/FabAddButton";
import Spinner from "../kmui/Spinner";
import MainWrapper from "./MainWrapper";

const fetchBooks = () =>
  request(`{
    books {
      id 
      nameEng
      authorEng
      librarySeqNo
      volumeNo
      sections {
        id
        sectionNo
        nameEng
        chapters {
          id
          nameEng
        }
      }
    }
  }`).then(({ books }) => books);

export default () => {
  const { openDialog } = React.useContext(DialogContext);
  const { data: books = [], isFetching: isFetching } = useQuery(
    ["books"],
    fetchBooks
  );

  const nextVolSeqNo = Math.max(...books.map((b) => b.volumeNo)) + 1;

  const addBookFields = [
    {
      name: "nameEng",
      label: "Book Name",
      type: "text",
      fullWidth: true,
      size: "small",
      rules: { required: true },
      md: 6,
    },
    {
      name: "volumeNo",
      label: "Vol No",
      type: "number",
      rules: { required: true },
      defaultValue: nextVolSeqNo,
      size: "small",
      sx: { width: 100 },
    },
    {
      name: "authorEng",
      label: "Author",
      fullWidth: true,
      type: "text",
      size: "small",
      rules: { required: true },
      md: 6,
    },
    {
      name: "librarySeqNo",
      label: "Lib Seq No",
      type: "number",
      rules: { required: true },
      size: "small",
      sx: { width: 150 },
    },
  ];

  return (
    <Spinner open={isFetching}>
      <MainWrapper>
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
          spacing={10}
          sx={{ marginTop: 5 }}
        >
          {books.map((b) => (
            <Grid key={b.id}>
              <BookCover
                book={b}
                onEdit={() =>
                  openDialog("dataEntry", {
                    key: b.bookId,
                    title: "Update Book",
                    dataQueryKeys: ["books"],
                    fields: addBookFields,
                    mutationApi: "updateBook",
                    wrapInInput: true,
                    defaultValues: b,
                    basePayload: { id: b.id },
                    deleteApi: "deleteBook",
                    deletePayload: {
                      bookId: b.id,
                    },
                  })
                }
              />
            </Grid>
          ))}
        </Grid>
      </MainWrapper>
      <FabAddButton
        buttonText="Book"
        dataEntryProps={{
          key: nextVolSeqNo,
          title: "Add Book",
          fields: addBookFields,
          dataQueryKeys: ["books"],
          mutationApi: "addBook",
          wrapInInput: true,
        }}
      />
    </Spinner>
  );
};
