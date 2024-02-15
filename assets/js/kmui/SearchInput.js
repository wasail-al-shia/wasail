import React from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";

export default function SearchInput({ onEnter, clearOnEnter = false }) {
  const [searchStr, setSearchStr] = React.useState("");

  return (
    <Box
      sx={{
        border: "1px solid",
        borderColor: "primary.dark",
        backgroundColor: "#fff",
        borderRadius: 1,
        height: "1.8rem",
        p: "2px 2px",
        display: "flex",
        alignItems: "center",
        width: "15rem",
        boxShadow: "none",
      }}
    >
      <IconButton sx={{ color: "primary.main" }} size="small">
        <SearchIcon />
      </IconButton>
      <InputBase
        value={searchStr}
        onChange={(event) => setSearchStr(event.target.value)}
        onKeyPress={(event) => {
          if (event.key === "Enter" && searchStr.trim().length > 2) {
            onEnter(searchStr);
            if (clearOnEnter) setSearchStr("");
          }
        }}
        sx={{ mt: 1, ml: 1, flex: 1 }}
        placeholder="Search"
      />
    </Box>
  );
}
