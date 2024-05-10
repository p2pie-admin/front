import { useToken, useColorModeValue } from "@chakra-ui/react";
import { Box } from "@chakra-ui/react";

const Shader = ({
  direction = "top",
  intense = false,
}: {
  direction: "top" | "bottom";
  intense?: boolean;
}) => {
  const [shaderColor] = useToken(
    "colors",
    intense
      ? useColorModeValue(["bg.100"], ["bg.700"])
      : useColorModeValue(["bg.200"], ["bg.900"])
  );

  return (
    <Box
      w="100%"
      boxShadow={
        intense
          ? `0 0 70px 30px ${shaderColor}`
          : `0 0 70px 30px ${shaderColor}`
      }
      position="absolute"
      left="0"
      top={direction === "top" ? "0" : "unset"}
      bottom={direction === "bottom" ? "0" : "unset"}
      zIndex="10"
    />
  );
};

export default Shader;
