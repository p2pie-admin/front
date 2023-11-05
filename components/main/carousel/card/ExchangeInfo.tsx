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
import { triggerModal } from "../../../../redux/mainReducer";
import CustomModal from "../../../shared/CustomModal";
import { capitalize } from "../../side/pmModalButton/section/PmGroup/helper";
import { BsArrowRight } from "react-icons/bs";
import { RxInfoCircled } from "react-icons/rx";

import ExchangerDetails from "../../../shared/ExchangerDetails";
import RateDetails from "../../../shared/RateDetails";
import PmFullName from "../../../shared/PmFullName";

const ExchangeInfo = () => {
  const givePm = useAppSelector((state) => state.main.givePm);
  const getPm = useAppSelector((state) => state.main.getPm);

  if (!givePm || !getPm) return <></>;

  const Header = () => (
    <HStack>
      <PmFullName pm={givePm} />
      <BsArrowRight size="1.5rem" />
      <PmFullName pm={getPm} />
    </HStack>
  );

  return (
    <CustomModal id="exchange-info" header={<Header />}>
      <Box p="2" minH="200">
        <ExchangerDetails />
        <RateDetails />
      </Box>
    </CustomModal>
  );
};

export default ExchangeInfo;
