import { Grid } from "@chakra-ui/react";
import BestRates from "./best";

import QuickChange from "./popular";

const MenuFooter = () => {
  return (
    <Grid gridTemplateColumns="1fr 1fr" h="128px" gridGap="4" userSelect="none">
      <QuickChange />
      <BestRates />
    </Grid>
  );
};

export default MenuFooter;
