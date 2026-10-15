import React from "react";
import { IP2PLevel } from "../../../../types/p2p";
import { Grid, Box, Text, Divider, HStack, VStack } from "@chakra-ui/react";
import { FaArrowRight } from "react-icons/fa";
import Loader from "../../../shared/Loader";
import { Box3D } from "../../../../styles/theme/custom";
import { localized } from "../../i18n";
import { useLocale, useT } from "../../../../services/i18n";

export default function MakerLevelsDescription({
  levels,
}: {
  levels: IP2PLevel[];
}) {
  const locale = useLocale();
  const t = useT();
  return (
    <Box mt="4">
      {[...levels]
        .sort((a, b) => (a.level ?? 0) - (b.level ?? 0))
        .map((level, index) => (
          <Box key={level.id}>
            <HStack alignItems="start">
              <Box3D
                w="fit-content"
                pb="4"
                position="relative"
                display="flex"
                flexDirection="column"
                alignItems="center"
                minH="200px"
                role="group"
                cursor="pointer"
              >
                <Text
                  fontSize="xs"
                  color="bg.500"
                  position="absolute"
                  top="8"
                  left="8"
                >
                  {`#${index + 1}`}
                </Text>
                <Box
                  position="absolute"
                  top="40%"
                  left="50%"
                  transform="translate(-50%, -50%)"
                  boxSize="140px"
                  borderRadius="full"
                  bgGradient="radial(peach.300 0%, transparent 60%)"
                  opacity={index + 1 === 10 ? 0.3 : 0.1}
                  transition="transform 0.3s ease, opacity 0.3s ease"
                  _groupHover={{
                    transform: "translate(-50%, -50%) scale(1.1)",
                    opacity: index + 1 === 10 ? 0.5 : 0.3,
                  }}
                  zIndex={0}
                />

                <Loader
                  size={150}
                  src={`/p2p/lottie/lvl${index + 1}.lottie`}
                  delay={0.2}
                  shift={index * 0.5}
                  zIndex={1}
                />

                <Box
                  mb="auto"
                  fontSize="sm"
                  fontWeight="bold"
                  fontFamily="Montserrat, sans-serif"
                  textAlign="center"
                  zIndex={1}
                  maxW="120px"
                >
                  {localized(level, "title", locale)}
                </Box>
              </Box3D>
              <VStack
                fontSize="xs"
                color="peach.200"
                p="2"
                spacing="1"
                alignItems="start"
              >
                <Text color="bg.200" fontSize="sm" whiteSpace="pre-line" mb="2">
                  {localized(level, "description", locale)}
                </Text>
                {!!level.deals_needed && (
                  <Text>{t(`• Сделок минимум: ${level.deals_needed}`, `• Minimum deals: ${level.deals_needed}`)}</Text>
                )}
                <Text>
                  {t(`• Онлайн сделка частями до ~${level.limit_online_usd}$ или одной транзакцией через эскроу-смарт-контракт (только для USDT)`, `• Online deal in parts up to ~${level.limit_online_usd}$ or in one transaction via an escrow smart contract (USDT only)`)}
                </Text>
                <Text>
                  {t(`• Личная встреча частями до ~${level.limit_offline_usd}$ или одной транзакцией через эскроу-смарт-контракт (только для USDT)`, `• In-person meeting in parts up to ~${level.limit_offline_usd}$ or in one transaction via an escrow smart contract (USDT only)`)}
                </Text>
                {!!level.deposit_usd && (
                  <Text>
                    {t(`• На этот уровень доверия можно перескочить сразу через депозит ${level.deposit_usd} USDT`, `• You can jump straight to this trust level with a deposit of ${level.deposit_usd} USDT`)}
                  </Text>
                )}
              </VStack>
            </HStack>
            {index + 1 !== 10 ? <Divider my="4" /> : <Box />}
          </Box>
        ))}
    </Box>
  );
}
