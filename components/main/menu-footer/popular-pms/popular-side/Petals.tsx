import { Button, Center } from "@chakra-ui/react";
import React from "react";
import { IPm } from "../../../../../types/selector";
import Petal from "./Petal";

const Petals = React.forwardRef(function Menu(
  { style, popularPms }: { popularPms: IPm[] },
  ref
) {
  return (
    <Center style={style} ref={ref} borderRadius="50%">
      {popularPms.map((pm, index) => (
        <Petal
          key={index}
          pm={pm}
          index={index}
          totalItems={popularPms.length + 1}
        />
      ))}
      <Petal
        key={popularPms.length}
        index={popularPms.length}
        totalItems={popularPms.length + 1}
      />
    </Center>
  );
});

export default Petals;
