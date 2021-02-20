import React from "react";

import "./Icon.scss";

const Icon = ({ variant, className }) => {

  const renderIcon = () => {
    switch (variant) {
      case "arrow-right":
        return (<svg className={`app-icon ${className ? className : ""}`} width="14" height="14" viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg"><path d="M13.9,7.4c0.1-0.2,0.1-0.5,0-0.8c-0.1-0.1-0.1-0.2-0.2-0.3l-6-6c-0.4-0.4-1-0.4-1.4,0s-0.4,1,0,1.4L10.6,6H1
        C0.4,6,0,6.4,0,7s0.4,1,1,1h9.6l-4.3,4.3c-0.4,0.4-0.4,1,0,1.4C6.5,13.9,6.7,14,7,14s0.5-0.1,0.7-0.3l6-6
        C13.8,7.6,13.9,7.5,13.9,7.4z"/></svg>);

      case 'chevron-left':
        return (
          <svg
            className={`app-icon ${className ? className : ''}`}
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            width="6px"
            height="10.5px"
            viewBox="0 0 6 10.5">
            <path d="M5.8,9.2c0.3,0.3,0.3,0.8,0,1.1c-0.3,0.3-0.8,0.3-1.1,0L0.2,5.8c-0.3-0.3-0.3-0.7,0-1l4.1-4.5c0.3-0.3,0.8-0.3,1.1,0c0.3,0.3,0.3,0.8,0,1.1l-3.6,4L5.8,9.2z" />
          </svg>
        );

      case "chevron-down":
        return (<svg className={`app-icon ${className ? className : ""}`} xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="12px" height="7px" viewBox="0 0 12 7"><path d="M6,4.4L1.8,0.3c-0.4-0.4-1.1-0.4-1.5,0c-0.4,0.4-0.4,1.1,0,1.5l4.9,4.9l0,0
         c0.4,0.4,1.1,0.4,1.5,0l4.9-4.9C11.9,1.6,12,1.4,12,1.1c0-0.3-0.1-0.6-0.3-0.7c-0.4-0.4-1.1-0.4-1.5,0L6,4.4z"/>
        </svg>)

      case "chevron-right":
        return (<svg className={`app-icon ${className ? className : ""}`} xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 6 10.5">
          <path d="M0.2,9.2c-0.3,0.3-0.3,0.8,0,1.1c0.3,0.3,0.8,0.3,1.1,0l4.5-4.5c0.3-0.3,0.3-0.7,0-1L1.3,0.2C1-0.1,0.5-0.1,0.2,0.2c-0.3,0.3-0.3,0.8,0,1.1l4,4L0.2,9.2z" />
        </svg>)

      case "close":
        return (
          <svg className={`app-icon ${className ? className : ""}`} version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20px" height="20px" viewBox="0 0 20 20">
            <path d="M12.1,10l6.9-6.9c0.6-0.6,0.6-1.5,0-2.1c-0.6-0.6-1.5-0.6-2.1,0L10,7.9L3.1,0.9c-0.6-0.6-1.5-0.6-2.1,0
	c-0.6,0.6-0.6,1.5,0,2.1L7.9,10l-6.9,6.9c-0.6,0.6-0.6,1.5,0,2.1c0.3,0.3,0.7,0.4,1.1,0.4s0.8-0.1,1.1-0.4l6.9-6.9l6.9,6.9
	c0.3,0.3,0.7,0.4,1.1,0.4s0.8-0.1,1.1-0.4c0.6-0.6,0.6-1.5,0-2.1L12.1,10z"/>
          </svg>
        )
      case "loader":
        return (<svg className={`circular ${className ? className : ""}`} viewBox="25 25 50 50"><circle className={`path`} cx="50" cy="50" r="20" fill="none" strokeWidth="4" strokeMiterlimit="10" /></svg>)

      case "undo":
        return <svg className={`app-icon ${className ? className : ""}`} xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="408px" height="497.3px" viewBox="0 0 408 497.3">
          <path d="M204,89.3V0L76.5,127.5L204,255V140.3c84.1,0,153,68.9,153,153s-68.9,153-153,153s-153-68.9-153-153H0c0,112.2,91.8,204,204,204s204-91.8,204-204S316.2,89.3,204,89.3z" />
        </svg>

      case "redo":
        return <svg className={`app-icon ${className ? className : ""}`} xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="408px" height="497.3px" viewBox="0 0 408 497.3">
          <path d="M0,293.3c0,112.2,91.8,204,204,204s204-91.8,204-204h-51c0,84.1-68.9,153-153,153s-153-68.9-153-153s68.9-153,153-153V255l127.5-127.5L204,0v89.3C91.8,89.3,0,181,0,293.3z" />
        </svg>
    }
  }

  return (
    renderIcon()
  );
}

export default Icon;