import React from "react";
import { StyledCanvas } from "./StyledCanvas";

const Canvas = (props) => {

  const {children} = props;

  return (
    <StyledCanvas {...props}>
      {children}
    </StyledCanvas>
  );
}

export default Canvas;
