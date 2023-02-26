import { Flex } from "@chakra-ui/react";
import { ReactJSXElement } from "@emotion/react/types/jsx-namespace";
import { ReactChild } from "react";

const GradientBorder = ({ children }: { children: ReactJSXElement }) => {
  return (
    <Flex
      p="2px"
      justify="center"
      align="center"
      bg="radial-gradient(69.43% 69.43% at 50% 50%, #FFFFFF 0%, rgba(255, 255, 255, 0) 100%)"
    >
      {children}
    </Flex>
  );
};

export default GradientBorder;
