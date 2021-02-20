import React from "react";
import { StyledTabActions } from "./StyledTabs";

const TabActions = ({ children }) => {

  return (
    <StyledTabActions>
      {children}
    </StyledTabActions>
  );
}

export default TabActions;
