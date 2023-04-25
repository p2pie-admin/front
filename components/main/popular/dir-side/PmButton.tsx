import * as React from "react";
import { IDirGroup } from "../../../../types/dir";
import { PRIMARY, PRIMARY_2, BUTTON_SIZE } from "./constants";
import Icon from "../../../shared/Avatar";
import { Box, ScaleFade } from "@chakra-ui/react";
import CircularIcon from "../../../shared/CircularIcon";
import { Button } from "@chakra-ui/react";
import InsideDirArea from "../InsideDirArea";

const PmButton = React.forwardRef(function MyButton(
  { group }: { group: IDirGroup },
  ref
) {
  return (
    <Box ref={ref} color="transparent" position="relative">
      .
    </Box>
  );
});

export default PmButton;
