import { extendTheme, ThemeConfig } from "@chakra-ui/react";
import { createBreakpoints, mode } from "@chakra-ui/theme-tools";
import components from "./components";
import colors from "./colors";

const breakpoints = createBreakpoints({
  xs: "26rem",
  sm: "30rem",
  md: "48rem",
  lg: "62rem",
  xl: "80rem",
  "2xl": "96rem",
});

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
      bg: mode("bg.300", "bg.900")(props),
      color: "bg.100",
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
