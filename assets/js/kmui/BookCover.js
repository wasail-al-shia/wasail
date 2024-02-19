import React from "react";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import { request } from "../utils/graph-ql";
import EditNoteIcon from "@mui/icons-material/EditNote";
import DownloadIcon from "@mui/icons-material/Download";
import { SessionContext } from "../context/SessionContext";
import { navBookLink } from "../utils/app";
import { useDownload } from "../hooks/useDownload";
import Tooltip from "@mui/material/Tooltip";

const fetchPercentComplete = ({ queryKey: [_, bookId] }) =>
  request(`{
    percentComplete(bookId: ${bookId})
  }`).then(({ percentComplete }) => percentComplete);

export default function ({ book, onEdit }) {
  const navigate = useNavigate();
  const { isAdmin } = React.useContext(SessionContext);
  const url = "rest/download_book/";
  const { download } = useDownload(url);
  const { data: percentComplete = 0 } = useQuery(
    ["percentComplete", book.id],
    fetchPercentComplete
  );
  return (
    <Stack
      justifyContent="space-between"
      alignItems="center"
      onClick={() => navigate(navBookLink(book.id))}
      sx={{
        paddingTop: "2rem",
        paddingBottom: "1rem",
        paddingLeft: "0.5rem",
        paddingRight: "0.5rem",
        height: "18rem",
        width: "13rem",
        borderRadius: 1,
        backgroundColor: "primary.main",
        color: "primary.paper",
        transition: "transform 0.15s ease-in-out",
        "&:hover": {
          transform: "scale3d(1.05, 1.05, 1.05)",
          cursor: "pointer",
          filter: "brightness(120%)",
          //backgroundImage: "linear-gradient(rgb(0 0 0/20%) 0 0)",
        },
      }}
    >
      <Tooltip placement="top" title="Read translation onlline">
        <Button color="secondary" variant="contained" size="small">
          English Translation
        </Button>
      </Tooltip>
      <Typography variant="h4" component="div">
        {book.nameEng}
      </Typography>
      {book.volumeNo > 0 && (
        <Typography variant="h4" component="div">
          Vol. {book.volumeNo}
        </Typography>
      )}
      <Typography variant="footer">
        ({percentComplete.toFixed(2)}% complete)
      </Typography>
      <Typography variant="h6">{book.authorEng}</Typography>
      <Tooltip title="Download Full Arabic Text">
        <Button
          size="small"
          variant="contained"
          color="secondary"
          startIcon={<DownloadIcon />}
          onClick={(e) => {
            download({ bookCode: book.code, volumeNo: book.volumeNo });
            e.stopPropagation();
          }}
        >
          Original Arabic
        </Button>
      </Tooltip>
      {isAdmin && (
        <Stack direction="row">
          <EditNoteIcon
            size="small"
            onClick={(e) => {
              onEdit();
              e.stopPropagation();
            }}
          />
        </Stack>
      )}
    </Stack>
  );
}
