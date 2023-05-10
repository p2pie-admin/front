import {
  Button,
  Modal,
  ModalContent,
  ModalOverlay,
  useColorModeValue,
  Text,
  HStack,
  Box,
} from "@chakra-ui/react";
import { useAppSelector, useAppDispatch } from "../../../../redux/hooks";
import { triggerInfoModal } from "../../../../redux/mainReducer";
import CustomModal from "../../../shared/CustomModal";
import { capitalize } from "../../side/pmModalButton/section/PmGroup/helper";
import { BsArrowRight, BsInfoCircle } from "react-icons/bs";
import { RxInfoCircled } from "react-icons/rx";
import { ImInfo } from "react-icons/im";
import ExchangerDescription from "../../../shared/ExchangerDescription";

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

  const swiperIdVisible = useAppSelector((state) => state.main.swiperIdVisible);
  const rate = useAppSelector(
    (state) => state.main.dirRates?.[swiperIdVisible]
  );

  return (
    <>
      <CustomModal
        isOpen={isOpen}
        handleDialogClose={triggerModal}
        header={<Header />}
        isLoading={false}
        isError={false}
      >
        <ExchangerDescription exchangerId={rate?.exchangerId} />
      </CustomModal>
      <Button
        variant={buttonVariant}
        onClick={() => triggerModal()}
        rightIcon={<ImInfo size="1rem" />}
      >
        Info
      </Button>
    </>
  );
};

export default ExchangeInfo;
