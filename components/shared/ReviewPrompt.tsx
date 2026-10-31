import { useEffect, useState } from "react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { Box, Button, CloseButton, HStack, Text } from "@chakra-ui/react";
import { useT } from "../../services/i18n";

// After someone leaves for an exchanger's website, ask on a later visit (12 h to 14 days after the click)
// how the exchange went. Our own reviews are the honest way to grow them; nothing is shown twice for a click.
const KEY = "p2pie:lastOutbound";
const MIN_AGE = 12 * 3600 * 1000;
const MAX_AGE = 14 * 24 * 3600 * 1000;

type Stored = { host: string; t: number; asked?: boolean };

const read = (): Stored | null => {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "null");
  } catch {
    return null;
  }
};
const write = (v: Stored) => {
  try {
    localStorage.setItem(KEY, JSON.stringify(v));
  } catch {}
};

const ReviewPrompt = () => {
  const t = useT();
  const router = useRouter();
  const [target, setTarget] = useState<{ slug: string; name: string } | null>(null);

  // Remember outbound clicks (exchange buttons, offer rows); internal links are ignored.
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      try {
        const a = (event.target as Element | null)?.closest?.("a") as HTMLAnchorElement | null;
        if (!a) return;
        const url = new URL(a.href, window.location.href);
        if (!/^https?:$/.test(url.protocol) || url.hostname === window.location.hostname) return;
        if (/(^|\.)(t\.me|telegram\.me|google\.|yandex\.|bestchange\.|kurs\.expert)/.test(url.hostname)) return;
        write({ host: url.hostname.replace(/^www\./, ""), t: Date.now() });
      } catch {}
    };
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  useEffect(() => {
    const last = read();
    if (!last || last.asked) return;
    const age = Date.now() - last.t;
    if (age < MIN_AGE || age > MAX_AGE) return;
    fetch(`/api/exchanger-by-host?host=${encodeURIComponent(last.host)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((hit) => {
        if (hit?.slug && !router.asPath.startsWith(`/exchangers/${hit.slug}`)) setTarget(hit);
        else if (!hit) write({ ...last, asked: true });
      })
      .catch(() => undefined);
    // Once per page load is enough; route changes re-check through asPath.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.asPath]);

  if (!target) return null;
  const close = () => {
    const last = read();
    if (last) write({ ...last, asked: true });
    setTarget(null);
  };

  return (
    <Box position="fixed" bottom={{ base: 3, md: 6 }} left={{ base: 3, md: "auto" }} right={{ base: 3, md: 6 }} zIndex={1400}
      maxW={{ md: "380px" }} p="4" borderRadius="xl" bgColor="bg.800" borderWidth="1px" borderColor="whiteAlpha.300" boxShadow="dark-lg">
      <HStack alignItems="start" justifyContent="space-between" gap="2">
        <Text color="bg.100" fontSize="sm">
          {t(`Как прошёл обмен в ${target.name}? Пара строк отзыва поможет другим выбрать обменник.`,
             `How did the exchange with ${target.name} go? A couple of lines will help others choose.`)}
        </Text>
        <CloseButton size="sm" onClick={close} aria-label={t("Закрыть", "Close")} />
      </HStack>
      <HStack mt="3" gap="2">
        <Button as={NextLink} href={`/exchangers/${target.slug}#leave-review-section`} size="sm" variant="primary" onClick={close}>
          {t("Оставить отзыв", "Leave a review")}
        </Button>
        <Button size="sm" variant="ghost" onClick={close}>
          {t("Не сейчас", "Not now")}
        </Button>
      </HStack>
    </Box>
  );
};

export default ReviewPrompt;
