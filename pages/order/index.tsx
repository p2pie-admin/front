import { Formik, Field } from "formik";
import {
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  VStack,
} from "@chakra-ui/react";
import { Box3D, ResponsiveText } from "../../styles/theme/custom";
import { Text } from "@chakra-ui/react";
import Steps from "./Steps";

function SuggestP2P() {
  return (
    <Box3D minH="80vh" variant="contrast" w={{ base: "98%", md: 600 }} p="4">
      <ResponsiveText variant="extra_contrast" mb="4">
        Suggest your own exchange rate
      </ResponsiveText>
      <Steps />
    </Box3D>
  );
}

export default SuggestP2P;
