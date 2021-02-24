import React from "react";
import { StyledRange } from "./StyledInputs";

const Check = (props) => {

  const { isRemoveSpace, label} = props

  return (
    <StyledRange className={`${isRemoveSpace ? "remove-space" : ""}`}>
      <span>{label}</span> <input {...props} type="range" />
    </StyledRange>
  );
}

export default Check;
