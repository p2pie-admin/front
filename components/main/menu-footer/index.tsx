import { Grid } from "@chakra-ui/react";
import PopularRates from "./popular-rates";

import QuickChange from "./popular-pms";

const MenuFooter = () => {
  return (
    <Grid gridTemplateColumns="1fr 1fr" h="128px" gridGap="4" userSelect="none">
      <QuickChange />
      <PopularRates />
    </Grid>
  );
};

export default MenuFooter;
