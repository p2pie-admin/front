import { useColorModeValue, Grid, Box, Divider } from "@chakra-ui/react";
import AmountInput from "./amount-input";
import PmModalButton from "./pmModalButton";

const Side = () => {
  return (
    <Box
      p="2px"
      bgGradient={useColorModeValue(
        "linear(to-b, bg.50, bg.100)",
        "linear(to-bl, bg.400, bg.600)"
      )}
      borderRadius="50"
    >
      <Grid
        templateColumns="auto 1fr"
        bgColor={useColorModeValue("gray.50", "bg.500")}
        w="100%"
        h="20"
        px={{ base: "3", sm: "4" }}
        borderRadius="50"
        alignItems="center"
        justifyContent="space-between"
        boxShadow="inset -1px 1px 28px rgba(0,0,0,0.1);"
      >
        <PmModalButton />
        <AmountInput />
      </Grid>
    </Box>
  );
};

export default Side;
