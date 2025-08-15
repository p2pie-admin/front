import { Box, useToken, useColorModeValue } from "@chakra-ui/react";
import Image from "next/image";

interface IImageFormat {
  url: string;
}
interface IImage {
  url: string;
  alternativeText?: string;
  formats?: {
    thumbnail?: IImageFormat;
    small?: IImageFormat;
  };
}

const CircularIcon = ({
  icon,
  color,
  iconAlt,
  size = "md",
}: {
  color: string;
  icon?: IImage;
  size?: "sm" | "md" | "lg";
  iconAlt?: string;
}) => {
  const [
    gray,
    red,
    orange,
    yellow,
    green,
    teal,
    blue,
    cyan,
    purple,
    pink,
    dark_gray,
    dark_red,
    dark_orange,
    dark_yellow,
    dark_green,
    dark_teal,
    dark_blue,
    dark_cyan,
    dark_purple,
    dark_pink,
  ] = useToken("colors", [
    "gray.300",
    "red.300",
    "orange.300",
    "yellow.300",
    "green.300",
    "teal.300",
    "blue.300",
    "cyan.300",
    "purple.300",
    "pink.300",
    "gray.500",
    "red.500",
    "orange.500",
    "yellow.500",
    "green.500",
    "teal.500",
    "blue.500",
    "cyan.500",
    "purple.500",
    "pink.500",
  ]) as string[];

  const colors = {
    gray,
    red,
    orange,
    yellow,
    green,
    teal,
    blue,
    cyan,
    purple,
    pink,
    dark_gray,
    dark_red,
    dark_orange,
    dark_yellow,
    dark_green,
    dark_teal,
    dark_blue,
    dark_cyan,
    dark_purple,
    dark_pink,
  } as Record<string, string>;

  const colorHEX = colors?.[color] || "#aaa";
  const filter = useColorModeValue(
    "hue-rotate(70deg) brightness(0.3) opacity(0.8)",
    "hue-rotate(-140deg) brightness(0.1)"
  );

  const env = process.env.NODE_ENV;
  const SRC =
    env === "production"
      ? process.env.NEXT_PUBLIC_STRAPI_PROD_BASE_URL
      : process.env.NEXT_PUBLIC_STRAPI_DEV_BASE_URL;

  const optimizedUrl =
    icon?.formats?.thumbnail?.url ||
    icon?.formats?.small?.url ||
    icon?.url ||
    "";

  // Map size keyword to relative rem size
  const sizeMap = { sm: "1rem", md: "1.25rem", lg: "1.5rem" };

  return (
    <Box
      as="span"
      position="relative"
      display="inline-block"
      w={sizeMap[size]}
      h={sizeMap[size]}
      borderRadius="50%"
      overflow="hidden"
      flexShrink={0}
      bg={colorHEX}
      boxShadow={`0 0 5px 0px ${colorHEX}`} // glow directly here
    >
      {icon && (
        <Box
          as="img"
          src={SRC + optimizedUrl}
          alt={icon?.alternativeText || iconAlt || ""}
          width="100%"
          height="100%"
          style={{ objectFit: "cover", filter }}
        />
      )}
    </Box>
  );
};

export default CircularIcon;
