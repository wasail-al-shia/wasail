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
        borderRadius: 1,
        backgroundColor: "primary.main",
        color: "primary.paper",
        padding: "1rem",
        boxShadow: "5px 5px 5px #583c00",
      }}
      spacing={5}
    >
      <Stack
        justifyContent="space-between"
        alignItems="center"
        onClick={() => navigate(navBookLink(book.id))}
        spacing={10}
        sx={{
          padding: "0.5rem",
          borderRadius: 1,
          backgroundColor: "primary.main",
          color: "primary.paper",
          transition: "transform 0.15s ease-in-out",
          "&:hover": {
            border: "1px solid #aaa",
            transform: "scale3d(1.05, 1.05, 1.05)",
            cursor: "pointer",
            filter: "brightness(120%)",
          },
        }}
      >
        <Typography
          variant="h6"
          component="div"
          sx={{ color: "secondary.light" }}
        >
          English Translation
          {isAdmin && (
            <EditNoteIcon
              size="small"
              onClick={(e) => {
                onEdit();
                e.stopPropagation();
              }}
            />
          )}
        </Typography>
        <Typography variant="h4" component="div">
          {book.nameEng}
        </Typography>
        {book.volumeNo > 0 && (
          <Typography variant="h4" component="div">
            Volume {book.volumeNo}
          </Typography>
        )}
        <Typography variant="footer" sx={{ color: "primary.header2" }}>
          ({percentComplete.toFixed(2)}% complete)
        </Typography>
        <Typography variant="h6" sx={{ color: "primary.header2" }}>
          {book.authorEng}
        </Typography>
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
            sx={{
              color: "secondary.light",
              backgroundColor: "primary.main",
              "&:hover": {
                backgroundColor: "primary.main",
                transform: "scale3d(1.05, 1.05, 1.05)",
                border: "1px solid #aaa",
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
      </Stack>
    </Stack>
  );
}
