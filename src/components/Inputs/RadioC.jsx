import React from "react";
import { StyledRadio } from "./StyledInputs";

const RadioC = (props) => {

  const { label, isRemoveSpace, disabled} = props

  return (
    <StyledRadio className={`${isRemoveSpace ? "remove-space" : ""} ${disabled ? "disabled" : ""}`}>
      {label ? label : " "}
      <input {...props} type="checkbox"/>
      <span className="checkmark"></span>
    </StyledRadio>
  );
}

export default RadioC;
