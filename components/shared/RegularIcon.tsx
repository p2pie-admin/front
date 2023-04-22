import { Center, Image } from "@chakra-ui/react";

const env = process.env.NODE_ENV;
const SRC =
  env === "production"
    ? process.env.NEXT_PUBLIC_STRAPI_PROD_BASE_URL
    : process.env.NEXT_PUBLIC_STRAPI_DEV_BASE_URL;

const CustomImage = ({ url, index }: { url: string; index: number }) => {
  return (
    <Center
      filter={`invert(60%) sepia(97%) saturate(150%) hue-rotate(${
        index * 50
      }deg)`}
      zIndex="4"
      position="relative"
      justifyContent="center"
      color={`white`}
      _before={{
        content: "''",
        filter: "opacity(0.4) blur(8px)",
        bgColor: "white",
        position: "absolute",
        borderRadius: "50%",
        w: "50%",
        h: "50%",
      }}
    >
      <Image w="8" h="8" src={SRC + url} />
    </Center>
  );
};

export default CustomImage;
