import {
  useColorModeValue,
  Grid,
  Box,
  Divider,
  Text,
  Flex,
} from "@chakra-ui/react";
import { Box3D } from "../../../styles/theme/wrappers";
import { IPm } from "../../../types/selector";
import AmountInput from "./amountInput";
import PmModalButton from "./pmModalButton";

const Side = () => {
  return (
    <Box3D>
      <Grid
        templateColumns="auto 1fr"
        gridGap="4"
        py="0"
        px="4"
        w="100%"
        h="20"
        borderRadius="2xl"
        alignItems="center"
        justifyContent="space-between"
        // boxShadow="inset -1px 1px 28px rgba(0,0,0,0.1);"
      >
        <PmModalButton />

        <AmountInput />
      </Grid>
    </Box3D>
  );
};

export default Side;
