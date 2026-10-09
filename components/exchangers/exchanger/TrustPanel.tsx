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
  FLAG_LABELS,
  IRatingDetails,
  isTrustLevel,
  reviewsText,
  sourcesText,
  TRUST_LEVELS,
} from "../../shared/trust";

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
  const level = exchanger.trust_level;
  if (!isTrustLevel(level)) return null;
  const meta = TRUST_LEVELS[level];
  const details = (exchanger.rating_details || null) as IRatingDetails | null;
  const total = details?.reviews?.total ?? exchanger.reviews_count ?? 0;
  const sources = details?.reviews?.sources || [];
  const age = ageText(details?.ageMonths);
  const stars = Number(exchanger.admin_rating) || 0;
  const factors = details?.factors || [];
  const flags = [...new Set((details?.flags || []).map((f) => FLAG_LABELS[f]))];

  return (
    <BoxWrapper variant="no_contrast">
      <VStack alignItems="stretch" gap="3" w="100%">
        <TitleH2 isLong={false}>
          <>Оценка и уровень доверия</>
        </TitleH2>

        <Flex gap={{ base: 3, lg: 8 }} flexDir={{ base: "column", lg: "row" }}>
          <VStack alignItems="start" gap="1" flex="1">
            <HStack gap="2">
              <Box color="yellow.400" filter="drop-shadow(0 0 6px rgba(236,201,75,0.6))">
                <FaStar size="1.2rem" />
              </Box>
              <Text fontSize="2xl" fontWeight="bold" color="bg.100" lineHeight="1">
                {total > 0 && stars ? stars.toFixed(2).replace(".", ",") : "нет оценки"}
              </Text>
            </HStack>
            <Text fontSize="sm" color="bg.300">
              {total > 0
                ? `Оценка клиентов: ${reviewsText(total)}${sources.length ? ` на ${sourcesText(sources.length)}` : ""}`
                : "Отзывов пока нет, оценку не из чего считать"}
            </Text>
            {sources.length > 0 && (
              <Text fontSize="sm" color="bg.300">
                {sources
                  .map((s) =>
                    s.positive == null
                      ? `${s.name}: ${s.total.toLocaleString("ru-RU")}`
                      : `${s.name}: ${s.positive.toLocaleString("ru-RU")} положительных, ${(s.negative ?? 0).toLocaleString("ru-RU")} отрицательных`
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
                  {exchanger.trust_score} из 100
                </Text>
              )}
            </HStack>
            <Text fontSize="sm" color="bg.300">
              {meta.hint}
              {age ? `. На рынке ${age}` : ""}.
            </Text>
            {flags.length > 0 && (
              <Text fontSize="sm" color="orange.300">
                Причина: {flags.join("; ")}.
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
                    {FACTOR_LABELS[f.key]}
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
                        ? `${Math.round(f.points)} из ${f.max}`
                        : f.points}
                  </Text>
                </HStack>
              ))}
          </Box>
        )}

        <Text fontSize="sm" color="bg.300">
          Оценка показывает, что пишут клиенты, а уровень доверия показывает, сколько за ней данных.{" "}
          <Link as={NextLink} href="/rating" color="blue.300">
            Как считается рейтинг
          </Link>
        </Text>
      </VStack>
    </BoxWrapper>
  );
};

export default TrustPanel;
