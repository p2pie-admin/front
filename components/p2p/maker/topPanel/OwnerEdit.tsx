import { Box, Button, HStack, Text, VStack } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { MdModeEdit } from "react-icons/md";
import CustomModal from "../../../shared/CustomModal";
import { useAppDispatch } from "../../../../redux/hooks";
import { triggerModal } from "../../../../redux/mainReducer";
import { useT } from "../../../../services/i18n";

// Pencil on the public maker page: asks whether the visitor owns the page; only the owner goes to the editor
// (where ownership is still proven through the Telegram bot).
export default function OwnerEdit({ slug }: { slug: string }) {
  const dispatch = useAppDispatch();
  const t = useT();
  const router = useRouter();
  const modalId = `owner_edit_${slug}`;
  const close = () => dispatch(triggerModal(undefined));

  return (
    <>
      <CustomModal id={modalId} header={t("Редактирование страницы", "Edit page")}>
        <VStack align="stretch" spacing="5" p="6">
          <Text>{t("Вы владелец этой страницы?", "Are you the owner of this page?")}</Text>
          <HStack justifyContent="flex-end" spacing="3">
            <Button variant="outline" onClick={close}>
              {t("Нет", "No")}
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                close();
                router.push(`/p2p/edit/${slug}`);
              }}
            >
              {t("Да", "Yes")}
            </Button>
          </HStack>
        </VStack>
      </CustomModal>
      <Box
        as="button"
        aria-label={t("Редактировать страницу", "Edit page")}
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
