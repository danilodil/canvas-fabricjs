import React from "react";
import { StyledTab } from "./StyledTabs";

const Tab = ({ children, name, isActive }) => {

  return (
    <StyledTab className={`${isActive ? "active" : ""}`}>
      {children}
    </StyledTab>
  );
}

export default Tab;
