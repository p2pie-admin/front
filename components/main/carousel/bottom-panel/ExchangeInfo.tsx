import {
  Button,
  Modal,
  ModalContent,
  ModalOverlay,
  useColorModeValue,
  Text,
  HStack,
  Box,
  Grid,
} from "@chakra-ui/react";
import { useAppSelector, useAppDispatch } from "../../../../redux/hooks";
import { triggerInfoModal } from "../../../../redux/mainReducer";
import CustomModal from "../../../shared/CustomModal";
import { capitalize } from "../../side/pmModalButton/section/PmGroup/helper";
import { BsArrowRight, BsInfoCircle, BsQuestionCircle } from "react-icons/bs";
import { RxInfoCircled } from "react-icons/rx";

import ExchangerDetails from "../../../shared/ExchangerDetails";
import RateDetails from "../../../shared/RateDetails";

const ExchangeInfo = () => {
  const isOpen = useAppSelector((state) => state.main.infoModalOpened);
  const [giveName, getName] = useAppSelector((state) => [
    state.main.givePm?.en_name,
    state.main.getPm?.en_name,
  ]);

  const dispatch = useAppDispatch();
  const buttonVariant = useColorModeValue("light", "shaded");

  const triggerModal = () => dispatch(triggerInfoModal());
  const Header = () => (
    <HStack justifyContent="center">
      <Text>{capitalize(giveName)}</Text>
      <BsArrowRight />
      <Text>{capitalize(getName)}</Text>
    </HStack>
  );

  return (
    <CustomModal
      isOpen={isOpen}
      handleDialogClose={triggerModal}
      header={<Header />}
      isLoading={false}
      isError={false}
    >
      <Box p="2" minH="200">
        <ExchangerDetails />
        <RateDetails />
      </Box>
    </CustomModal>
  );
};

export default ExchangeInfo;
