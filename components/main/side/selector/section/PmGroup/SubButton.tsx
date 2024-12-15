import { Button, useColorModeValue } from "@chakra-ui/react";
import { IPm } from "../../../../../../types/selector";

export const SubButton = ({
  children,
  pm,
  choosePm,
  shaded,
}: {
  children: string;
  pm: IPm;
  choosePm: Function;
  shaded: boolean;
}) => (
  <Button
    w="100%"
    size="sm"
    filter={shaded ? "opacity(0.5) grayscale(0.8)" : "none"}
    gridColumn={`span ${
      pm.subgroup_name && pm.subgroup_name.length > 4 ? 2 : 1
    }`}
    variant="extra_contrast"
    onClick={shaded ? () => {} : () => choosePm(pm, shaded)}
  >
    {children}
  </Button>
);
