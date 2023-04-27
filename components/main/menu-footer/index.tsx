import { Grid } from "@chakra-ui/react";
import QuickChange from "./quick";

const MenuFooter = () => {
  return (
    <Grid gridTemplateColumns="1fr 1fr" h="128px" gridGap="4">
      <QuickChange />
      <QuickChange />
    </Grid>
  );
};

export default MenuFooter;
