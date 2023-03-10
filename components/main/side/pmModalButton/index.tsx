import { Box, Button, HStack, Icon, Tag, Text, VStack } from "@chakra-ui/react";
import { useContext } from "react";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import SideContext from "../../SideContext";
import { BiChevronDown } from "react-icons/bi";
import PmAvatar from "../../../shared/Avatar";
import { capitalize } from "./section/PmGroup/helper";
import { setActiveSide } from "../../../../redux/mainReducer";
import SelectorModal from "./SelectorModal";
import side from "..";
import FancyIcon from "../../../shared/FancyIcon";

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
        py="1"
        px="0"
        bgColor="transparent"
        variant="default"
        // boxShadow="sm"
        // borderColor="bg.600"
        // _hover={{
        //   borderColor: "orange.400",
        //   bgColor: "bg.600",
        // }}
        // _active={{
        //   bgColor: "bg.500",
        // }}
        h="12"
        display="flex"
        justifyContent="space-between"
        //leftIcon={PmCurrencyName ? <PmAvatar icon={PmIcon} /> : ""}
        rightIcon={<Icon as={BiChevronDown} w="6" h="6" />}
        leftIcon={<FancyIcon />}
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
          <Text fontSize="xl">
            {capitalize(side === "give" ? "sell" : "buy")}
          </Text>
        )}
      </Button>
    </>
  );
};

export default SelectorButton;
