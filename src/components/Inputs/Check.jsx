import React from "react";
import { StyledCheck } from "./StyledInputs";

const Check = (props) => {

  const { label, isRemoveSpace, disabled } = props

  return (
    <StyledCheck className={`${isRemoveSpace ? "remove-space" : ""} ${disabled ? "disabled" : ""}`}>
      {label ? label : " "}
      <input {...props} type="checkbox" />
      <span className="checkmark"></span>
    </StyledCheck>
  );
}

export default Check;
