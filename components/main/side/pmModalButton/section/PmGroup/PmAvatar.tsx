import { Image, Box } from "@chakra-ui/react";
import React from "react";
import { IconType } from "../../../../../../types/selector";

const PmAvatar = ({ icon }: { icon: IconType | undefined }) => {
  return (
    <Box overflow="hidden" borderRadius="50%">
      <Image
        w={8}
        h={8}
        fallbackSrc="http://localhost:1337/uploads/no_avatar_7fc5006027.png?width=32&height=32"
        src={icon ? process.env.NEXT_PUBLIC_STRAPI_BASE_URL + icon.url : ""}
        alt={icon ? icon.alternativeText : ""}
      />
    </Box>
  );
};

export default PmAvatar;
