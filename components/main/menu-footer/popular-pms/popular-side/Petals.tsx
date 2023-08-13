import { Button, Center } from "@chakra-ui/react";
import React from "react";
import { IPm } from "../../../../../types/selector";
import Petal from "./Petal";

const Petals = React.forwardRef(function Menu(
  { style, pms }: { pms: IPm[] },
  ref
) {
  return (
    <Center style={style} ref={ref} borderRadius="50%">
      {pms.map((pm, index) => (
        <Petal key={index} pm={pm} index={index} totalItems={pms.length + 1} />
      ))}
      <Petal key={pms.length} index={pms.length} totalItems={pms.length + 1} />
    </Center>
  );
});

export default Petals;
