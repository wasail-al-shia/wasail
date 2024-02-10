import React from "react";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import EditNoteIcon from "@mui/icons-material/EditNote";
import { SessionContext } from "../context/SessionContext";
import { navBookLink } from "../utils/app";

export default function ({ book, onEdit }) {
  const navigate = useNavigate();
  const { isAdmin } = React.useContext(SessionContext);
  return (
    <Stack
      justifyContent="space-between"
      alignItems="center"
      onClick={() => navigate(navBookLink(book.id))}
      sx={{
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 5,
        paddingRight: 5,
        width: 200,
        height: 200 * 1.3,
        border: "1px solid gray",
        backgroundColor: "primary.main",
        color: "#fff",
        transition: "transform 0.15s ease-in-out",
        "&:hover": {
          transform: "scale3d(1.05, 1.05, 1.05)",
          cursor: "pointer",
        },
      }}
    >
      <Typography variant="h4" component="div">
        {book.nameEng}
      </Typography>
      {book.volumeNo > 0 && (
        <Typography variant="h4" component="div">
          Vol. {book.volumeNo}
        </Typography>
      )}
      <Typography variant="h5">{book.authorEng}</Typography>
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
