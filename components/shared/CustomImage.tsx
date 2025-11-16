import { Image, Box } from "@chakra-ui/react";
import React from "react";
import { IImage } from "../../types/selector";
import fallbackImage from "../../public/fallback.png"; // Import local fallback image
import { cmsLinkPROD, cmsLinkDEV } from "../../services/utils";

const CustomImage = ({
  img,
  w = "200px",
  h = "200px",
  shaded = false,
  customAlt = "",
  objectFit = "cover",
}: {
  img?: IImage | null;
  w?: string;
  h?: string;
  shaded?: boolean;
  customAlt?: string;
  objectFit?: "cover" | "contain";
}) => {
  const env = process.env.NODE_ENV;
  const SRC = env === "production" ? cmsLinkPROD : cmsLinkDEV;

  const imageSrc = img ? SRC + img.url : fallbackImage.src; // Use local fallback

  return (
    <Box w={w} h={h} maxW={w} maxH={h} overflow="hidden">
      <Image
        key={img?.id}
        w="100%"
        h="100%"
        objectFit={objectFit}
        fit={objectFit}
        filter={shaded ? "grayscale(0.6) brightness(0.3)" : "none"}
        src={imageSrc}
        alt={img?.alternativeText || customAlt}
      />
    </Box>
  );
};

export default CustomImage;
