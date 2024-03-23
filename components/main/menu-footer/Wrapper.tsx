import { Flex, Box, Text, Center, useColorModeValue } from "@chakra-ui/react";
import { ReactJSXElement } from "@emotion/react/types/jsx-namespace";
import { title } from "process";
import { ReactChildren } from "react";
import { Box3D, CustomBox3D } from "../../../styles/theme/custom";

const Wrapper = ({
  title,
  children,
}: {
  title: String;
  children: ReactJSXElement;
}) => {
  return (
    <CustomBox3D p="10" minW="300">
      <Text color="bg.500" fontSize="lg" textAlign="center" mb="10">
        {title}
      </Text>

      <Center h="80%" p="2">
        {children}
      </Center>
    </CustomBox3D>
  );
};

export default Wrapper;
