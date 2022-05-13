import { Icon, IconButton } from "@material-ui/core";
import React, { useState } from "react";
import Snackbar from "@mui/material/Snackbar";
import DeleteIcon from "@mui/icons-material/Delete";
import "./Block.css";
const Block = ({ item, deleteResponse }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="container">
      <div className="date-time-box">{item.timestamp}</div>
      <div className="left">
        <div className="upper">
          <div className="upper-left">Prompt:</div>
          <div className="upper-right">{item.prompt}</div>
        </div>
        <div className="lower">
          <div className="lower-left">Response:</div>
          <div className="lower-right">{item.response}</div>
        </div>
      </div>
      <div className="right">
        <IconButton
          onClick={() => {
            setOpen(true);
            deleteResponse(item.id);
          }}
        >
          <DeleteIcon fontSize="medium" sx={{ color: "red" }} />
        </IconButton>
      </div>
      <Snackbar
        open={open}
        autoHideDuration={1000}
        onClose={() => setOpen(false)}
        message="Reponse Deleted"
      />
    </div>
  );
};

export default Block;
