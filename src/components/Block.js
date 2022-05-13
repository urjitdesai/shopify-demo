import React from "react";
import "./Block.css";
const Block = ({ item }) => {
  return (
    <div className="container">
      <div className="date-time-box">{item.timestamp}</div>
      <div className="upper">
        <div className="upper-left">Prompt:</div>
        <div className="upper-right">{item.prompt}</div>
      </div>
      <div className="lower">
        <div className="lower-left">Response:</div>
        <div className="lower-right">{item.response}</div>
      </div>
    </div>
  );
};

export default Block;
