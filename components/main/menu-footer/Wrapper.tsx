import { Flex, Box, Text, Center, useColorModeValue } from "@chakra-ui/react";
import { ReactJSXElement } from "@emotion/react/types/jsx-namespace";
import { ReactChildren } from "react";
import { Box3D, CustomBox3D } from "../../../styles/theme/wrappers";

const Wrapper = ({
  title,
  children,
}: {
  title: String;
  children: ReactJSXElement;
}) => {
  return (
    <CustomBox3D>
      <Flex justifyContent="center" alignItems="end" h="25%">
        <Text color="bg.500">{title}</Text>
      </Flex>
      <Center h="75%">{children}</Center>
    </CustomBox3D>
  );
};

export default Wrapper;
