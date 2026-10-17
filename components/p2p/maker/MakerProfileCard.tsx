import { Box, Divider, Flex, HStack, Image, Text, VStack } from "@chakra-ui/react";
import { MdVerified } from "react-icons/md";
import { IMaker } from "../../../types/p2p";
import { BoxWrapper } from "../../shared/BoxWrapper";
import Actions from "../../exchangers/exchanger/exchangerTopPanel/Actions";
import MakerRating from "../edit/stats/MakerRating";
import { getAvatarSrc, getMakerDisplayName } from "../makers/helper";
import { useLocale, useT } from "../../../services/i18n";

const ruPlural = (n: number, [one, few, many]: [string, string, string]) => {
  const d = n % 10, h = n % 100;
  if (d === 1 && h !== 11) return one;
  if (d >= 2 && d <= 4 && (h < 12 || h > 14)) return few;
  return many;
};

// Time on the platform, rounded to the largest sensible unit: "5 дней", "2 недели", "3 месяца", "1 год".
const platformAge = (createdAt: string, locale: string) => {
  const days = Math.max(0, (Date.now() - new Date(createdAt).getTime()) / 86400000);
  const units: Array<{ from: number; size: number; ru: [string, string, string]; en: string }> = [
    { from: 365, size: 365, ru: ["год", "года", "лет"], en: "year" },
    { from: 60, size: 30.44, ru: ["месяц", "месяца", "месяцев"], en: "month" },
    { from: 14, size: 7, ru: ["неделя", "недели", "недель"], en: "week" },
    { from: 1, size: 1, ru: ["день", "дня", "дней"], en: "day" },
  ];
  const unit = units.find((u) => days >= u.from);
  if (!unit) return locale === "en" ? "today" : "сегодня";
  const n = Math.max(1, Math.round(days / unit.size));
  return locale === "en" ? `${n} ${unit.en}${n === 1 ? "" : "s"}` : `${n} ${ruPlural(n, unit.ru)}`;
};

// Top card of the public maker page: level ring, square logo, name with status, actions and a compact stats row.
export default function MakerProfileCard({ maker }: { maker: IMaker }) {
  const t = useT();
  const locale = useLocale();
  const name = getMakerDisplayName(maker);
  const avatar = getAvatarSrc(maker.avatar?.url);
  const level = maker.p2p_level?.level || 1;
  const online = maker.status === "active";
  const offers = Array.isArray(maker.offers) ? maker.offers.length : 0;
  const reviews = Array.isArray(maker.reviews) ? maker.reviews.length : 0;
  const description = ((locale === "en" && maker.en_description) || maker.description || "").trim();
  const since = maker.createdAt ? platformAge(maker.createdAt, locale) : "—";
  const stats: Array<[string | number, string]> = [
    [offers, t("Предложений", "Offers")],
    [maker.deals_finished || 0, t("Сделок", "Deals")],
    [reviews, t("Отзывы", "Reviews")],
    [since, t("На платформе", "On p2pie")],
  ];

  // Content-sized items spread over the row, so long labels never touch the dividers on phones.
  const statsRow = (
    <HStack spacing={{ base: "2", lg: "4" }} alignItems="stretch" justifyContent="space-between" w="100%">
      {stats.map(([value, label], i) => (
        <HStack key={label} spacing={{ base: "2", lg: "4" }} alignItems="stretch" flex="0 1 auto" minW={0}>
          {i > 0 ? <Divider orientation="vertical" h="auto" /> : null}
          <VStack alignItems="flex-start" spacing="0" minW={0}>
            <Text fontWeight="bold" fontSize={{ base: "sm", lg: "md" }} color={i === 3 ? "peach.300" : undefined} noOfLines={1} suppressHydrationWarning>
              {value}
            </Text>
            <Text fontSize={{ base: "11px", lg: "xs" }} color="bg.400" noOfLines={1}>
              {label}
            </Text>
          </VStack>
        </HStack>
      ))}
    </HStack>
  );

  const logo = (
    <Box
      flexShrink={0}
      w={{ base: "36px", lg: "48px" }}
      h={{ base: "36px", lg: "48px" }}
      borderRadius="xl"
      overflow="hidden"
      bg="bg.800"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      {avatar ? (
        <Image src={avatar} alt={name} w="100%" h="100%" objectFit="cover" />
      ) : (
        <Text fontWeight="bold" fontSize="lg">
          {name.slice(0, 1).toUpperCase()}
        </Text>
      )}
    </Box>
  );

  // The logo sits on the level ring's lower right corner, like an avatar badge.
  const logoBadge = (
    <Box position="absolute" right="-6px" bottom="-6px" zIndex={3} borderRadius="xl" borderWidth="2px" borderColor="bg.900" lineHeight={0}>
      {logo}
    </Box>
  );

  const title = (
    <VStack alignItems="flex-start" spacing="0.5" flex="1" minW={0}>
      {/* Badge and pencil flow right after the last word, so a two-line name keeps them next to the text. */}
      <Box noOfLines={3} wordBreak="break-word" lineHeight="short">
        <Text as="h1" display="inline" fontWeight="bold" fontSize={{ base: "lg", lg: "xl" }} variant="primary">
          {name}
        </Text>
        <Box as="span" display="inline-flex" alignItems="center" gap="1.5" ml="1.5" verticalAlign="middle">
          {level > 1 ? (
            <Box as="span" color="peach.300" title={t("Проверенный мейкер", "Verified maker")}>
              <MdVerified size="1.1rem" />
            </Box>
          ) : null}
        </Box>
      </Box>
      <HStack spacing="1.5">
        <Box w="8px" h="8px" borderRadius="full" bg={online ? "green.400" : "orange.400"} />
        <Text fontSize="sm" color="bg.400">
          {online ? t("Онлайн", "Online") : t("Не на связи", "Away")}
        </Text>
      </HStack>
    </VStack>
  );

  const actions = (
    <Box flexShrink={0}>
      <Actions id={maker.id} displayName={name} />
    </Box>
  );

  return (
    <BoxWrapper variant="no_contrast">
      {/* Desktop: ring with the logo badge | name + actions, stats underneath. */}
      <Flex display={{ base: "none", lg: "flex" }} gap="6" alignItems="center">
        <Box flexShrink={0} position="relative">
          <MakerRating level={level} completed={0} total={0} />
          {logoBadge}
        </Box>
        <VStack alignItems="stretch" spacing="3" flex="1" minW={0}>
          <HStack alignItems="center" spacing="3">
            {title}
            {actions}
          </HStack>
          {statsRow}
        </VStack>
      </Flex>
      {/* Phones: one row = level ring with the logo as a corner badge | name and status | stacked actions. */}
      <Box display={{ base: "block", lg: "none" }}>
        <Flex gap="3" alignItems="center">
          <Box flexShrink={0} w="84px" h="84px" position="relative">
            <Box position="absolute" top="0" left="0" transform="scale(0.7)" transformOrigin="top left">
              <MakerRating level={level} completed={0} total={0} />
            </Box>
            {logoBadge}
          </Box>
          {title}
          <Box flexShrink={0} w="52px">
            <Actions id={maker.id} displayName={name} stacked />
          </Box>
        </Flex>
        <Divider my="3" />
        {statsRow}
      </Box>
      {/* The maker's own description sits right under the stats; its edit form stays on /p2p/edit. */}
      {description ? (
        <Text mt={{ base: "3", lg: "4" }} fontSize="sm" color="bg.300" whiteSpace="pre-line" wordBreak="break-word">
          {description}
        </Text>
      ) : null}
    </BoxWrapper>
  );
}
