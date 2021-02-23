import React from "react";
import { StyledLayout } from "./StyledLayout";

const Layout = ({ children }) => {

  return (
    <StyledLayout>
      {children}
    </StyledLayout>
  );
}

export default Layout;
