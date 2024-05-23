import React from "react";
import { useQuery } from "react-query";
import { request } from "../utils/graph-ql";
import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import Box from "@mui/material/Box";
import { DialogContext } from "../context/DialogContext";
import { SessionContext } from "../context/SessionContext";
import BookCover from "../kmui/BookCover";
import FabAddButton from "../kmui/FabAddButton";
import Spinner from "../kmui/Spinner";
import { HEADER_HEIGHT } from "../consts";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { formatIsoStrToLocal } from "../utils/date";

const fetchBooks = () =>
  request(`{
    books {
      id 
      nameEng
      code
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
  const { mostRecentReport } = React.useContext(SessionContext);
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
      name: "authorEng",
      label: "Author",
      fullWidth: true,
      type: "text",
      size: "small",
      rules: { required: true },
      md: 6,
    },
    {
      name: "code",
      label: "Book Code",
      type: "text",
      fullWidth: true,
      size: "small",
      rules: { required: true },
      md: 4,
    },
    {
      name: "volumeNo",
      label: "Vol No",
      type: "number",
      rules: { required: true },
      defaultValue: nextVolSeqNo,
      size: "small",
      md: 4,
      sx: { width: 100 },
    },
    {
      name: "librarySeqNo",
      label: "Lib Seq No",
      type: "number",
      rules: { required: true },
      defaultValue: 1,
      size: "small",
      md: 4,
      sx: { width: 150 },
    },
  ];

  return (
    <Spinner open={isFetching}>
      <Box sx={{ height: `calc(${HEADER_HEIGHT})` }} />
      <Typography
        variant="h6"
        sx={{ mt: 5, padding: 5, xbackgroundColor: "primary.header2" }}
        align="center"
      >
        Wasail Al Shia is a 30-volume collection. The following volumes are
        currently available in translation:
      </Typography>
      <Container maxWidth="lg">
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
          spacing={10}
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
        <Typography align="center" sx={{ margin: 10 }}>
          (New translations last added on&nbsp;
          {formatIsoStrToLocal(mostRecentReport.insertedAt)})
        </Typography>
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
      </Container>
    </Spinner>
  );
};
