import { Box, Divider, Flex, HStack, Image, Text, VStack } from "@chakra-ui/react";
import { MdVerified } from "react-icons/md";
import { FaHandshake, FaStar, FaRegClock } from "react-icons/fa";
import { IoMdListBox } from "react-icons/io";
import { IconType } from "react-icons";
import { IMaker } from "../../../types/p2p";
import { BoxWrapper } from "../../shared/BoxWrapper";
import Actions from "../../exchangers/exchanger/exchangerTopPanel/Actions";
import { getAvatarSrc, getMakerDisplayName } from "../makers/helper";
import { useLocale, useT } from "../../../services/i18n";

const ruPlural = (n: number, [one, few, many]: [string, string, string]) => {
  const d = n % 10, h = n % 100;
  if (d === 1 && h !== 11) return one;
  if (d >= 2 && d <= 4 && (h < 12 || h > 14)) return few;
  return many;
};

// Time on the platform, rounded to the largest sensible unit: "5 дней", "2 недели", "3 месяца", "1 год".
// `short` = compact form for narrow phone cells: "10 мес.", "6 дн.", "2 нед.", "1 г." / "10 mo", "6 d", "2 wk", "1 yr".
const platformAge = (createdAt: string, locale: string, short = false) => {
  const days = Math.max(0, (Date.now() - new Date(createdAt).getTime()) / 86400000);
  const units: Array<{ from: number; size: number; ru: [string, string, string]; ruShort: string; en: string; enShort: string }> = [
    { from: 365, size: 365, ru: ["год", "года", "лет"], ruShort: "г.", en: "year", enShort: "yr" },
    { from: 60, size: 30.44, ru: ["месяц", "месяца", "месяцев"], ruShort: "мес.", en: "month", enShort: "mo" },
    { from: 14, size: 7, ru: ["неделя", "недели", "недель"], ruShort: "нед.", en: "week", enShort: "wk" },
    { from: 1, size: 1, ru: ["день", "дня", "дней"], ruShort: "дн.", en: "day", enShort: "d" },
  ];
  const unit = units.find((u) => days >= u.from);
  if (!unit) return locale === "en" ? "today" : "сегодня";
  const n = Math.max(1, Math.round(days / unit.size));
  if (short) return `${n} ${locale === "en" ? unit.enShort : unit.ruShort}`;
  return locale === "en" ? `${n} ${unit.en}${n === 1 ? "" : "s"}` : `${n} ${ruPlural(n, unit.ru)}`;
};

// Top card of the public maker page (owner's mockup 2026-10-17): large logo, name with status, square actions,
// a small level badge, four stat cells with icons and the maker's description underneath.
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
  const sinceShort = maker.createdAt ? platformAge(maker.createdAt, locale, true) : "—";
  // [value, phone value, label, icon]; the label keeps a non-breaking space so it reads as two words at 9 px.
  const stats: Array<[string | number, string | number, string, IconType]> = [
    [offers, offers, t("Предложений", "Offers"), IoMdListBox],
    [maker.deals_finished || 0, maker.deals_finished || 0, t("Сделок", "Deals"), FaHandshake],
    [reviews, reviews, t("Отзывы", "Reviews"), FaStar],
    [since, sinceShort, t("На\u00a0p2pie", "On\u00a0p2pie"), FaRegClock],
  ];

  // Four equal cells with vertical dividers: icon, number, label (owner's mockup 2026-10-17).
  // Phones: icon + number on one line, label below on the full cell width (wraps, no clipping);
  // desktop: icon left, number over label. Cells share the width equally (flex 1 + minW 0).
  const statsRow = (
    <Flex alignItems="stretch" w="100%">
      {stats.map(([value, phoneValue, label, StatIcon], i) => (
        <Flex key={label} direction={{ base: "column", lg: "row" }} alignItems={{ base: "flex-start", lg: "center" }}
          gap={{ base: "0", lg: "3" }} flex="1 1 0" minW={0} px={{ base: "1", lg: "3" }} py="1"
          borderLeftWidth={i > 0 ? "1px" : 0} borderColor="whiteAlpha.200" justifyContent={{ base: "flex-start", lg: "center" }}>
          <HStack spacing="1" alignItems="center" minW={0} maxW="100%">
            <Box color="peach.300" flexShrink={0} display={{ base: "block", lg: "none" }}>
              <StatIcon size="0.85rem" />
            </Box>
            <Box color="peach.300" flexShrink={0} display={{ base: "none", lg: "block" }}>
              <StatIcon size="1rem" />
            </Box>
            <Text fontWeight="bold" fontSize="xs" lineHeight="1.2" whiteSpace="nowrap" display={{ base: "block", lg: "none" }} suppressHydrationWarning>
              {phoneValue}
            </Text>
          </HStack>
          <VStack alignItems="flex-start" spacing="0" flex={{ base: "0 0 auto", lg: "1 1 0" }} minW={0} w={{ base: "100%", lg: "auto" }}>
            <Text fontWeight="bold" fontSize="md" lineHeight="1.2" whiteSpace="nowrap" display={{ base: "none", lg: "block" }} suppressHydrationWarning>
              {value}
            </Text>
            <Text fontSize={{ base: "9px", lg: "xs" }} color="bg.400" lineHeight="1.2" w="100%" wordBreak="break-word">
              {label}
            </Text>
          </VStack>
        </Flex>
      ))}
    </Flex>
  );

  // The logo is the hero of the card: a large rounded square on a light background.
  const logo = (
    <Box
      flexShrink={0}
      w={{ base: "72px", lg: "96px" }}
      h={{ base: "72px", lg: "96px" }}
      borderRadius="2xl"
      overflow="hidden"
      bg="bg.100"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      {avatar ? (
        <Image src={avatar} alt={name} w="100%" h="100%" objectFit="contain" />
      ) : (
        <Text fontWeight="bold" fontSize="2xl" color="bg.900">
          {name.slice(0, 1).toUpperCase()}
        </Text>
      )}
    </Box>
  );

  // Level as a small square badge with a ring and a "Lv. N" caption; it no longer competes with the logo.
  const levelBadge = (
    <VStack spacing="0" flexShrink={0} w={{ base: "56px", lg: "64px" }} h={{ base: "72px", lg: "80px" }} borderRadius="xl" bg="bg.900" borderWidth="1px" borderColor="whiteAlpha.200" justifyContent="center" title={t(`Уровень ${level}`, `Level ${level}`)}>
      <Box w={{ base: "34px", lg: "40px" }} h={{ base: "34px", lg: "40px" }} borderRadius="full" borderWidth="3px" borderColor="peach.300" display="flex" alignItems="center" justifyContent="center" boxShadow="0 0 10px rgba(255,179,107,0.45)">
        <Text fontWeight="bold" fontSize={{ base: "sm", lg: "md" }} color="peach.300" lineHeight="1">
          {level}
        </Text>
      </Box>
      <Text fontSize="10px" color="bg.300" mt="1" lineHeight="1">
        {`Lv. ${level}`}
      </Text>
    </VStack>
  );

  const title = (
    <VStack alignItems="flex-start" spacing="0.5" flex="1" minW={0}>
      {/* Badge and pencil flow right after the last word, so a two-line name keeps them next to the text. */}
      <Box noOfLines={2} wordBreak="break-word" lineHeight="short">
        <Text as="h1" display="inline" fontWeight="bold" fontSize={{ base: "md", lg: "xl" }} variant="primary">
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

  return (
    <BoxWrapper variant="no_contrast" p={{ base: "3", lg: "4" }}>
      {/* One row on every width: logo | name + status | bookmark + like | level badge. */}
      <Flex gap={{ base: "2.5", lg: "4" }} alignItems="center">
        {logo}
        {title}
        <Box flexShrink={0}>
          <Actions id={maker.id} displayName={name} square />
        </Box>
        {levelBadge}
      </Flex>
      <Divider my="3" />
      {statsRow}
      {/* The maker's own description sits right under the stats; its edit form stays on /p2p/edit. */}
      {description ? (
        <>
          <Divider my="3" />
          <Text fontSize="sm" color="bg.300" whiteSpace="pre-line" wordBreak="break-word">
            {description}
          </Text>
        </>
      ) : null}
    </BoxWrapper>
  );
}
