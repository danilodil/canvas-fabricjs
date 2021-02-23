import React, { useState } from "react";
import { StyledTabs, StyledTabsNav, StyledTabsNavItem } from "./StyledTabs";

const Tabs = (props) => {

  const { children } = props;
  const [tabs, setTabs] = useState(children.map((child) => child.props.name));
  const [active, setActive] = useState(0)

  const renderTab = (tab, i) => {
    if (active == i) {
      if (React.isValidElement(tab)) {
        return React.cloneElement(tab, { key: `tsi-${i}`, isActive: active == i });
      }
      return tab;
    }
  }

  return (
    <StyledTabs>
      <StyledTabsNav>
        {tabs.map((tab, i) => <StyledTabsNavItem className={`${active == i ? "active" : ""}`} key={`ti-${i}`} onClick={() => setActive(i)}>{tab}</StyledTabsNavItem>)}
      </StyledTabsNav>
      {children.map((tab, i) => renderTab(tab, i))}
    </StyledTabs>
  );
}

export default Tabs;
