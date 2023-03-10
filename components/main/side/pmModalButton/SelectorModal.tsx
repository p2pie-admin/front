import {
  Modal,
  ModalOverlay,
  ModalContent,
  useColorModeValue,
  Box,
} from "@chakra-ui/react";
import { useContext } from "react";
import { batch } from "react-redux";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { setActiveSide } from "../../../../redux/mainReducer";
import Shader from "../../../shared/Shader";
import Selector from "./Selector";

const SelectorModal = () => {
  const isOpen = useAppSelector((state) => state.main.activeSide !== null);

  const gradient = useColorModeValue(
    "linear-gradient(0deg, rgba(241,240,251,1) 10%, rgba(241,240,251,0) 100%);",
    "linear-gradient(0deg, rgba(88,79,98,1) 20%, rgba(88,79,98,0) 100%);"
  );

  const dispatch = useAppDispatch();

  const handleDialogClose = () => dispatch(setActiveSide(null));

  return (
    <Modal size={"lg"} isOpen={isOpen} onClose={handleDialogClose}>
      <ModalOverlay />
      <ModalContent
        borderRadius="2xl"
        p="2"
        bgColor={useColorModeValue("bg.50", "bg.800")}
        color={useColorModeValue("bg.400", "bg.100")}
        overflow="hidden"
        h={{
          base: "68vh",
          sm: "78vh",
        }}
      >
        <Selector />
      </ModalContent>
    </Modal>
  );
};

export default SelectorModal;
