import React from "react";
import { StyledRow } from "./StyledLayout";

const Row = ({ children }) => {

  return (
    <StyledRow>
      {children}
    </StyledRow>
  );
}

export default Row;
