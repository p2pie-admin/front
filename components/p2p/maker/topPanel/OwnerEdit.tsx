import { Box, Button, HStack, Image, Text, VStack } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { MdModeEdit } from "react-icons/md";
import { LiaTelegramPlane } from "react-icons/lia";
import CustomModal from "../../../shared/CustomModal";
import { useAppDispatch } from "../../../../redux/hooks";
import { triggerModal } from "../../../../redux/mainReducer";
import { useT } from "../../../../services/i18n";
import { IMaker } from "../../../../types/p2p";
import { getAvatarSrc, getMakerDisplayName } from "../../makers/helper";

// Pencil on the public maker page: explains that edits need the maker's Telegram account (shown by its public
// name and logo, never the username) and leads to the editor, where the bot proves ownership.
export default function OwnerEdit({ maker, place = "main" }: { maker: IMaker; place?: string }) {
  const dispatch = useAppDispatch();
  const t = useT();
  const router = useRouter();
  const slug = maker.slug;
  const name = getMakerDisplayName(maker);
  const avatar = getAvatarSrc(maker.avatar?.url);
  const modalId = `owner_edit_${place}_${slug}`;
  const close = () => dispatch(triggerModal(undefined));

  return (
    <>
      <CustomModal id={modalId} header={t("Редактирование страницы", "Edit page")}>
        <VStack spacing="5" p="6" pt="2" textAlign="center">
          <Box position="relative">
            <Box
              w="96px"
              h="96px"
              borderRadius="2xl"
              overflow="hidden"
              bg="bg.800"
              display="flex"
              alignItems="center"
              justifyContent="center"
              boxShadow="0 0 0 3px var(--chakra-colors-peach-300), 0 10px 30px rgba(0,0,0,0.35)"
            >
              {avatar ? (
                <Image src={avatar} alt={name} w="100%" h="100%" objectFit="cover" />
              ) : (
                <Text fontWeight="bold" fontSize="4xl">
                  {name.slice(0, 1).toUpperCase()}
                </Text>
              )}
            </Box>
            <Box
              position="absolute"
              right="-10px"
              bottom="-10px"
              w="34px"
              h="34px"
              borderRadius="full"
              bg="#2AABEE"
              color="white"
              display="flex"
              alignItems="center"
              justifyContent="center"
              borderWidth="3px"
              borderColor="bg.900"
            >
              <LiaTelegramPlane size="1.1rem" />
            </Box>
          </Box>
          <Text fontWeight="bold" fontSize="xl" variant="primary" wordBreak="break-word">
            {name}
          </Text>
          <Text color="bg.300" maxW="380px">
            {t(
              `Для внесения изменений на этой странице необходимо войти под аккаунтом Telegram «${name}».`,
              `To change this page you need to sign in with the Telegram account «${name}».`,
            )}
          </Text>
          <Text color="bg.500" fontSize="sm" maxW="380px">
            {t(
              "Вход подтверждается через нашего бота, другие аккаунты изменить страницу не смогут.",
              "Sign-in is confirmed through our bot; other accounts cannot change the page.",
            )}
          </Text>
          <HStack justifyContent="center" spacing="3" w="100%" pt="1">
            <Button variant="outline" onClick={close}>
              {t("Отмена", "Cancel")}
            </Button>
            <Button
              variant="primary"
              leftIcon={<LiaTelegramPlane size="1.2rem" />}
              onClick={() => {
                close();
                router.push(`/p2p/edit/${slug}`);
              }}
            >
              {t("Войти через Telegram", "Sign in with Telegram")}
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
