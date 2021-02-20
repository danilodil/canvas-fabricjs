import React from "react";
import { StyledButtonPrimary, StyledButtonLight } from "./StyledButtons";

const Button = (props) => {

  const { children, variant } = props;

  const render = () => {
    switch (variant) {
      case "light":
        return <StyledButtonLight {...props}>
          {children}
        </StyledButtonLight>
      case "primary":
      default:
        return <StyledButtonPrimary {...props}>
          {children}
        </StyledButtonPrimary>

    }
  }

  return render();
}

export default Button;
