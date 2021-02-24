import React from "react";
import { StyledTab } from "./StyledTabs";

const Tab = ({ children, name, isActive, isDisabled }) => {

  return (
    <StyledTab className={`${isActive ? "active" : ""} ${isDisabled ? "disabled" : ""}`}>
      {children}
    </StyledTab>
  );
}

export default Tab;
