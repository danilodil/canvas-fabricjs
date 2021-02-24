import React from "react";
import { StyledBlock } from "./StyledBlock";

const Block = ({ children }) => {

  return (
    <StyledBlock>
      {children}
    </StyledBlock>
  );
}

export default Block;
