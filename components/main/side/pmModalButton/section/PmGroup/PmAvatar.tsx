import { Image, Box } from "@chakra-ui/react";
import React from "react";

const PmAvatar = ({ icon }: { icon: any }) => {
  return (
    <Box overflow="hidden" borderRadius="50%">
      <Image
        w={8}
        h={8}
        fallbackSrc="../../../../../../public/no-avatar.png"
        src={icon ? process.env.NEXT_PUBLIC_STRAPI_BASE_URL + icon.url : ""}
        alt={icon ? icon.alternativeText : ""}
      />
    </Box>
  );
};

export default PmAvatar;
