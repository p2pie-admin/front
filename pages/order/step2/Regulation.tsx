import { capitalize } from "../../../components/main/side/selector/section/PmGroup/helper";
import { ResponsiveText } from "../../../styles/theme/custom";
import { IP2PRegulation } from "../../../types/p2p";
import { Box, Checkbox, Text, VStack } from "@chakra-ui/react";
import { useAppDispatch } from "../../../redux/hooks";
import { setRegulation } from "../../../redux/mainReducer";

const Regulation = ({ regulation }: { regulation: IP2PRegulation }) => {
  const dispatch = useAppDispatch();
  const handleCheckboxClick = (checked: boolean) => {
    const code = regulation.en_title.replaceAll(" ", "_").toLocaleLowerCase();
    dispatch(setRegulation([code, checked]));
  };

  return (
    <Box px="2" py="1">
      <Checkbox
        colorScheme="peach"
        defaultChecked={regulation.default_checked}
        onChange={(e) => handleCheckboxClick(e.target.checked)}
      >
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
