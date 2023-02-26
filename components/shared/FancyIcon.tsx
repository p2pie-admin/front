import { Image, Box, Center, useToken } from "@chakra-ui/react";

const FancyIcon = () => {
  const [orange200] = useToken("colors", ["orange.200"]);
  return (
    <Center w="10" h="10">
      <Box
        borderRadius="50%"
        boxShadow={`0px 0px 19px -8px ${orange200}`}
        bg={`radial-gradient(circle, ${orange200} 60%, rgba(0,0,0,0) 70%)`}
        position="relative"
      >
        <Image
          w={8}
          h={8}
          filter="hue-rotate(-140deg) grayscale(0.9) brightness(0.3)"
          // filter={shaded ? "grayscale(0.6) brightness(0.3)" : "none"}
          // fallbackSrc={fallbackSRC}
          src={"https://i.ibb.co/Cwt5Hm9/btc.png"}
          // alt={icon ? icon.alternativeText : ""}
        />
      </Box>
      <Box
        position="absolute"
        w="10"
        h="10"
        bgColor="rgba(0,0,0,0.5)"
        borderRadius="50%"
        filter="opacity(0.3)"
        bg={`radial-gradient(circle, ${orange200}  10%, rgba(0,0,0,0) 60%)`}
      ></Box>
    </Center>
  );
};

export default FancyIcon;
