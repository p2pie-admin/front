import { Button } from "@chakra-ui/react";
import { PmType } from "../../../../../../types/selector";

export const SubButton = ({
  children,
  pm,
  choosePm,
  disabled,
}: {
  children: string;
  pm: PmType;
  choosePm: Function;
  disabled: boolean;
}) => (
  <Button
    w="100%"
    size="sm"
    disabled={disabled}
    gridColumn={`span ${pm.short_name.length > 5 ? 2 : 1}`}
    variant="primary_shaded"
    onClick={() => choosePm(pm)}
  >
    {children}
  </Button>
);
