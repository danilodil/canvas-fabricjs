import React from "react";
import { StyledContainer } from "./StyledLayout";

const Container = ({ children }) => {

  return (
    <StyledContainer>
      {children}
    </StyledContainer>
  );
}

export default Container;
