import { VStack, Grid } from "@chakra-ui/react";

const ColumnGrid = ({ children }: { children: any }) => {
  return (
    <Grid
      //gridTemplateColumns={{ base: "1fr", lg: "1fr 1fr" }}
      gridGap="4"
      w="100%"
      justifyContent="center"
    >
      {children}
    </Grid>
  );
};

export default ColumnGrid;
