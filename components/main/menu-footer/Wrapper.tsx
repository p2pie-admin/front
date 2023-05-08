import { Flex, Box, Text, Center, useColorModeValue } from "@chakra-ui/react";
import { ReactJSXElement } from "@emotion/react/types/jsx-namespace";
import { ReactChildren } from "react";
import { Box3D } from "../../../styles/theme/wrappers";

const Wrapper = ({
  title,
  children,
}: {
  title: String;
  children: ReactJSXElement;
}) => {
  return (
    <Box3D w="100%" bgColor={useColorModeValue("bg.10", "bg.900")}>
      <Flex justifyContent="center" alignItems="end" h="25%">
        <Text color="bg.500">{title}</Text>
      </Flex>
      <Center h="75%">{children}</Center>
    </Box3D>
  );
};

export default Wrapper;
