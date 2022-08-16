import { Grid } from "@chakra-ui/react";
import { SectionContext } from "./SectionContext";
import { ReactChildren, useContext } from "react";

const SectionGrid = ({ children }: { children: JSX.Element[] }) => {
  const { columns } = useContext(SectionContext);

  return (
    <Grid templateColumns={`repeat(${columns}, 1fr)`} gap="1" pb={2}>
      {children}
    </Grid>
  );
};

export default SectionGrid;
