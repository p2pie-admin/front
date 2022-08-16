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
        boxShadow={useColorModeValue(
          "0px 0px 2px rgb(0 0 0 / 25%), 10px 10px 15px #e3e3e3, -10px 10px 15px #e3e3e3, -15px -15px 15px rgb(255 255 255 / 40%), 15px -15px 15px rgb(255 255 255 / 40%), inset 0px 2px 0px white",
          "none"
        )}
      >
        <PmModalButton />
        <AmountInput />
      </Grid>
    </Box>
  );
};

export default Side;
