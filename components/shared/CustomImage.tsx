import { Image, Box } from "@chakra-ui/react";
import React from "react";
import { IImage } from "../../types/selector";

const CustomImage = ({
  img,
  w = "200px",
  h = "200px",
  shaded = false,
}: {
  img: IImage;
  w?: string;
  h?: string;
  shaded?: boolean;
}) => {
  const env = process.env.NODE_ENV;
  const SRC =
    env === "production"
      ? process.env.NEXT_PUBLIC_STRAPI_PROD_BASE_URL
      : process.env.NEXT_PUBLIC_STRAPI_DEV_BASE_URL;

  const fallbackSRC =
    "https://static.vecteezy.com/system/resources/thumbnails/011/299/215/small/simple-loading-or-buffering-icon-design-png.png";
  return (
    <Image
      objectFit="cover"
      w={w}
      h={h}
      filter={shaded ? "grayscale(0.6) brightness(0.3)" : "none"}
      fallbackSrc={fallbackSRC}
      src={img ? SRC + img.url : ""}
      alt={img ? img.alternativeText : ""}
    />
  );
};

export default CustomImage;
