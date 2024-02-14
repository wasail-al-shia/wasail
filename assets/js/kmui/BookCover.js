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
      <Typography variant="h4" component="div">
        {book.nameEng}
      </Typography>
      {book.volumeNo > 0 && (
        <Typography variant="h4" component="div">
          Vol. {book.volumeNo}
        </Typography>
      )}
      <Typography variant="h6">{book.authorEng}</Typography>
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
