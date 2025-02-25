import React, { useState } from "react";

interface ExpandableTextProps {
  text: string;
  maxLength?: number;
}

const ExpandableText: React.FC<ExpandableTextProps> = ({ text, maxLength = 50 }) => {
  const [expanded, setExpanded] = useState(false);

  if (text.length <= maxLength) {
    return <span>{text}</span>;
  }

  const displayText = expanded ? text : text.substring(0, maxLength) + "...";

  return (
    <span>
      {displayText}{" "}
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          setExpanded(!expanded);
        }}
        className="underline"
      >
        {expanded ? "Hide" : "More"}
      </a>
    </span>
  );
};

export default ExpandableText;
