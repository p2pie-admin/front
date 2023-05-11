import {
  background,
  Box,
  theme,
  useColorModeValue,
  useToken,
} from "@chakra-ui/react";
import { ReactJSXElement } from "@emotion/react/types/jsx-namespace";
import { ITone } from "../../types/shared";
import { colors3D } from "./colors";

export const CustomBox3D = (props: any) => {
  const { children, ...chakraProps }: { children: ReactJSXElement } = props;
  return (
    <Box3D
      {...chakraProps}
      w="100%"
      bgColor={useColorModeValue("bg.10", "bg.900")}
      p="4"
    >
      {props.children}
    </Box3D>
  );
};
export const Box3D = (props: any) => {
  const { children, ...chakraProps }: { children: ReactJSXElement } = props;
  return (
    <Box
      {...chakraProps}
      borderRadius="2xl"
      position="relative"
      border="1px solid"
      borderColor="rgba(200,200,200,0.1)"
      boxShadow="inset -2px -2px 5px rgba(200,200,200,0.05), inset 2px 2px 5px  rgba(0,0,0,0.15), 3px 3px 10px -5px rgba(0,0,0,0.5), -3px -3px 10px -5px rgba(200,200,200,0.2)"
      // background={`linear-gradient(135deg, ${bgFromHEX}, ${bgFromHEX}) padding-box,
      //       linear-gradient(135deg, ${borderFromHEX}, ${borderToHEX}) border-box`}
    >
      {children}
    </Box>
  );
};
