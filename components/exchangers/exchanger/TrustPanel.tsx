import NextLink from "next/link";
import { Box, Flex, HStack, Link, Text, VStack } from "@chakra-ui/react";
import { FaStar } from "react-icons/fa";
import { BoxWrapper } from "../../shared/BoxWrapper";
import { TitleH2 } from "../../shared/TitleH2";
import TrustBadge from "../../shared/TrustBadge";
import { IExchanger } from "../../../types/exchanger";
import {
  ageText,
  FACTOR_LABELS,
  FACTOR_LABELS_EN,
  FLAG_LABELS,
  FLAG_LABELS_EN,
  IRatingDetails,
  isTrustLevel,
  reviewsText,
  sourcesText,
  TRUST_LEVELS,
  trustHint,
} from "../../shared/trust";
import { intlLocale, useLocale, useT } from "../../../services/i18n";

const Bar = ({ points, max, color }: { points: number; max: number; color: string }) => (
  <Box flex="1" h="1.5" minW="60px" borderRadius="full" bgColor="blackAlpha.400" overflow="hidden">
    <Box
      h="100%"
      w={`${Math.max(0, Math.min(100, (points / max) * 100))}%`}
      borderRadius="full"
      bgColor={color}
    />
  </Box>
);

// Stars (what customers say) and trust level (how much evidence there is), with the breakdown behind both.
const TrustPanel = ({ exchanger }: { exchanger: IExchanger }) => {
  const locale = useLocale();
  const t = useT();
  const level = exchanger.trust_level;
  if (!isTrustLevel(level)) return null;
  const meta = TRUST_LEVELS[level];
  const details = (exchanger.rating_details || null) as IRatingDetails | null;
  const total = details?.reviews?.total ?? exchanger.reviews_count ?? 0;
  const sources = details?.reviews?.sources || [];
  const age = ageText(details?.ageMonths, locale);
  const stars = Number(exchanger.admin_rating) || 0;
  const factors = details?.factors || [];
  const flagLabels = locale === "en" ? FLAG_LABELS_EN : FLAG_LABELS;
  const factorLabels = locale === "en" ? FACTOR_LABELS_EN : FACTOR_LABELS;
  const nf = intlLocale(locale);
  const flags = [...new Set((details?.flags || []).map((f) => flagLabels[f]))];

  return (
    <BoxWrapper variant="no_contrast">
      <VStack alignItems="stretch" gap="3" w="100%">
        <TitleH2 isLong={false}>
          <>{t("Оценка и уровень доверия", "Rating and trust level")}</>
        </TitleH2>

        <Flex gap={{ base: 3, lg: 8 }} flexDir={{ base: "column", lg: "row" }}>
          <VStack alignItems="start" gap="1" flex="1">
            <HStack gap="2">
              <Box color="yellow.400" filter="drop-shadow(0 0 6px rgba(236,201,75,0.6))">
                <FaStar size="1.2rem" />
              </Box>
              <Text fontSize="2xl" fontWeight="bold" color="bg.100" lineHeight="1">
                {total > 0 && stars ? (locale === "en" ? stars.toFixed(2) : stars.toFixed(2).replace(".", ",")) : t("нет оценки", "no rating")}
              </Text>
            </HStack>
            <Text fontSize="sm" color="bg.300">
              {total > 0
                ? `${t("Оценка клиентов", "Customer rating")}: ${reviewsText(total, locale)}${sources.length ? ` ${t("на", "on")} ${sourcesText(sources.length, locale)}` : ""}`
                : t("Отзывов пока нет, оценку не из чего считать", "No reviews yet, so there is nothing to rate")}
            </Text>
            {sources.length > 0 && (
              <Text fontSize="sm" color="bg.300">
                {sources
                  .map((s) =>
                    s.positive == null
                      ? `${s.name}: ${s.total.toLocaleString(nf)}`
                      : `${s.name}: ${s.positive.toLocaleString(nf)} ${t("положительных", "positive")}, ${(s.negative ?? 0).toLocaleString(nf)} ${t("отрицательных", "negative")}`
                  )
                  .join(" · ")}
              </Text>
            )}
          </VStack>

          <VStack alignItems="start" gap="1" flex="1">
            <HStack gap="3">
              <TrustBadge level={level} withLabel size="1.2rem" />
              {exchanger.trust_score != null && (
                <Text fontSize="sm" color="bg.300">
                  {exchanger.trust_score} {t("из", "of")} 100
                </Text>
              )}
            </HStack>
            <Text fontSize="sm" color="bg.300">
              {trustHint(meta, locale)}
              {age ? `. ${t("На рынке", "On the market for")} ${age}` : ""}.
            </Text>
            {flags.length > 0 && (
              <Text fontSize="sm" color="orange.300">
                {t("Причина", "Reason")}: {flags.join("; ")}.
              </Text>
            )}
          </VStack>
        </Flex>

        {factors.length > 0 && (
          <Box
            display="grid"
            gridTemplateColumns={{ base: "1fr", lg: "1fr 1fr" }}
            columnGap="8"
            rowGap="1.5"
          >
            {factors
              .filter((f) => f.max > 0 || f.points !== 0)
              .map((f) => (
                <HStack key={f.key} gap="3">
                  <Text fontSize="sm" color="bg.300" w="150px" flexShrink={0}>
                    {factorLabels[f.key]}
                  </Text>
                  {f.max > 0 && f.points >= 0 ? (
                    <Bar points={f.points} max={f.max} color={meta.color} />
                  ) : (
                    <Box flex="1" />
                  )}
                  <Text
                    fontSize="sm"
                    color={f.points < 0 ? "orange.300" : "bg.200"}
                    w="70px"
                    textAlign="right"
                    flexShrink={0}
                  >
                    {f.points < 0
                      ? `−${Math.abs(f.points)}`
                      : f.max > 0
                        ? `${Math.round(f.points)} ${t("из", "of")} ${f.max}`
                        : f.points}
                  </Text>
                </HStack>
              ))}
          </Box>
        )}

        <Text fontSize="sm" color="bg.300">
          {t(
            "Оценка показывает, что пишут клиенты, а уровень доверия показывает, сколько за ней данных.",
            "The rating shows what customers say, and the trust level shows how much data stands behind it.",
          )}{" "}
          <Link as={NextLink} href="/rating" color="blue.300">
            {t("Как считается рейтинг", "How the rating is calculated")}
          </Link>
        </Text>
      </VStack>
    </BoxWrapper>
  );
};

export default TrustPanel;
