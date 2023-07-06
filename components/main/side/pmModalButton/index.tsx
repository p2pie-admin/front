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
import { triggerModal } from "../../../../redux/mainReducer";
import SelectorModal from "./SelectorModal";
import side from "..";
import CircularIcon from "../../../shared/CircularIcon";
import Arrow from "../../../shared/Arrow";
import { batch } from "react-redux";
import { IImage, IPm } from "../../../../types/selector";

const ButtonWrapper = ({
  children,
  leftIcon,
  handleClick,
}: {
  leftIcon?: ReactElement;
  children: any;
  handleClick: Function;
}) => (
  <>
    <SelectorModal />
    <Button
      onClick={() => handleClick()}
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
  </>
);

// {
//   currencyCode ? (
//     <CircularIcon icon={icon} color={color || "gray"} />
//   ) : (
//     <></>
//   )
// }
const SelectorButton = ({ pm }: { pm?: IPm }) => {
  const dispatch = useAppDispatch();

  const side = useContext(SideContext) as "give" | "get";

  if (!pm)
    return (
      <ButtonWrapper handleClick={() => dispatch(triggerModal(side))}>
        <Text fontSize="xl">
          {capitalize(side === "give" ? "sell" : "buy")}
        </Text>
      </ButtonWrapper>
    );

  const { icon, tag, color } = pm;
  const currencyCode = pm.currency.code.toUpperCase();
  return (
    <ButtonWrapper
      leftIcon={<CircularIcon icon={icon} color={color || "gray"} />}
      handleClick={() => dispatch(triggerModal(side))}
    >
      <Text fontSize="lg">{currencyCode}</Text>
      {tag && (
        <Box
          position="absolute"
          zIndex="5"
          w="fit-content"
          right={-3}
          bottom={-2.5}
        >
          <Tag size="sm" colorScheme="bg">
            {tag}
          </Tag>
        </Box>
      )}
    </ButtonWrapper>
  );
};

export default SelectorButton;
