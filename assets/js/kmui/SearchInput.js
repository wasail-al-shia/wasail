import React from "react";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";

export default function SearchInput({ onEnter, clearOnEnter = true }) {
  const [searchStr, setSearchStr] = React.useState("");

  return (
    <>
      <Paper
        sx={{
          border: "1px solid",
          borderColor: "primary.dark",
          borderRadius: "5px",
          height: "30px",
          ml: 10,
          p: "2px 4px",
          display: "flex",
          alignItems: "center",
          width: 250,
          boxShadow: "none",
        }}
      >
        <IconButton size="small">
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
          sx={{ ml: 1, flex: 1 }}
          placeholder="Search"
        />
      </Paper>
    </>
  );
}
