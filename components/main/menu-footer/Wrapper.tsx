import { Flex, Box, Text, Center } from "@chakra-ui/react";
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
    <Box3D w="100%" bgColor="bg.900">
      <Flex justifyContent="center" alignItems="end" h="25%">
        <Text fontSize="sm" color="bg.400">
          {title}
        </Text>
      </Flex>
      <Center h="75%">{children}</Center>
    </Box3D>
  );
};

export default Wrapper;
