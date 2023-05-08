import { lighten, getColor, mode } from "@chakra-ui/theme-tools";
import { AnyCnameRecord } from "dns";
import { ITone } from "../../types/shared";
import { colors3D } from "./colors";

const createGradient = (theme: any, tone: ITone, glowing = false) => {
  const [bgFrom, bgTo, borderFrom, borderTo, whiteAlpha, shadeTo] = colors3D[
    tone
  ];
  const bgFromHEX = getColor(theme, bgFrom);
  const bgToHEX = getColor(theme, bgTo);
  const borderFromHEX = getColor(theme, borderFrom);
  const borderToHEX = getColor(theme, borderTo);
  const shadeFromHEX = getColor(theme, whiteAlpha);
  const shadeToHEX = getColor(theme, shadeTo);
  const glowingShadow = `-2px -2px 15px -8px ${shadeFromHEX}, 2px 2px 15px -8px ${shadeToHEX}`;
  const regularShadow = `-2px -2px 5px ${shadeFromHEX}, 2px 2px 5px ${shadeToHEX}`;

  return {
    color: glowing ? "bg.800" : "bg.100",
    border: "1px solid",
    borderColor: "transparent",
    boxShadow: glowing ? glowingShadow : regularShadow,
    background: `linear-gradient(150deg, ${bgFromHEX}, ${bgToHEX}) padding-box, 
    linear-gradient(150deg, ${borderFromHEX}, ${borderToHEX}) border-box`,
  };
};

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
      // эти стили добавятся ко всем прочим только если будет выбран какой-то вариант
      filter: "none",
      minH: "10",
      borderRadius: "2xl",
      transition: "0.2s filter ease-in",
      _hover: {
        filter: "brightness(1.2)",
      },
      _active: {
        filter: "brightness(0.9)",
      },
    },
    variants: {
      error: ({ theme }: { theme: any }) => {
        return createGradient(theme, "error", true);
      },

      primary: ({ theme }: { theme: any }) => {
        return createGradient(theme, "primary", true);
      },

      secondary: ({ theme }: { theme: any }) => {
        return createGradient(theme, "secondary", true);
      },

      shaded: ({ theme }: { theme: any }) => {
        return createGradient(theme, "shaded");
      },

      dark: ({ theme }: { theme: any }) => {
        return createGradient(theme, "dark");
      },

      black: ({ theme }: { theme: any }) => {
        return createGradient(theme, "black");
      },
      gray: ({ theme }: { theme: any }) => {
        return createGradient(theme, "gray", true);
      },
      light: ({ theme }: { theme: any }) => {
        return createGradient(theme, "light", true);
      },
      white: ({ theme }: { theme: any }) => {
        return createGradient(theme, "white", true);
      },

      default: () => ({}),
    },
  },
};

export default components;

// its possible to pass extra parameters like that:
// const { theme, fromcolor, tocolor } = props
// const lgFrom = getColor(theme, fromcolor)
// const lgTo = getColor(theme, tocolor)
// const bgColor = getColor(theme, mode('white', 'gray.800')(props))
