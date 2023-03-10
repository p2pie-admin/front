import {
  useColorModeValue,
  Grid,
  Box,
  Divider,
  Text,
  Flex,
} from "@chakra-ui/react";
import { Box3D } from "../../../styles/theme/wrappers";
import AmountInput from "./amountInput";
import PmModalButton from "./pmModalButton";

const Side = () => {
  return (
    <Box3D
    // bgGradient={useColorModeValue(
    //   "linear(to-b, bg.50, bg.100)",
    //   "linear(to-bl, bg.600, bg.700)"
    // )}
    >
      <Grid
        templateColumns="auto 1fr"
        gridGap="4"
        py="0"
        px="4"
        bgColor={useColorModeValue("pink.50", "bg.900")}
        w="100%"
        h="20"
        borderRadius="2xl"
        alignItems="center"
        justifyContent="space-between"
        // boxShadow="inset -1px 1px 28px rgba(0,0,0,0.1);"
      >
        <PmModalButton />
        <Flex h="100%" alignItems="center" justifyContent="end">
          <Text fontSize="4xl" m="0" textAlign="end" color="bg.50">
            9349.00
          </Text>
        </Flex>
        {/* <AmountInput /> */}
      </Grid>
    </Box3D>
  );
};

export default Side;
