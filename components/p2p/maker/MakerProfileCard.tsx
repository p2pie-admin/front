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

  const statsRow = (
    <HStack spacing={{ base: "2", lg: "4" }} alignItems="stretch" w="100%">
              {stats.map(([value, label], i) => (
                <HStack key={label} spacing={{ base: "2", lg: "4" }} alignItems="stretch" flex={i === 3 ? "1.4" : "1"} minW={0}>
                  {i > 0 ? <Divider orientation="vertical" h="auto" /> : null}
                  <VStack alignItems="flex-start" spacing="0" minW={0}>
                    <Text fontWeight="bold" fontSize={{ base: "sm", lg: "md" }} color={i === 3 ? "peach.300" : undefined} noOfLines={1}>
                      {value}
                    </Text>
                    <Text fontSize="xs" color="bg.400" noOfLines={1}>
                      {label}
                    </Text>
                  </VStack>
                </HStack>
              ))}
            </HStack>
  );

  return (
    <BoxWrapper variant="no_contrast">
      <Flex gap={{ base: "3", lg: "6" }} alignItems="center">
        <Box flexShrink={0} transform={{ base: "scale(0.85)", lg: "none" }} transformOrigin="left center" mr={{ base: "-3", lg: "0" }}>
          <MakerRating level={level} completed={0} total={0} />
        </Box>
        <VStack alignItems="stretch" spacing="3" flex="1" minW={0}>
          <HStack alignItems="flex-start" spacing="3">
            <Box
              flexShrink={0}
              w={{ base: "44px", lg: "52px" }}
              h={{ base: "44px", lg: "52px" }}
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
            <VStack alignItems="flex-start" spacing="0.5" flex="1" minW={0}>
              <HStack spacing="1.5" minW={0}>
                <Text as="h1" fontWeight="bold" fontSize={{ base: "lg", lg: "xl" }} noOfLines={1} variant="primary">
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
            <Box flexShrink={0}>
              <Actions id={maker.id} displayName={name} />
            </Box>
          </HStack>
          <Box display={{ base: "none", lg: "block" }}>{statsRow}</Box>
        </VStack>
      </Flex>
      {/* Phones: the stats get the full card width under the header. */}
      <Box display={{ base: "block", lg: "none" }} mt="3">
        {statsRow}
      </Box>
    </BoxWrapper>
  );
}
