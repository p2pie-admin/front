import { Box, useColorModeValue, useToken } from "@chakra-ui/react";

const Shader = ({
  bgColor,
  toTop = false,
  top = 0,
  bottom = 0,
}: {
  bgColor?: string;
  toTop?: boolean;
  top?: number;
  bottom?: number;
}) => {
  const [blackAlpha100, blackAlpha400] = useToken("colors", [
    "blackAlpha.100",
    "blackAlpha.400",
  ]);

  return (
    <Box
      zIndex="5"
      position="absolute"
      bottom={bottom}
      top={top}
      w="100%"
      h="14"
      bgGradient={useColorModeValue(
        `linear(${toTop ? "to-t" : "to-b"}, ${
          bgColor || blackAlpha100
        }, rgba(0,0,0,0))`,
        `linear(${toTop ? "to-t" : "to-b"}, ${
          bgColor || blackAlpha400
        }, rgba(0,0,0,0))`
      )}
      left="0"
      pointerEvents="none"
    />
  );
};

export default Shader;
