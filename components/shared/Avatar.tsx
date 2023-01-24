import { Image, Box } from "@chakra-ui/react";
import React from "react";

const Avatar = ({ icon, shaded = false }: { icon: any; shaded?: boolean }) => {
  const env = process.env.NODE_ENV;
  const SRC =
    env === "production"
      ? process.env.NEXT_PUBLIC_STRAPI_PROD_BASE_URL
      : process.env.NEXT_PUBLIC_STRAPI_DEV_BASE_URL;

  const fallbackSRC = "https://i.ibb.co/WzrRCF9/no-avatar.png";
  return (
    <Box overflow="hidden" borderRadius="50%">
      <Image
        w={8}
        h={8}
        filter={shaded ? "grayscale(0.6) brightness(0.3)" : "none"}
        fallbackSrc={fallbackSRC}
        src={icon ? SRC + icon.url : ""}
        alt={icon ? icon.alternativeText : ""}
      />
    </Box>
  );
};

export default Avatar;
