import React from "react";
import { StyledTab } from "./StyledTabs";

const Tab = ({ children }) => {

  return (
    <StyledTab>
      {children}
    </StyledTab>
  );
}

export default Tab;
