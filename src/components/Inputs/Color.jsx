import React from "react";
import { StyledColor } from "./StyledInputs";

const Color = (props) => {

  const { label, isRemoveSpace } = props

  return (
    <StyledColor className={`${isRemoveSpace ? "remove-space" : ""}`}>
      <input {...props} type="color" />
      &nbsp;{label}
    </StyledColor>
  );
}

export default Color;
