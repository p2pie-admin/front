import React from "react";
import { IMaker } from "../../../../types/p2p";
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

export default function SaveDetails({ maker }: { maker: IMaker }) {
  const telegramUsername = maker.telegram_username?.replace(/^@/, "") || "";
  const dispatch = useAppDispatch();
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
        }),
      );
      dispatch(triggerModal(undefined));
    },
  });
  useTelegramConfirmPolling({
    enabled: isModalOpen,
    slug: telegramUsername,
    onSuccess: () => {
      dispatch(
        saveProjectP2P({
          makerId: String(maker.id),
          makerSlug: telegramUsername,
          confirmed: true,
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
        }),
      );
    });
  };
  return (
    <VStack justifyContent="center" alignItems="center" spacing="4" mt="4">
      <Text textAlign="center" fontSize="lg" color="bg.300">
        <Highlight
          query={[`${"@" + telegramUsername}`]}
          styles={{ color: "peach.300", fontWeight: "bold" }}
        >
          {`Чтобы подтвердить изменения, перейдите в телеграм-бота с аккаунта ${"@" + telegramUsername} и нажмите старт. `}
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
        Перейти в телеграм
      </Button>
    </VStack>
  );
}
