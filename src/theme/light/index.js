const colors = {
  primary:"#4287f5",
  borderColor: "#d9d9d9",
  cover: "#f0f0f0",
  gray: "#AFAFAF",
  lgray: "#cccccc",
  body: "#a1b747",
  white: "#ffffff",
  editorBackground: "#ffffff",
  dark: "#3a3a3a",
  light: "#ffffff",
  success: "#52cc6e",
  successLight: "#bdfccc",
}

const theme = {
  colors: {...colors},
  block: {
    padding: "2rem",
  },
  transitions: {
    transitionTiming: "cubic-bezier(.76,0,.175,1)",
    transition: "300ms",
    hover: "300ms",
    shadow: "0px 8px 6px rgb(0 27 72 / 4%)",
  },
  spacings: {
    tabPadding: "2rem",
    inputSpacing: "1rem",
    spacer: "1rem",
    gutter: 20,
  },
  font: {
    family: "Montserrat"
  },
  button: {
    padding: "0.5rem 1rem",
    borderRadius: "5px",
    borderColor: colors.borderColor,
    transition: "300ms",
    shadow: "0px 8px 6px rgb(0 27 72 / 4%)",
    shadowHover: "0px 4px 3px rgb(0 27 72 / 4%)"
  },
  inputs: {
    checkSize: "21px",
    spacer: "12px",
  }
}

export default theme;