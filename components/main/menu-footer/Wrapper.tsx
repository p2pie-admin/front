import { Flex, Box, Text, Center, useColorModeValue } from "@chakra-ui/react";
import { ReactJSXElement } from "@emotion/react/types/jsx-namespace";
import { title } from "process";
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
    <CustomBox3D h="120">
      <Text color="bg.500" fontSize="sm" textAlign="center">
        {title}
      </Text>

      <Center h="80%" p="2">
        {children}
      </Center>
    </CustomBox3D>
  );
};

export default Wrapper;
