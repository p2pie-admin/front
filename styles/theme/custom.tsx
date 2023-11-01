import {
  background,
  Box,
  Text,
  useColorModeValue,
  useToken,
} from "@chakra-ui/react";
import { ReactJSXElement } from "@emotion/react/types/jsx-namespace";
import { ITone, IVariant } from "../../types/shared";
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
      border="1px solid"
      borderColor="rgba(200,200,200,0.1)"
      boxShadow="inset -2px -2px 5px rgba(200,200,200,0.05), inset 2px 2px 5px  rgba(0,0,0,0.15), 3px 3px 10px -5px rgba(0,0,0,0.5), -3px -3px 10px -5px rgba(200,200,200,0.2)"
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
        color: useColorModeValue("violet.600", "peach.400"),
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
    variant,
    ...chakraProps
  }: { children: ReactJSXElement; variant?: IVariant } = props;
  const sizes =
    variant === "extra_contrast"
      ? { base: "xl", md: "2xl", lg: "3xl" }
      : variant === "contrast"
      ? { base: "md", md: "lg", lg: "xl" }
      : variant === "no_contrast"
      ? { base: "0.65rem", md: "xs", lg: "sm" }
      : { base: "xs", md: "sm", lg: "md" };

  return (
    <Text
      whiteSpace="nowrap"
      fontSize={sizes}
      variant={variant || "contrast"}
      {...chakraProps}
    >
      {children}
    </Text>
  );
};
