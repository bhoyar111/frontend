import React, { useState } from "react";

const TruncateText = ({ text, limit = 20 }) => {
  const [showFull, setShowFull] = useState(false);

  if (!text) return null;

  const toggleShow = () => setShowFull(!showFull);

  return (
    <span>
      {showFull ? text : text.substring(0, limit)}
      {text.length > limit && (
        <button
          className="btn btn-link p-0 ms-1"
          style={{ fontSize: "12px" }}
          onClick={toggleShow}
        >
          {showFull ? "Show less" : "Show more"}
        </button>
      )}
    </span>
  );
};

export default TruncateText;
