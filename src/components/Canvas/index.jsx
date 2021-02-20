import React from "react";
import { StyledCanvas } from "./StyledCanvas";

const Canvas = ({ children }) => {

  return (
    <StyledCanvas>
      {children}
    </StyledCanvas>
  );
}

export default Canvas;
