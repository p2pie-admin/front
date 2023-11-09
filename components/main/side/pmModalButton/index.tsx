import {
  Box,
  Button,
  Center,
  color,
  Hide,
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
import AddPm from "../../../../pages/order/first-step/customRate/AddPm";
import {
  ResponsiveButton,
  ResponsiveText,
} from "../../../../styles/theme/custom";

const ButtonWrapper = ({
  children,
  leftIcon,
  handleClick,
}: {
  leftIcon?: ReactElement;
  children: any;
  handleClick: Function;
}) => (
  <ResponsiveButton
    onClick={(e: React.MouseEvent<HTMLElement>) => {
      handleClick();
      e.stopPropagation();
    }}
    position="relative"
    variant="contrast"
    color={useColorModeValue("violet.600", "peach.200")}
    h="12"
    display="flex"
    justifyContent="space-between"
    //leftIcon={currency ? <PmAvatar icon={icon} /> : ""}
    rightIcon={
      <Hide below="xs">
        <Arrow isUp={false} />
      </Hide>
    }
    leftIcon={leftIcon}
  >
    {children}
  </ResponsiveButton>
);

const PmModalButton = () => {
  const dispatch = useAppDispatch();
  const p2pDirIndex = useContext(P2PContext);
  const side = useContext(SideContext) as "give" | "get";
  const tmp = useAppSelector((state) => {
    if (p2pDirIndex !== undefined)
      return state.main.p2p.dirs[p2pDirIndex][side];
    return state.main[`${side}Pm`];
  });
  const pms = !tmp ? [] : Array.isArray(tmp) ? [...tmp.slice(0, 3)] : [tmp];
  const tagBgColor = useColorModeValue("bg.100", "bg.600");

  const openDialog = () => {
    batch(() => {
      dispatch(triggerModal(side + p2pDirIndex || ""));
      dispatch(setSearchBarInputValue(""));
    });
  };

  if (!pms.length)
    return (
      <ButtonWrapper handleClick={openDialog}>
        <SelectorModal id={side + p2pDirIndex || ""} />
        <ResponsiveText size="md" variant="primary">
          {capitalize(side === "give" ? "sell" : "buy")}
        </ResponsiveText>
      </ButtonWrapper>
    );

  const { subgroup_name } = pms[0];
  const currencyCode = pms[0].currency.code.toUpperCase();
  return (
    <ButtonWrapper
      leftIcon={
        <HStack position="relative">
          <AddPm />
          <HStack minW={`${pms.length * 8 + 20}px`}>
            {pms.map((pm, index) => (
              <Box position="absolute" right={`${index * 10}px`}>
                <CircularIcon
                  key={pm.code + index}
                  icon={pm.icon}
                  color={pm.color || "gray"}
                />
              </Box>
            ))}
          </HStack>
        </HStack>
      }
      handleClick={openDialog}
    >
      <SelectorModal id={side + p2pDirIndex || ""} />
      <ResponsiveText size="md" variant="primary">
        {currencyCode}
      </ResponsiveText>
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

export default PmModalButton;
