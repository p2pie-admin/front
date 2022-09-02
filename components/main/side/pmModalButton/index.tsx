import { Box, Button, HStack, Icon, Tag, Text, VStack } from "@chakra-ui/react";
import { useContext } from "react";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";

import SideContext from "../../SideContext";
import { batch } from "react-redux";
import { ChevronDown } from "@styled-icons/evaicons-solid/ChevronDown";
import PmAvatar from "../../../shared/Icon";
import { capitalize } from "./section/PmGroup/helper";
import { setActiveSide } from "../../../../redux/mainReducer";
import SelectorModal from "./SelectorModal";

const SelectorButton = () => {
  const dispatch = useAppDispatch();

  const side = useContext(SideContext) as "give" | "get";

  const PmCurrencyName = useAppSelector((state) =>
    state.main[`${side}Pm`]?.currency.code.toUpperCase()
  );
  const PmShortName = useAppSelector(
    (state) => state.main[`${side}Pm`]?.short_name
  );
  const tag =
    PmShortName !== PmCurrencyName ? capitalize(PmShortName) : undefined;
  const PmIcon = useAppSelector((state) => state.main[`${side}Pm`]?.icon);

  const handleModalOpen = () => dispatch(setActiveSide(side));

  return (
    <>
      {typeof window !== "undefined" && <SelectorModal />}
      <Button
        onClick={() => handleModalOpen()}
        position="relative"
        bgColor="orange.300"
        boxShadow="none"
        py="2"
        px="2"
        h="12"
        borderRadius="2rem"
        leftIcon={PmCurrencyName ? <PmAvatar icon={PmIcon} /> : <></>}
        rightIcon={<Icon as={ChevronDown} w="6" h="6" />}
      >
        {PmCurrencyName ? (
          <Box>
            <Text fontSize="lg">{PmCurrencyName}</Text>
            {tag && (
              <Box position="absolute" w="fit-content" right={0} bottom={-2}>
                <Tag size="sm" bgColor="bg.700" borderRadius="2xl">
                  {tag}
                </Tag>
              </Box>
            )}
          </Box>
        ) : (
          <Text ml="3" fontSize="lg">
            {capitalize(side)}
          </Text>
        )}
      </Button>
    </>
  );
};

export default SelectorButton;
