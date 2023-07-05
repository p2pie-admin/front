import { Box } from "@chakra-ui/react";
import { mode, StyleConfig } from "@chakra-ui/theme-tools";
import { AnyCnameRecord } from "dns";
import { ITone } from "../../types/shared";
import { colors3D } from "./colors";

const colorNameToHex = (theme: any, colorFullName: string) => {
  const [colorName, colorNumber] = colorFullName.split(".");
  const c = theme.colors[colorName] as any;
  const hex = c[colorNumber];
  return hex || "#fcb597";
};

const createGradient = (theme: any, tone: ITone, glowing = false) => {
  const [bgFrom, bgTo, borderFrom, borderTo, whiteAlpha, shadeTo] = colors3D[
    tone
  ];

  const bgFromHEX = colorNameToHex(theme, bgFrom);
  const bgToHEX = colorNameToHex(theme, bgTo);
  const borderFromHEX = colorNameToHex(theme, borderFrom);
  const borderToHEX = colorNameToHex(theme, borderTo);
  const shadeFromHEX = colorNameToHex(theme, whiteAlpha);
  const shadeToHEX = colorNameToHex(theme, shadeTo);
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

const components: Record<string, StyleConfig> = {
  IconButton: {
    variants: {
      primary_bright: (props: any) => ({
        bgGradient: mode(
          "linear(to-br, peach.100, peach.200)",
          "linear(to-br, bg.300, bg.400)"
        )(props),
      }),
      primary_regular: (props: any) => ({
        bgGradient: mode(
          "linear(to-br, peach.200, peach.300)",
          "linear(to-br, bg.400, bg.500)"
        )(props),
      }),
    },
  },

  Text: {
    variants: {
      no_contrast: (props: any) => ({
        color: mode("bg.600", "bg.400")(props),
      }),
      contrast: (props: any) => ({
        color: mode("bg.800", "bg.200")(props),
      }),
      extra_contrast: (props: any) => ({
        color: mode("bg.1000", "bg.50")(props),
      }),
      primary: (props: any) => ({
        color: mode("violet.700", "peach.200")(props),
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
      error: ({ theme, colorMode }) => {
        return createGradient(theme, "error", true);
      },
      //useColorModeValue("white", "black")
      //useColorModeValue("light", "shaded")
      //useColorModeValue("dark", "gray")
      primary: ({ theme, colorMode }) => {
        return colorMode === "light"
          ? createGradient(theme, "violet", true)
          : createGradient(theme, "peach", true);
      },
      no_contrast: ({ theme, colorMode }) => {
        return colorMode === "light"
          ? createGradient(theme, "gray", true)
          : createGradient(theme, "shaded");
      },
      contrast: ({ theme, colorMode }) => {
        return colorMode === "light"
          ? createGradient(theme, "light", true)
          : createGradient(theme, "dark");
      },
      extra_contrast: ({ theme, colorMode }) => {
        return colorMode === "light"
          ? createGradient(theme, "white", true)
          : createGradient(theme, "black");
      },

      // secondary: ({ theme }) => {
      //   return createGradient(theme, "violet", true);
      // },

      shaded: ({ theme }) => {
        return createGradient(theme, "shaded");
      },

      dark: ({ theme }) => {
        return createGradient(theme, "dark");
      },

      black: ({ theme }) => {
        return createGradient(theme, "black");
      },
      //
      gray: ({ theme }) => {
        return createGradient(theme, "gray", true);
      },
      light: ({ theme }) => {
        return createGradient(theme, "light", true);
      },
      white: ({ theme }) => {
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
// const bgColor = getColor(theme, mode('white', 'gray.800')({ theme }))
