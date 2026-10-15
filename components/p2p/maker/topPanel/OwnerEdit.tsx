import { Box, Button, HStack, Text, VStack } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { MdModeEdit } from "react-icons/md";
import CustomModal from "../../../shared/CustomModal";
import { useAppDispatch } from "../../../../redux/hooks";
import { triggerModal } from "../../../../redux/mainReducer";

// Pencil on the public maker page: asks whether the visitor owns the page; only the owner goes to the editor
// (where ownership is still proven through the Telegram bot).
export default function OwnerEdit({ slug }: { slug: string }) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const modalId = `owner_edit_${slug}`;
  const close = () => dispatch(triggerModal(undefined));

  return (
    <>
      <CustomModal id={modalId} header="Редактирование страницы">
        <VStack align="stretch" spacing="5" p="6">
          <Text>Вы владелец этой страницы?</Text>
          <HStack justifyContent="flex-end" spacing="3">
            <Button variant="outline" onClick={close}>
              Нет
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                close();
                router.push(`/p2p/edit/${slug}`);
              }}
            >
              Да
            </Button>
          </HStack>
        </VStack>
      </CustomModal>
      <Box
        as="button"
        aria-label="Редактировать страницу"
        cursor="pointer"
        filter=" brightness(0.8)"
        onClick={() => dispatch(triggerModal(modalId))}
        _hover={{ filter: " brightness(1.1)" }}
      >
        <MdModeEdit size="1.2rem" />
      </Box>
    </>
  );
}
