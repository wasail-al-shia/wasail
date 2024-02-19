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
import { HtmlTooltip } from "./HtmlTooltip";

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
      sx={{
        height: "18rem",
        width: "13rem",
        borderRadius: 1,
        backgroundColor: "primary.main",
        color: "primary.paper",
        padding: "1rem",
      }}
      spacing={5}
    >
      <Stack
        justifyContent="space-between"
        alignItems="center"
        onClick={() => navigate(navBookLink(book.id))}
        spacing={10}
        sx={{
          paddingTop: "0.5rem",
          borderRadius: 1,
          backgroundColor: "primary.main",
          color: "primary.paper",
          transition: "transform 0.15s ease-in-out",
          "&:hover": {
            border: "2px solid #fff",
            transform: "scale3d(1.05, 1.05, 1.05)",
            cursor: "pointer",
            filter: "brightness(120%)",
          },
        }}
      >
        <Typography variant="h6" component="div">
          English Translation
        </Typography>
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
      </Stack>
      <Stack>
        <HtmlTooltip
          title={
            <Typography variant="h6">Download Full Arabic Text</Typography>
          }
        >
          <Button
            size="small"
            variant="contained"
            color="secondary"
            sx={{
              backgroundColor: "primary.main",
              "&:hover": {
                backgroundColor: "primary.main",
                transform: "scale3d(1.05, 1.05, 1.05)",
                border: "2px solid #fff",
                cursor: "pointer",
                filter: "brightness(120%)",
              },
            }}
            startIcon={<DownloadIcon />}
            onClick={(e) => {
              download({ bookCode: book.code, volumeNo: book.volumeNo });
              e.stopPropagation();
            }}
          >
            Original Arabic
          </Button>
        </HtmlTooltip>
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
    </Stack>
  );
}
