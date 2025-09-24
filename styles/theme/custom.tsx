import {
  background,
  Box,
  Button,
  Text,
  useColorModeValue,
  useToken,
} from "@chakra-ui/react";
import { ReactJSXElement } from "@emotion/react/types/jsx-namespace";
import { ITextVariant, ITone, IVariant } from "../../types/shared";
import { colors3D } from "./colors";

export const CustomBox3D = (props: any) => {
  const { children, ...chakraProps }: { children: ReactJSXElement } = props;
  return (
    <Box3D w="100%" py="4" px="2" {...chakraProps}>
      {children}
    </Box3D>
  );
};

export const RegularBox = (props: any) => {
  const {
    children,
    variant = "extra_contrast",
    ...chakraProps
  }: { children: ReactJSXElement; variant: IVariant } = props;
  const bgVarinats = {
    no_contrast: useColorModeValue("bg.100", "bg.700"),
    contrast: useColorModeValue("bg.50", "bg.800"),
    extra_contrast: useColorModeValue("bg.10", "bg.900"),
  };
  const color = useColorModeValue("bg.700", "bg.100");
  const bgVarinat = bgVarinats[variant];
  return (
    <Box
      borderRadius="2xl"
      position="relative"
      bgColor={bgVarinat}
      color={props.color || color}
      {...chakraProps}
    >
      {children}
    </Box>
  );
};

export const Box3D = (props: any) => {
  const { children, ...chakraProps }: { children: ReactJSXElement } = props;
  return (
    <RegularBox
      // remove real border
      border="none"
      // use inset shadow for border look
      boxShadow={`
        inset 0 0 0 1px rgba(200,200,200,0.1), 
        inset -2px -2px 5px rgba(200,200,200,0.05), 
        inset 2px 2px 5px rgba(0,0,0,0.15), 
        3px 3px 10px -5px rgba(0,0,0,0.5), 
        -3px -3px 10px -5px rgba(200,200,200,0.2)
      `}
      {...chakraProps}
    >
      {children}
    </RegularBox>
  );
};

export const ShadedButton = (props: any) => {
  const { children, ...chakraProps }: { children: ReactJSXElement } = props;
  return (
    <Box
      transition="all .3s ease"
      cursor="pointer"
      bgColor="rgba(200,200,200,0.05)"
      _hover={{
        color: useColorModeValue("violet.800", "peach.100"),
        bgColor: "transparent",
      }}
      _active={{
        color: useColorModeValue("violet.700", "peach.400"),
      }}
      borderRadius="2xl"
      {...chakraProps}
    >
      {children}
    </Box>
  );
};

export const ResponsiveText = (props: any) => {
  const {
    children,
    size = "md",
    variant,
    ...chakraProps
  }: {
    children: ReactJSXElement;
    size?: "xs" | "sm" | "md" | "lg" | "xl";
    variant: ITextVariant;
  } = props;
  const sizes = {
    xs: ["0.65rem", "0.65rem", "xs", "sm"],
    sm: ["xs", "xs", "sm", "md"],
    md: ["sm", "sm", "md", "lg"],
    lg: ["md", "md", "lg", "xl"],
    xl: ["lg", "lg", "xl", "2xl"],
  };
  const variants = {
    xs: "no_contrast",
    sm: "contrast",
    md: "contrast",
    lg: "extra_contrast",
    xl: "extra_contrast",
  };
  const fontSize = sizes[size];

  return (
    <Text
      whiteSpace="nowrap"
      fontSize={fontSize}
      variant={variant || variants[size]}
      {...chakraProps}
    >
      {children}
    </Text>
  );
};

export const ResponsiveButton = (props: any) => {
  const {
    children,
    size,
    ...chakraProps
  }: { children: ReactJSXElement; size?: string } = props;
  // const rSize =
  //   size === "lg"
  //     ? { base: "md", md: "lg", lg: "xl" }
  //     : size === "sm"
  //     ? { base: "xs", md: "sm", lg: "md" }
  //     : size === "xs"
  //     ? { base: "xs", md: "xs", lg: "sm" }
  //     : { base: "sm", md: "md", lg: "lg" }; // md

  return (
    <Button
      whiteSpace="nowrap"
      size={["xs", "sm", "md", "lg"]}
      px={["0.5", "1", "2"]}
      py={["0", "0.5", "1"]}
      // fontSize={fontSize}
      {...chakraProps}
    >
      {children}
    </Button>
  );
};
