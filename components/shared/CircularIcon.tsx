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
  small,
  iconAlt,
}: {
  color: string;
  icon?: IImage;
  small?: boolean;
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
    "gray.200",
    "red.200",
    "orange.200",
    "yellow.200",
    "green.200",
    "teal.200",
    "blue.200",
    "cyan.200",
    "purple.200",
    "pink.200",
    "gray.400",
    "red.400",
    "orange.400",
    "yellow.400",
    "green.400",
    "teal.400",
    "blue.400",
    "cyan.400",
    "purple.400",
    "pink.400",
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

  const size = small ? [5, 6] : [6, 7];
  return (
    <Center w={size} h={size} position="relative">
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
        boxShadow={
          small
            ? `0px 0px 10px -10px ${colorHEX}`
            : `0px 0px 14px -7px ${colorHEX}`
        }
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
