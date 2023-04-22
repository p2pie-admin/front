import * as React from "react";
import { IDirGroup } from "../../../../types/dir";
import { PRIMARY, PRIMARY_2, BUTTON_SIZE } from "./constants";
import Icon from "../../../shared/Avatar";
import { ScaleFade } from "@chakra-ui/react";
import CircularIcon from "../../../shared/CircularIcon";
import RegularIcon from "../../../shared/RegularIcon";
import { Box } from "@chakra-ui/react";

const PmButton = React.forwardRef(function MyButton(
  { group }: { group: IDirGroup },
  ref
) {
  return (
    <Box ref={ref}>
      <RegularIcon url={group?.icon?.url} index={+group.icon.id} />
    </Box>
  );
});

export default PmButton;
