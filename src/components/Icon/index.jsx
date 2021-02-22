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

      case "close-radial":
        return <svg className={`app-icon ${className ? className : ""}`} xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="512px" height="512px" viewBox="0 0 512 512">
          <g>
            <path d="M256,0C114.8,0,0,114.8,0,256s114.8,256,256,256s256-114.8,256-256S397.2,0,256,0z M256,475.4C135,475.4,36.6,377,36.6,256S135,36.6,256,36.6S475.4,135,475.4,256S377,475.4,256,475.4z" />
            <path d="M281.9,256l78.5-78.5c7.1-7.1,7.1-18.7,0-25.9c-7.1-7.1-18.7-7.1-25.9,0L256,230.1l-78.5-78.5c-7.1-7.1-18.7-7.1-25.9,0c-7.1,7.1-7.1,18.7,0,25.9l78.5,78.5l-78.5,78.5c-7.1,7.1-7.1,18.7,0,25.9c3.6,3.6,8.2,5.4,12.9,5.4s9.4-1.8,12.9-5.4l78.5-78.5l78.5,78.5c3.6,3.6,8.3,5.4,12.9,5.4s9.4-1.8,12.9-5.4c7.1-7.1,7.1-18.7,0-25.9L281.9,256z" />
          </g>
        </svg>

      case "horizontal":
        return <svg className={`app-icon ${className ? className : ""}`} xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="512px" height="448px" viewBox="0 0 512 448">
          <path d="M496,416H336c-8.8,0-16-7.2-16-16V48c0-7.5,5.3-14,12.6-15.6c7.5-1.6,14.8,2.2,18,9l160,352c2.3,5,1.8,10.7-1.1,15.3C506.5,413.2,501.4,416,496,416L496,416z M352,384h119.2L352,121.9V384z" />
          <path d="M176,416H16c-5.4,0-10.5-2.8-13.5-7.3c-2.9-4.6-3.4-10.3-1.1-15.3l160-352c3.1-6.9,10.5-10.7,18-9C186.7,34,192,40.5,192,48v352C192,408.8,184.8,416,176,416z M40.8,384H160V121.9L40.8,384z" />
          <path d="M240,0h32v448h-32V0z" />
        </svg>

      case "vertical":
        return <svg className={`app-icon ${className ? className : ""}`} xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="448px" height="512px" viewBox="0 0 448 512">
          <path d="M48,512c-3,0-6-0.9-8.7-2.5c-4.6-3-7.3-8-7.3-13.5V336c0-8.8,7.2-16,16-16h352c7.5,0,14,5.3,15.6,12.6c1.6,7.4-2.2,14.8-9,18l-352,160C52.5,511.5,50.3,512,48,512L48,512z M64,352v119.2L326.1,352H64z" />
          <path d="M400,192H48c-8.8,0-16-7.2-16-16V16c0-5.4,2.8-10.5,7.3-13.5c4.6-3,10.3-3.4,15.3-1.1l352,160c6.9,3.1,10.6,10.6,9,18C414,186.8,407.5,192,400,192L400,192z M64,160h262.1L64,40.9V160z" />
          <path d="M0,240h448v32H0L0,240z" />
        </svg>

      case "cursor":
        return <svg className={`app-icon ${className ? className : ""}`} xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="347.5px" height="512px" viewBox="0 0 347.5 512">
          <g>
            <path d="M347.5,319.3L0.2,0L0,471.7l105.4-100.8L167.3,512l96.6-42.4l-61.9-141.1L347.5,319.3z M224.3,454.2l-41.6,18.3l-67.1-152.9L30,401.5l0.2-333.2l245.3,225.5l-118.2,7.5L224.3,454.2z"/>
          </g>
        </svg>
    }
  }

  return (
    renderIcon()
  );
}

export default Icon;