import { capitalize } from "../../../components/main/side/selector/section/PmGroup/helper";
import { ResponsiveText } from "../../../styles/theme/custom";
import { IP2PRegulation } from "../../../types/p2p";
import {
  Box,
  Checkbox,
  Divider,
  HStack,
  Switch,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { setRegulation } from "../../../redux/mainReducer";

const Regulation = ({ regulation }: { regulation: IP2PRegulation }) => {
  const dispatch = useAppDispatch();
  const code = regulation.en_title.replaceAll(" ", "_").toLocaleLowerCase();
  const defaultChecked = useAppSelector(
    (state) => state.main.p2p?.regulationCodes?.[code]
  );

  const handleCheckboxClick = (checked: boolean) => {
    dispatch(setRegulation([code, checked]));
  };

  return (
    <Box px="7" py="1" key={regulation.id}>
      <Divider my="2" />
      <HStack justifyContent="space-between">
        <ResponsiveText size="lg">
          {capitalize(regulation.en_title)}
        </ResponsiveText>
        <Switch
          id={regulation.id}
          // isDisabled
          // defaultChecked
          onChange={(e) => handleCheckboxClick(e.target.checked)}
          colorScheme="peach"
          isChecked={defaultChecked}
        />
      </HStack>

      <ResponsiveText whiteSpace="normal" size="sm">
        {regulation.en_description}
      </ResponsiveText>
    </Box>
  );
};

export default Regulation;
