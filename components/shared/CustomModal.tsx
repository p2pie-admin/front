import {
  Modal,
  ModalOverlay,
  ModalContent,
  useColorModeValue,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
} from "@chakra-ui/react";
import { ReactJSXElement } from "@emotion/react/types/jsx-namespace";
import header from "../layout/header";
import ErrorWrapper from "./ErrorWrapper";

const CustomModal = ({
  children,
  isOpen,
  handleDialogClose,
  header,
  isLoading,
  isError,
}: {
  children: ReactJSXElement;
  isOpen: boolean;
  handleDialogClose: Function;
  header: string | ReactJSXElement;
  isLoading: boolean;
  isError: boolean;
}) => {
  return (
    <Modal size={"lg"} isOpen={isOpen} onClose={() => handleDialogClose()}>
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
          pb="1"
          position="relative"
          display="flex"
          justifyContent="center"
        >
          {header}
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
          <ErrorWrapper
            isError={isError}
            isLoading={isLoading}
            primaryMessage="Connection error!"
            secondaryMessage="CMS connection is lost!"
            linkMessage="report"
          >
            {children}
          </ErrorWrapper>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default CustomModal;
