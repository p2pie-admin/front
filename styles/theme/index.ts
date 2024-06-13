import { extendTheme, ThemeConfig } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";
import components from "./components";
import colors from "./colors";

const breakpoints = {
  xs: "26rem",
  sm: "30rem",
  md: "48rem",
  lg: "62rem",
  xl: "80rem",
  "2xl": "96rem",
};

const config: ThemeConfig = {
  initialColorMode: "dark",
  useSystemColorMode: false,
};

const shadows = { outline: "0 !important" };

const fonts = {
  logo: "Dosis",
};

const styles = {
  global: (props: any) => ({
    body: {
      bg: mode("bg.200", "bg.900")(props),
      color: "bg.100",
    },
    h1: {
      fontSize: ["4xl", "3xl"],
      fontWeight: "bold",
      my: "3",
      color: mode("violet.600", "peach.200")(props),
    },
    h2: {
      fontSize: ["2xl", "xl"],
      my: "2",
      color: mode("bg.800", "bg.200")(props),
    },
    h3: {
      fontSize: ["lg", "md"],
      my: "1",
      color: mode("bg.600", "bg.400")(props),
    },
    a: {
      color: "pink.400",
      _hover: {
        textDecoration: "underline",
      },
    },
  }),
};

const theme = extendTheme({
  colors,
  breakpoints,
  config,
  styles,
  shadows,
  fonts,
  components,
});
export default theme;
