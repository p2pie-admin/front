import { Image, Box, Center, useToken } from "@chakra-ui/react";
import { IImage } from "../../types/selector";

const CircularIcon = ({
  icon,
  color,
  small,
}: {
  color: string;
  icon?: IImage;
  small?: boolean;
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
  const SRC =
    env === "production"
      ? process.env.NEXT_PUBLIC_STRAPI_PROD_BASE_URL
      : process.env.NEXT_PUBLIC_STRAPI_DEV_BASE_URL;

  const size = small ? "5" : "7";
  return (
    <Center w={size} h={size}>
      <Center
        borderRadius="50%"
        boxShadow={`0px 0px 12px -5px ${colorHEX}`}
        bg={`radial-gradient(circle, ${colorHEX} 60%, rgba(0,0,0,0) 70%)`}
        position="relative"
      >
        <Image
          filter="hue-rotate(-140deg) brightness(0.1)"
          // filter={shaded ? "grayscale(0.6) brightness(0.3)" : "none"}
          // fallbackSrc={fallbackSRC}
          src={icon ? SRC + icon.url : ""}
          alt={icon ? icon.alternativeText : ""}
        />
      </Center>
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
