import { Box, Button, HStack, Icon, Tag, Text, VStack } from "@chakra-ui/react";
import { useContext } from "react";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import SideContext from "../../SideContext";
import { ChevronDown } from "@styled-icons/evaicons-solid/ChevronDown";
import PmAvatar from "../../../shared/Avatar";
import { capitalize } from "./section/PmGroup/helper";
import { setActiveSide } from "../../../../redux/mainReducer";
import SelectorModal from "./SelectorModal";
import side from "..";

const SelectorButton = () => {
  const dispatch = useAppDispatch();

  const side = useContext(SideContext) as "give" | "get";

  const PmCurrencyName = useAppSelector((state) =>
    state.main[`${side}Pm`]?.currency.code.toUpperCase()
  );
  const tag = useAppSelector((state) => state.main[`${side}Pm`]?.subgroup_name);

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
        display="flex"
        justifyContent="space-between"
        borderRadius="2rem"
        leftIcon={PmCurrencyName ? <PmAvatar icon={PmIcon} /> : ""}
        rightIcon={<Icon as={ChevronDown} w="6" h="6" />}
      >
        {PmCurrencyName ? (
          <Box>
            <Text fontSize="lg">{PmCurrencyName}</Text>
            {tag && (
              <Box position="absolute" w="fit-content" right={-3} bottom={-2.5}>
                <Tag
                  size="sm"
                  bgColor="bg.600"
                  borderRadius="2xl"
                  color="bg.200"
                >
                  {tag}
                </Tag>
              </Box>
            )}
          </Box>
        ) : (
          <Text ml="2" fontSize="xl">
            {capitalize(side)}
          </Text>
        )}
      </Button>
    </>
  );
};

export default SelectorButton;
