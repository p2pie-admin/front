import {
  Modal,
  ModalOverlay,
  ModalContent,
  useColorModeValue,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Text,
  Box,
  useToken,
  useColorMode,
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
  const [shaderColor] = useToken(
    "colors",
    useColorModeValue(["bg.100"], ["bg.700"])
  );
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
        bgColor={useColorModeValue("bg.50", "bg.800")}
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
          <Box w="100%" h="20" onScroll={(e) => e.preventDefault()} />
        </ModalBody>
        <Box
          w="100%"
          h="2"
          boxShadow={`0 11px 51px 46px ${shaderColor}`}
          // bgGradient={`linear-gradient(0deg, ${shaderColor} , transparent)`}
          position="absolute"
          left="0"
          bottom="0"
          zIndex="10"
        />
      </ModalContent>
    </Modal>
  );
};

export default CustomModal;
