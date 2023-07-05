import {
  Box,
  Button,
  Center,
  HStack,
  Icon,
  Tag,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { useContext } from "react";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import SideContext from "../../../shared/contexts/SideContext";
import { BiChevronDown } from "react-icons/bi";
import PmAvatar from "../../../shared/Avatar";
import { capitalize } from "./section/PmGroup/helper";
import { setActiveSide, triggerModal } from "../../../../redux/mainReducer";
import SelectorModal from "./SelectorModal";
import side from "..";
import CircularIcon from "../../../shared/CircularIcon";
import Arrow from "../../../shared/Arrow";
import { batch } from "react-redux";

const SelectorButton = () => {
  const dispatch = useAppDispatch();

  const side = useContext(SideContext) as "give" | "get";

  const PmCurrencyName = useAppSelector((state) =>
    state.main[`${side}Pm`]?.currency.code.toUpperCase()
  );
  const tag = useAppSelector((state) => state.main[`${side}Pm`]?.subgroup_name);

  const PmIcon = useAppSelector((state) => state.main[`${side}Pm`]?.icon);
  const PmColor = useAppSelector((state) => state.main[`${side}Pm`]?.color);

  const handleModalOpen = () => {
    batch(() => {
      dispatch(setActiveSide(side));
      dispatch(triggerModal(side));
    });
  };

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
        color={useColorModeValue("violet.600", "peach.200")}
        // boxShadow="sm"
        // borderColor="bg.600"
        // _hover={{
        //   borderColor: "pink.400",
        //   bgColor: "bg.600",
        // }}
        // _active={{
        //   bgColor: "bg.500",
        // }}
        h="12"
        display="flex"
        justifyContent="space-between"
        //leftIcon={PmCurrencyName ? <PmAvatar icon={PmIcon} /> : ""}
        rightIcon={<Arrow isUp={false} />}
        leftIcon={
          PmCurrencyName ? (
            <CircularIcon icon={PmIcon} color={PmColor || "gray"} />
          ) : (
            <></>
          )
        }
      >
        {PmCurrencyName ? (
          <Box>
            <Text fontSize="lg">{PmCurrencyName}</Text>
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
