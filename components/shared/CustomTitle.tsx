import {
  useToken,
  Text,
  useColorModeValue,
  Box,
  Heading,
  BoxProps,
} from "@chakra-ui/react";
import React from "react";

type CustomTitleProps = {
  as: "h1" | "h2" | "h3";
  title: string;
  subtitle?: string;
} & BoxProps;

export default function ({ as, title, subtitle, ...props }: CustomTitleProps) {
  const [peripheryColor, centerColor] = useToken(
    "colors",
    useColorModeValue(["bg.500", "violet.700"], ["bg.200", "peach.300"])
  );

  return (
    <Box
      zIndex="1"
      bgGradient={`radial-gradient(circle at 50% -10%, ${centerColor} 10%, ${peripheryColor} 70%)`}
      bgClip="text"
      fontSize={{ base: "xl", lg: "5xl" }}
      w="100%"
      textAlign={"center"}
      {...props}
    >
      <Text
        as={as}
        fontWeight="semibold"
        fontFamily="Montserrat, sans-serif"
        color="inherit"
        fontSize="inherit"
      >
        {title}
      </Text>
      {subtitle && (
        <Text
          as="p"
          fontSize={{ base: "md", lg: "xl" }}
          mt={2}
          color="bg.400"
          fontWeight="light"
          fontFamily="Montserrat, sans-serif"
        >
          {subtitle}
        </Text>
      )}
    </Box>
  );
}
