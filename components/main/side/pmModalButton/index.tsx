import {
  Box,
  Button,
  Center,
  color,
  HStack,
  Icon,
  Tag,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import React, { ReactElement, useContext } from "react";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import SideContext from "../../../shared/contexts/SideContext";
import { BiChevronDown } from "react-icons/bi";
import PmAvatar from "../../../shared/Avatar";
import { capitalize } from "./section/PmGroup/helper";
import {
  setSearchBarInputValue,
  triggerModal,
} from "../../../../redux/mainReducer";
import SelectorModal from "./SelectorModal";
import side from "..";
import CircularIcon from "../../../shared/CircularIcon";
import Arrow from "../../../shared/Arrow";
import { batch } from "react-redux";
import { IImage, IPm } from "../../../../types/selector";
import P2PContext from "../../../shared/contexts/p2pContext";

const ButtonWrapper = ({
  children,
  leftIcon,
  handleClick,
}: {
  leftIcon?: ReactElement;
  children: any;
  handleClick: Function;
}) => (
  <Button
    onClick={(e: React.MouseEvent<HTMLElement>) => {
      handleClick();
      e.stopPropagation();
    }}
    position="relative"
    py="1"
    px="0"
    bgColor="transparent"
    variant="default"
    color={useColorModeValue("violet.600", "peach.200")}
    h="12"
    display="flex"
    justifyContent="space-between"
    //leftIcon={currency ? <PmAvatar icon={icon} /> : ""}
    rightIcon={<Arrow isUp={false} />}
    leftIcon={leftIcon}
  >
    {children}
  </Button>
);

const SelectorButton = () => {
  const dispatch = useAppDispatch();
  const p2pDirIndex = useContext(P2PContext);
  const side = useContext(SideContext) as "give" | "get";
  const pm = useAppSelector((state) => {
    if (p2pDirIndex !== undefined)
      return state.main.p2p.dirs[p2pDirIndex][side]?.[0];
    return state.main[`${side}Pm`];
  });
  const tagBgColor = useColorModeValue("bg.100", "bg.600");

  const openDialog = () => {
    batch(() => {
      dispatch(triggerModal(side));
      dispatch(setSearchBarInputValue(""));
    });
  };

  if (!pm)
    return (
      <ButtonWrapper handleClick={() => dispatch(triggerModal(side))}>
        <SelectorModal />
        <Text fontSize="xl">
          {capitalize(side === "give" ? "sell" : "buy")}
        </Text>
      </ButtonWrapper>
    );

  const { icon, subgroup_name, color } = pm;
  const currencyCode = pm.currency.code.toUpperCase();
  return (
    <ButtonWrapper
      leftIcon={<CircularIcon icon={icon} color={color || "gray"} />}
      handleClick={openDialog}
    >
      <SelectorModal />
      <Text fontSize="lg">{currencyCode}</Text>
      {subgroup_name && (
        <Box
          position="absolute"
          zIndex="5"
          w="fit-content"
          right={-3}
          bottom={-2.5}
        >
          <Tag size="sm" bgColor={tagBgColor}>
            <Text variant="contrast">{subgroup_name}</Text>
          </Tag>
        </Box>
      )}
    </ButtonWrapper>
  );
};

export default SelectorButton;
