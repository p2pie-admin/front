import {
  Modal,
  ModalOverlay,
  ModalContent,
  useColorModeValue,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Text,
} from "@chakra-ui/react";
import { ReactJSXElement } from "@emotion/react/types/jsx-namespace";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { triggerModal } from "../../redux/mainReducer";

const CustomModal = ({
  children,
  id,
  header,
}: {
  children: ReactJSXElement;
  id: string;
  header: string | ReactJSXElement;
}) => {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.main.modal === id);
  return (
    <Modal
      size={"lg"}
      isOpen={isOpen}
      onClose={() => dispatch(triggerModal(undefined))}
    >
      <ModalOverlay />
      <ModalContent
        borderRadius="2xl"
        p="2"
        bgColor={useColorModeValue("bg.100", "bg.800")}
        color={useColorModeValue("bg.400", "bg.100")}
        overflow="hidden"
        h="78vh"
      >
        <ModalHeader
          w="100%"
          pt="2"
          pb="2"
          position="relative"
          display="flex"
          justifyContent="center"
        >
          <Text variant="contrast">{header}</Text>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody
          pb={6}
          p="0"
          overflowY="scroll"
          overflowX="hidden"
          sx={{
            "&::-webkit-scrollbar": {
              width: "0",
            },
            //  "&::-webkit-overflow-scrolling": "touch",
          }}
        >
          {children}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default CustomModal;
