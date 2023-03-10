import { Box, useColorModeValue, useToken } from "@chakra-ui/react";

const Shader = ({
  bgColor,
  toTop = false,
  sm = false,
}: {
  bgColor?: string;
  toTop?: boolean;
  sm?: boolean;
}) => {
  const [blackAlpha100, blackAlpha400] = useToken("colors", [
    "blackAlpha.100",
    "blackAlpha.400",
  ]);

  return (
    <Box
      zIndex="5"
      w="100%"
      h={sm ? 4 : 12}
      bgGradient={useColorModeValue(
        `linear(${toTop ? "to-t" : "to-b"}, ${
          bgColor || blackAlpha100
        }, rgba(0,0,0,0))`,
        `linear(${toTop ? "to-t" : "to-b"}, ${
          bgColor || blackAlpha400
        }, rgba(0,0,0,0))`
      )}
      pointerEvents="none"
    />
  );
};

export default Shader;
