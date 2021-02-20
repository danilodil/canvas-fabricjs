const colors = {
  primary:"#def3ff",
  borderColor: "#d9d9d9",
  cover: "#f0f0f0",
  gray: "#AFAFAF",
  body: "#a1b747",
  white: "#ffffff",
  editorBackground: "#ffffff",
  dark: "#3a3a3a",
  light: "#ffffff",
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
    tabPadding: "4rem 2rem 2rem 2rem",
  },
  button: {
    padding: "0.5rem 1rem",
    borderRadius: "5px",
    borderColor: colors.borderColor,
    transition: "300ms",
    shadow: "0px 8px 6px rgb(0 27 72 / 4%)",
    shadowHover: "0px 4px 3px rgb(0 27 72 / 4%)"
  }
}

export default theme;