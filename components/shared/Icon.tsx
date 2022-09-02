import { Image, Box } from "@chakra-ui/react";
import React from "react";

const PmAvatar = ({ icon, big = false }: { icon: any; big?: boolean }) => {
  const env = process.env.NODE_ENV;
  const SRC =
    env === "production"
      ? process.env.NEXT_PUBLIC_STRAPI_PROD_BASE_URL
      : process.env.NEXT_PUBLIC_STRAPI_DEV_BASE_URL;

  const fallbackSRC =
    env === "production"
      ? "https://strapi-latest.herokuapp.com/uploads/no_avatar_f6343c2514.png"
      : "http://localhost:1337/uploads/no_avatar_7fc5006027.png?width=32&height=32";

  return (
    <Box overflow="hidden" borderRadius="50%">
      <Image
        w={big ? 10 : 8}
        h={big ? 10 : 8}
        fallbackSrc={fallbackSRC}
        src={icon ? SRC + icon.url : ""}
        alt={icon ? icon.alternativeText : ""}
      />
    </Box>
  );
};

export default PmAvatar;
