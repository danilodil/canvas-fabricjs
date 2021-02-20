import React, {useState} from "react";
import { StyledSidebar, StyledSidebarClose, StyledSidebarShow } from "./StyledSidebar";
import Icon from "../Icon";

const Sedebar = ({ isActive, children }) => {

  const [active, setActive] = useState(isActive);

  return (
    <StyledSidebar isActive={active}>
      <StyledSidebarClose onClick={()=>setActive(!active)}><Icon variant="close" /></StyledSidebarClose>
      <StyledSidebarShow isActive={!active} onClick={()=>setActive(!active)}><Icon variant="chevron-left" /></StyledSidebarShow>
      {children}
    </StyledSidebar>
  );
}

export default Sedebar;
