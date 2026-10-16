import { Box, Divider, Flex, HStack, Image, Text, VStack } from "@chakra-ui/react";
import { MdVerified } from "react-icons/md";
import { IMaker } from "../../../types/p2p";
import { BoxWrapper } from "../../shared/BoxWrapper";
import Actions from "../../exchangers/exchanger/exchangerTopPanel/Actions";
import MakerRating from "../edit/stats/MakerRating";
import OwnerEdit from "./topPanel/OwnerEdit";
import { getAvatarSrc, getMakerDisplayName } from "../makers/helper";
import { intlLocale, useLocale, useT } from "../../../services/i18n";

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
  const since = maker.createdAt
    ? new Intl.DateTimeFormat(intlLocale(locale), { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(maker.createdAt))
    : "—";
  const stats: Array<[string | number, string]> = [
    [offers, t("Предложений", "Offers")],
    [maker.deals_finished || 0, t("Сделок", "Deals")],
    [reviews, t("Отзывы", "Reviews")],
    [since, t("На платформе", "On p2pie since")],
  ];

  // Content-sized items spread over the row, so long labels never touch the dividers on phones.
  const statsRow = (
    <HStack spacing={{ base: "2", lg: "4" }} alignItems="stretch" justifyContent="space-between" w="100%">
      {stats.map(([value, label], i) => (
        <HStack key={label} spacing={{ base: "2", lg: "4" }} alignItems="stretch" flex="0 1 auto" minW={0}>
          {i > 0 ? <Divider orientation="vertical" h="auto" /> : null}
          <VStack alignItems="flex-start" spacing="0" minW={0}>
            <Text fontWeight="bold" fontSize={{ base: "sm", lg: "md" }} color={i === 3 ? "peach.300" : undefined} noOfLines={1}>
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
      w={{ base: "40px", lg: "52px" }}
      h={{ base: "40px", lg: "52px" }}
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

  const title = (
    <VStack alignItems="flex-start" spacing="0.5" flex="1" minW={0}>
      <HStack spacing="1.5" minW={0} maxW="100%">
        <Text as="h1" fontWeight="bold" fontSize={{ base: "lg", lg: "xl" }} lineHeight="short" noOfLines={2} wordBreak="break-word" variant="primary">
          {name}
        </Text>
        {level > 1 ? (
          <Box color="peach.300" title={t("Проверенный мейкер", "Verified maker")} flexShrink={0}>
            <MdVerified size="1.1rem" />
          </Box>
        ) : null}
        <OwnerEdit slug={maker.slug} />
      </HStack>
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
      {/* Desktop: ring | logo + name + actions, stats underneath. */}
      <Flex display={{ base: "none", lg: "flex" }} gap="6" alignItems="center">
        <MakerRating level={level} completed={0} total={0} />
        <VStack alignItems="stretch" spacing="3" flex="1" minW={0}>
          <HStack alignItems="flex-start" spacing="3">
            {logo}
            {title}
            {actions}
          </HStack>
          {statsRow}
        </VStack>
      </Flex>
      {/* Phones: a smaller ring, then logo + actions on one line and the name with the full column width below. */}
      <Box display={{ base: "block", lg: "none" }}>
        <Flex gap="3" alignItems="center">
          <Box flexShrink={0} w="84px" h="84px" position="relative">
            <Box position="absolute" top="0" left="0" transform="scale(0.7)" transformOrigin="top left">
              <MakerRating level={level} completed={0} total={0} />
            </Box>
          </Box>
          <VStack alignItems="stretch" spacing="2" flex="1" minW={0}>
            <HStack justifyContent="space-between" alignItems="center" spacing="2">
              {logo}
              {actions}
            </HStack>
            {title}
          </VStack>
        </Flex>
        <Divider my="3" />
        {statsRow}
      </Box>
    </BoxWrapper>
  );
}
