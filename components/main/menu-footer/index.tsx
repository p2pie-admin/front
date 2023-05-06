import { Grid } from "@chakra-ui/react";
import Plot from "./best";
import QuickChange from "./popular";

const MenuFooter = () => {
  return (
    <Grid gridTemplateColumns="1fr 1fr" h="128px" gridGap="4" userSelect="none">
      <QuickChange />
      <Plot />
    </Grid>
  );
};

export default MenuFooter;
