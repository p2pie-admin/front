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
import { useAppSelector } from "../../redux/hooks";
import { MainState } from "../../redux/mainReducer";
import { createSelector } from "@reduxjs/toolkit";

function SuggestP2P() {
  // const testSelector = (state: { main: MainState }) => state.main.test;
  // const memoizedSelector = createSelector([testSelector], (test) =>
  //   test.filter((t) => t > 0)
  // );
  // const t = useAppSelector((state) => memoizedSelector(state));
  // console.log("rerendered", t);

  return (
    <Box3D variant="contrast" w={{ base: "100%", md: 600 }}>
      <Box3D
        variant="no_contrast"
        borderBottom="none"
        boxShadow="lg"
        borderBottomRadius="0"
        p={[2, 4]}
      >
        <ResponsiveText size="xl" my="1" fontWeight="bold">
          Suggest your own exchange rate
        </ResponsiveText>
      </Box3D>
      <Box p={[2, 4]}>
        <Steps />
      </Box>
    </Box3D>
  );
}

export default SuggestP2P;
