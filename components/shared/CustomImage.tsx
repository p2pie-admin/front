import { Image, Box } from "@chakra-ui/react";
import React from "react";
import { IImage } from "../../types/selector";
import fallbackImage from "../../public/fallback.png"; // Import local fallback image

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

  const imageSrc = img ? SRC + img.url : fallbackImage.src; // Use local fallback

  return (
    <Box w={w} h={h} overflow="hidden">
      <Image
        key={img?.id}
        w="100%"
        h="100%"
        objectFit="cover"
        filter={shaded ? "grayscale(0.6) brightness(0.3)" : "none"}
        src={imageSrc}
        alt={img?.alternativeText || customAlt}
      />
    </Box>
  );
};

export default CustomImage;
