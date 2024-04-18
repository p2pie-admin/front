import { Box, Checkbox, Collapse, Divider, HStack } from "@chakra-ui/react";
import { ResponsiveText } from "../../../styles/theme/custom";
import { IP2PRegulationGroup } from "../../../types/p2p";
import Regulation from "./Regulation";
import { capitalize } from "../../../components/main/side/selector/section/PmGroup/helper";
import { useState } from "react";
import {
  IoRemoveCircleOutline,
  IoAddCircleOutline,
  IoAddOutline,
  IoRemoveOutline,
} from "react-icons/io5";

const RegulationGroup = ({
  regulationGroup,
}: {
  regulationGroup: IP2PRegulationGroup;
}) => {
  const [opened, setOpened] = useState(
    !!regulationGroup.regulations.find((r) => r.default_checked !== false)
  );
  const icon = opened ? (
    <IoRemoveOutline size="1.2rem" />
  ) : (
    <IoAddOutline size="1.2rem" />
  );
  return (
    <Box
      border={`1px ${opened ? "solid" : "dashed"}`}
      borderColor="bg.600"
      borderRadius="lg"
      my="4"
      p="2"
    >
      <HStack
        color="peach.200"
        onClick={() => setOpened(!opened)}
        cursor="pointer"
      >
        {icon}
        <ResponsiveText fontWeight="bold" size="lg">
          {capitalize(regulationGroup.en_title)}
        </ResponsiveText>
      </HStack>

      <Collapse in={opened}>
        {regulationGroup.regulations.map((regulation) => (
          <Regulation key={regulation.id} regulation={regulation} />
        ))}
      </Collapse>
    </Box>
  );
};

export default RegulationGroup;
