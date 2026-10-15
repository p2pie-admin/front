import {
  Box,
  Button,
  Heading,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import {
  normalizeTelegramSlug,
  storeTelegramConfirmation,
  verifyTelegramToken,
} from "../../../services/telegram";
import { useT } from "../../../services/i18n";

export default function TelegramConfirmPage() {
  const router = useRouter();
  const t = useT();
  const token = useMemo(() => {
    const queryToken = router.query?.token;
    return Array.isArray(queryToken) ? queryToken[0] : queryToken;
  }, [router.query]);

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );
  const [message, setMessage] = useState<string>(t("Подготовка...", "Preparing..."));
  const [slug, setSlug] = useState<string>("");

  useEffect(() => {
    if (!router.isReady) return;
    if (!token) {
      setStatus("error");
      setMessage(t("Не найден token подтверждения", "Confirmation token not found"));
      return;
    }

    let isMounted = true;
    setStatus("loading");
    setMessage(t("Проверяем подтверждение в Telegram...", "Checking the Telegram confirmation..."));

    verifyTelegramToken(token)
      .then((response) => {
        if (!isMounted) return;
        if (!response.ok) {
          setStatus("error");
          setMessage(t("Подтверждение не прошло проверку", "The confirmation did not pass the check"));
          return;
        }

        const normalized = normalizeTelegramSlug(response.slug);
        if (!normalized) {
          setStatus("error");
          setMessage(t("Некорректные данные подтверждения", "Invalid confirmation data"));
          return;
        }

        storeTelegramConfirmation({
          slug: normalized,
          token,
          telegramUsername: response.telegramUsername,
          confirmedAt: Date.now(),
        });

        setSlug(normalized);
        setStatus("success");
        setMessage(t("Подтверждение получено. Теперь можно сохранить офферы.", "Confirmation received. You can now save your offers."));
      })
      .catch(() => {
        if (!isMounted) return;
        setStatus("error");
        setMessage(t("Не удалось проверить подтверждение", "Could not check the confirmation"));
      });

    return () => {
      isMounted = false;
    };
  }, [router.isReady, token]);

  const canGoBack = status === "success" && slug;

  return (
    <VStack spacing={6} py={{ base: 10, lg: 20 }} px={4} align="center">
      <Box maxW="560px" w="100%" bg="bg.800" p={6} borderRadius="xl">
        <VStack spacing={4} align="stretch">
          <Heading size="md">{t("Подтверждение Telegram", "Telegram confirmation")}</Heading>
          <Text color="bg.300">{message}</Text>
          {canGoBack && (
            <Button
              onClick={() => void router.push(`/p2p/edit/${slug}`)}
              colorScheme="orange"
            >
              {t("Вернуться к редактированию", "Back to editing")}
            </Button>
          )}
          {status === "error" && (
            <Button onClick={() => void router.back()} variant="outline">
              {t("Назад", "Back")}
            </Button>
          )}
        </VStack>
      </Box>
    </VStack>
  );
}
