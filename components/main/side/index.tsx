import { useColorModeValue, Grid, Box, Divider } from "@chakra-ui/react";
import AmountInput from "./amountInput";
import PmModalButton from "./pmModalButton";

const Side = () => {
  return (
    <Box
    // bgGradient={useColorModeValue(
    //   "linear(to-b, bg.50, bg.100)",
    //   "linear(to-bl, bg.600, bg.700)"
    // )}
    >
      <Grid
        templateColumns="auto 1fr"
        bgColor={useColorModeValue("pink.50", "bg.900")}
        w="100%"
        h="16"
        px={{ base: "1", sm: "2" }}
        borderRadius="2xl"
        alignItems="center"
        justifyContent="space-between"
        // boxShadow="inset -1px 1px 28px rgba(0,0,0,0.1);"
      >
        <PmModalButton />
        {/* <AmountInput /> */}
      </Grid>
    </Box>
  );
};

export default Side;
