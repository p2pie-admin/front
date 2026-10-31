import NextLink from "next/link";
import { Box, Button, Flex, Text, VStack } from "@chakra-ui/react";
import { BoxWrapper } from "../../shared/BoxWrapper";
import { IExchanger } from "../../../types/exchanger";
import { exchangerNameToSlug } from "../helper";
import { useT } from "../../../services/i18n";

// For the owner who comes from our e-mail: a live rating badge for their site, free, and how to update the card.
const OwnerPanel = ({ exchanger }: { exchanger: IExchanger }) => {
  const t = useT();
  const slug = exchangerNameToSlug(exchanger.name);
  return (
    <BoxWrapper variant="no_contrast">
      <Flex gap="4" alignItems={{ base: "start", md: "center" }} flexDir={{ base: "column", md: "row" }}>
        <Box flexShrink={0}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`/badge/${slug}-150x50.svg`} width={150} height={50} alt={t("Бейдж рейтинга", "Rating badge")} loading="lazy" />
        </Box>
        <VStack alignItems="start" gap="1" flex="1">
          <Text color="bg.100" fontWeight="bold">
            {t("Это ваш обменник?", "Do you own this exchanger?")}
          </Text>
          <Text color="bg.300" fontSize="sm">
            {t(
              "Поставьте на сайт бейдж с живым рейтингом: оценка, число отзывов и площадки, откуда они собраны. Обновляется сам, бесплатно. Описание, логотип и контакты в карточке поправим по письму на support@p2pie.com.",
              "Put a live rating badge on your site: the score, the number of reviews and where they come from. It updates itself and is free. We will update the description, logo and contacts on request to support@p2pie.com.",
            )}
          </Text>
        </VStack>
        <Button as={NextLink} href={`/for-exchangers/badge?ex=${encodeURIComponent(slug)}`} variant="primary" flexShrink={0}>
          {t("Получить бейдж", "Get the badge")}
        </Button>
      </Flex>
    </BoxWrapper>
  );
};

export default OwnerPanel;
