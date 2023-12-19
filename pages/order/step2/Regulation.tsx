import { B } from "styled-icons/fa-solid";
import { capitalize } from "../../../components/main/side/selector/section/PmGroup/helper";
import { ResponsiveText } from "../../../styles/theme/custom";
import { IP2PRegulation } from "../../../types/p2p";
import { Box, Checkbox, Text, VStack } from "@chakra-ui/react";

const Regulation = ({ regulation }: { regulation: IP2PRegulation }) => {
  return (
    <Box px="2" py="1">
      <Checkbox colorScheme="red" defaultChecked={regulation.default_checked}>
        <ResponsiveText size="md">
          {capitalize(regulation.en_title)}
        </ResponsiveText>
      </Checkbox>
      <ResponsiveText whiteSpace="normal" size="xs">
        {regulation.en_description}
      </ResponsiveText>
    </Box>
  );
};

export default Regulation;
