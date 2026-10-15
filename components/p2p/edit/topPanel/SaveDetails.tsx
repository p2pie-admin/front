import React from "react";
import { Button, Box, Text, VStack, Highlight } from "@chakra-ui/react";
import { batch } from "react-redux";
import { triggerModal } from "../../../../redux/mainReducer";
import { saveProjectP2P } from "../../../../redux/thunks";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { RiTelegram2Fill } from "react-icons/ri";
import Image from "next/image";
import telegramStart from "../../../../public/telegram_start.jpg";
import { Box3D } from "../../../../styles/theme/custom";
import useTelegramConfirmPolling from "../../../../services/hooks/telegramConfirmPolling";
import { useMakerEditContext } from "../MakerEditContext";
import { useLocale, useT } from "../../../../services/i18n";

export default function SaveDetails() {
  const maker = useMakerEditContext();
  // The confirmation goes by the public slug; the bot matches it with the private Telegram username.
  const telegramUsername = maker.slug;
  const dispatch = useAppDispatch();
  const locale = useLocale();
  const t = useT();
  const isModalOpen = useAppSelector(
    (state) => state.main?.modal === `save_${telegramUsername}`,
  );
  useTelegramConfirmPolling({
    enabled: isModalOpen,
    slug: telegramUsername,
    onSuccess: () => {
      dispatch(
        saveProjectP2P({
          makerId: String(maker.id),
          makerSlug: telegramUsername,
          confirmed: true,
          locale,
        }),
      );
      dispatch(triggerModal(undefined));
    },
  });
  const handleSaveProject = () => {
    batch(() => {
      dispatch(triggerModal(`save_${telegramUsername}`));
      dispatch(
        saveProjectP2P({
          makerId: String(maker.id),
          makerSlug: telegramUsername,
          confirmed: false,
          locale,
        }),
      );
    });
  };
  return (
    <VStack justifyContent="center" alignItems="center" spacing="4" mt="4">
      <Text textAlign="center" fontSize="md" color="bg.300">
        <Highlight
          query={[t("Telegram-аккаунта", "Telegram account")]}
          styles={{ color: "peach.300", fontWeight: "bold" }}
        >
          {t("Чтобы подтвердить изменения, перейдите в телеграм-бот с Telegram-аккаунта, привязанного к этой странице, и нажмите старт. ", "To confirm the changes, open the Telegram bot from the Telegram account linked to this page and press Start. ")}
        </Highlight>
      </Text>

      <Box3D
        overflow="hidden"
        m="2"
        variant="no_contrast"
        cursor="pointer"
        transform="scale(1)"
        transition="transform 0.2s ease, filter 0.2s ease"
        _hover={{ transform: "scale(1.01)", filter: "brightness(1.1)" }}
        onClick={handleSaveProject}
      >
        <Image
          src={telegramStart}
          alt={"telegram start"}
          style={{ objectFit: "cover" }}
          placeholder="blur"
        />
      </Box3D>
      <Button
        onClick={handleSaveProject}
        variant="outline"
        colorScheme="blue"
        rightIcon={<RiTelegram2Fill size="1rem" />}
      >
        {t("Перейти в телеграм", "Open Telegram")}
      </Button>
    </VStack>
  );
}
