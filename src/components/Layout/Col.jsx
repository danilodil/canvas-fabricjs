import React from "react";
import { StyledCol } from "./StyledLayout";

const Col = ({ children }) => {

  return (
    <StyledCol>
      {children}
    </StyledCol>
  );
}

export default Col;
