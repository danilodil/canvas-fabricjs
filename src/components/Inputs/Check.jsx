import React from "react";
import { StyledCheck } from "./StyledInputs";

const Check = (props) => {

  const { label, isRemoveSpace } = props

  return (
    <StyledCheck className={`${isRemoveSpace ? "remove-space" : ""}`}>
      {label ? label : " "}
      <input {...props} type="checkbox" />
      <span className="checkmark"></span>
    </StyledCheck>
  );
}

export default Check;
