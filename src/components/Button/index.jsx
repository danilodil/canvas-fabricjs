import React from "react";
import { StyledButtonPrimary, StyledButton } from "./StyledButtons";

const Button = (props) => {

  const { children, variant } = props;

  const render = () => {
    switch (variant) {
      case "light":
        return <StyledButton {...props}>
          {children}
        </StyledButton>
      case "success":
        return <StyledButton {...props} className="success">
          {children}
        </StyledButton>
      case "success-light":
        return <StyledButton {...props} className="success-light">
          {children}
        </StyledButton>
      case "primary":
      default:
        return <StyledButton {...props} className="primary">
          {children}
        </StyledButton>

    }
  }

  return render();
}

export default Button;
