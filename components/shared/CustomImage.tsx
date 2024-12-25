import { Image, Box } from "@chakra-ui/react";
import React from "react";
import { IImage } from "../../types/selector";

const CustomImage = ({
  img,
  w = "200px",
  h = "200px",
  shaded = false,
  customAlt = "",
}: {
  img?: IImage;
  w?: string;
  h?: string;
  shaded?: boolean;
  customAlt?: string;
}) => {
  const env = process.env.NODE_ENV;
  const SRC =
    env === "production"
      ? process.env.NEXT_PUBLIC_STRAPI_PROD_BASE_URL
      : process.env.NEXT_PUBLIC_STRAPI_DEV_BASE_URL;

  const fallbackSRC = "https://i.ibb.co/74jyjr2/fb2.png";
  if (!img) return <></>;
  return (
    <Image
      key={img.id}
      w={w}
      h={h}
      filter={shaded ? "grayscale(0.6) brightness(0.3)" : "none"}
      fallbackSrc={fallbackSRC}
      fetchPriority="low"
      src={img ? SRC + img.url : ""}
      alt={img ? img.alternativeText : customAlt}
    />
  );
};

export default CustomImage;
