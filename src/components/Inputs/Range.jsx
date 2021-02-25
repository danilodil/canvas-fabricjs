import React from "react";
import { StyledRange } from "./StyledInputs";

const Check = (props) => {

  const { isRemoveSpace, label, disabled} = props

  return (
    <StyledRange className={`${isRemoveSpace ? "remove-space" : ""} ${disabled ? "disabled" : ""}`}>
      <span>{label}</span> <input {...props} type="range" />
    </StyledRange>
  );
}

export default Check;
