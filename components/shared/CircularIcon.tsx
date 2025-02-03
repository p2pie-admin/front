import {
  Image,
  Box,
  Center,
  useToken,
  useColorModeValue,
} from "@chakra-ui/react";
import { IImage } from "../../types/selector";

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
  } as any;

  const colorHEX = colors?.[color] || "#aaa";
  const env = process.env.NODE_ENV;
  const baseColor = "#45ffff";
  const filter = useColorModeValue(
    "hue-rotate(70deg) brightness(0.3) opacity(0.8)",
    "hue-rotate(-140deg) brightness(0.1)"
  );
  const SRC =
    env === "production"
      ? process.env.NEXT_PUBLIC_STRAPI_PROD_BASE_URL
      : process.env.NEXT_PUBLIC_STRAPI_DEV_BASE_URL;

  const iconSize = size == "lg" ? [10, 12] : size == "sm" ? [5, 6] : [6, 7];
  return (
    <Center w={iconSize} h={iconSize} position="relative">
      <Image
        zIndex="6"
        filter={filter}
        // filter={shaded ? "grayscale(0.6) brightness(0.3)" : "none"}
        // fallbackSrc={fallbackSRC}
        fetchPriority="low"
        src={icon ? SRC + icon.url : ""}
        alt={icon ? icon.alternativeText : iconAlt}
      />

      <Box
        position="absolute"
        zIndex="5"
        borderRadius="50%"
        w="100%"
        h="100%"
        boxShadow={`0px 0px 14px -7px ${colorHEX}`}
        filter="saturate(1.5)"
        bg={`radial-gradient(circle, ${colorHEX} 60%, rgba(0,0,0,0) 70%)`}
        // position="absolute"
      />

      <Box
        position="absolute"
        w="10"
        h="10"
        bgColor="rgba(0,0,0,0.5)"
        borderRadius="50%"
        filter="opacity(0.2)"
        bg={`radial-gradient(circle, ${colorHEX}  10%, rgba(0,0,0,0) 60%)`}
      ></Box>
    </Center>
  );
};

export default CircularIcon;
