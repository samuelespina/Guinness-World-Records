import React, { useEffect, useRef } from "react";
import { ttText } from "./ToolTip.types";

const ToolTip = (props: ttText) => {
  const ttOpacity = useRef<HTMLInputElement>(null);

  useEffect(() => {
    ttOpacity.current
      ? props.isOpen
        ? ttOpacity.current.classList.add("active")
        : ttOpacity.current.classList.remove("active")
      : "";
  }, [props.isOpen]);

  return (
    <div ref={ttOpacity} className="tool-tip">
      <p>{props.text}</p>
    </div>
  );
};

export default ToolTip;
