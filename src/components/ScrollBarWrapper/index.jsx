import React from "react";
import { StyledScrollBarWrapper } from "./StyledScrollBarWrapper";
import SmoothScrollBar from "react-smooth-scrollbar";

const ScrollBarWrapper = ({ children }) => {

  return (
    <StyledScrollBarWrapper>
      <SmoothScrollBar alwaysShowTracks={true} className="scroll-bar-inner">
        {children}
      </SmoothScrollBar>
    </StyledScrollBarWrapper>
  );
}

export default ScrollBarWrapper;
