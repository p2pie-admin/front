import { mode, transparentize } from "@chakra-ui/theme-tools";

const components = {
  IconButton: {
    variants: {
      primary_bright: (props: any) => ({
        bgGradient: mode(
          "linear(to-br, primary.100, primary.200)",
          "linear(to-br, bg.300, bg.400)"
        )(props),
      }),
      primary_regular: (props: any) => ({
        bgGradient: mode(
          "linear(to-br, primary.200, primary.300)",
          "linear(to-br, bg.400, bg.500)"
        )(props),
      }),
    },
  },

  Button: {
    baseStyle: {
      _hover: {
        filter: "brightness(1.05)",
      },
      _active: {
        filter: "brightness(0.9)",
      },
      boxShadow: "md",
      borderRadius: "lg",
    },
    variants: {
      primary_bright: (props: any) => ({
        bgGradient: mode(
          "linear(to-br, primary.100, primary.200)",
          "linear(to-br, bg.300, bg.400)"
        )(props),
      }),
      primary_regular: (props: any) => ({
        bgGradient: mode(
          "linear(to-br, primary.200, primary.300)",
          "linear(to-br, bg.400, bg.500)"
        )(props),
      }),
      primary_shaded: (props: any) => ({
        bgGradient: mode(
          "linear(to-br, primary.300, primary.400)",
          "linear(to-br, bg.500, bg.600)"
        )(props),
      }),
      primary_dark: (props: any) => ({
        bgGradient: mode(
          "linear(to-br, primary.400, primary.500)",
          "linear(to-br, bg.600, bg.700)"
        )(props),
      }),
      primary_black: (props: any) => ({
        bgGradient: mode(
          "linear(to-br, primary.500, primary.600)",
          "linear(to-br, bg.700, bg.800)"
        )(props),
      }),
      orange_bright: () => ({
        bgGradient: "linear(to-br, orange.200, orange.300)",
      }),
      orange_regular: () => ({
        bgGradient: "linear(to-br, orange.300, orange.400)",
      }),
      orange_dark: () => ({
        bgGradient: "linear(to-br, orange.400, orange.500)",
      }),
      error: () => ({
        bgGradient: "linear(to-br, red.400, red.500)",
      }),
      main: () => ({
        border: "1px",
        borderRadius: "xl",
        borderColor: "whiteAlpha.300",
        bgGradient: "linear(to-br, whiteAlpha.50, whiteAlpha.100)",
        _hover: {
          borderColor: "orange.500",
          bgColor: "bg.700",
        },
      }),
      default: () => ({
        filter: "none",
        transition: "0.2s filter ease-in",
        _hover: {
          filter: "brightness(1.2)",
        },
      }),
    },
  },
};

export default components;
