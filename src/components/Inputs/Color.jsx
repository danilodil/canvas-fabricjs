import React from "react";
import { StyledColor } from "./StyledInputs";

const Color = (props) => {

  const { label, isRemoveSpace, disabled } = props

  return (
    <StyledColor className={`${isRemoveSpace ? "remove-space" : ""} ${disabled ? "disabled" : ""}`}>
      <input {...props} type="color" />
      &nbsp;{label}
    </StyledColor>
  );
}

export default Color;
