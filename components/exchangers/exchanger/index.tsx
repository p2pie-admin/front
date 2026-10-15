import React from "react";
import {
  IDotColors,
  IExchanger,
  IExchangerReview,
  IParserExchanger,
} from "../../../types/exchanger";
import NextLink from "next/link";
import {
  Box,
  Center,
  Divider,
  Flex,
  Grid,
  HStack,
  Link,
  Text,
  Tooltip,
  VStack,
} from "@chakra-ui/react";

import UniversalSeo from "../../shared/UniversalSeo";
import Loader from "../../shared/Loader";
import { ISEO } from "../../../types/general";

import OfficesDescription from "./offices";
import ExchangerDescription from "./description";
import ExchangerContacts from "./contacts/ExchangerContacts";
import { resolveColorToken } from "../../shared/CircularIcon";
import ExchangerReviews from "./reviews";
import LeaveReview from "./leaveReview";
import { ExchangerIdProvider } from "./ExchangerContext";
import ExchangerReviewsHeader from "./reviews/ExchangerReviewsHeader";
import ExchangerStats from "./exchangerStats";
import { BoxWrapper } from "../../shared/BoxWrapper";
import ExchangerTopPanel from "./exchangerTopPanel";
import { ExchangerTopButtons } from "./exchangerTopPanel/ExchangerTopButtons";
import Monitorings from "./monitorings";
import Uptime, { IExchangerUptime } from "./Uptime";
import TrustPanel from "./TrustPanel";
import ExternalReviews from "./ExternalReviews";
import { IExternalReviews } from "../../../services/competitors";
import { useLocale, useT } from "../../../services/i18n";

export default function Exchanger({
  exchanger,
  seo,
  uptime,
  externalReviews,
  initialReviews,
  reviewsTotal,
  reviewCounts,
}: {
  exchanger: IExchanger;
  seo: ISEO;
  uptime?: IExchangerUptime | null;
  externalReviews?: IExternalReviews | null;
  // First page of reviews (all sources, newest first) and the total; the rest loads on demand.
  initialReviews?: IExchangerReview[] | null;
  reviewsTotal?: number | null;
  reviewCounts?: { positive: number; neutral: number; negative: number } | null;
}) {
  const locale = useLocale();
  const t = useT();
  if (!exchanger || !exchanger.ref_link) {
    return (
      <Center
        w="100%"
        h="100%"
        justifyContent="center"
        alignItems="center"
        minW="100"
        minH="100"
      >
        <Loader size="xl" />
      </Center>
    );
  }

  const { exchanger_card: exchangerCard } = exchanger;

  const ruText = exchangerCard?.text?.trim();
  // English pages prefer the English card description, falling back to the Russian text.
  const description =
    (locale === "en" ? exchangerCard?.en_description : null) ||
    ruText ||
    exchangerCard?.ru_description ||
    exchangerCard?.en_description ||
    t("Пока нет описания", "No description yet");

  return (
    <>
      <UniversalSeo seo={seo} />

      <BoxWrapper variant="no_contrast">
        <VStack alignItems="start" gap="4" w="100%">
          <ExchangerTopPanel exchanger={exchanger} />

          <ExchangerStats
            reviews={exchanger.reviews}
            reviewCounts={reviewCounts}
            // ratesTotal={exchanger.total_rates}
            reserveTotal={exchanger.exchanger_card?.total_reserve_usd}
            workingTime={exchanger.exchanger_card?.working_time}
          />

          <Box
            display={{ base: "grid", lg: "none" }}
            gap="2"
            gridTemplateColumns="1fr 1fr"
            w="100%"
          >
            <ExchangerTopButtons ref_link={exchanger.ref_link} />
          </Box>
        </VStack>
      </BoxWrapper>

      <TrustPanel exchanger={exchanger} />
      <Uptime uptime={uptime} />
      <OfficesDescription offices={exchanger.offices} />
      <ExchangerDescription description={description} />
      <Monitorings monitorings={exchanger.monitorings} />
      <ExchangerContacts exchangerCard={exchangerCard} />

      <ExchangerReviewsHeader title={t("Уже пользовались этим обменником?", "Have you used this exchanger?")} />
      <ExchangerIdProvider exchangerId={exchanger.id}>
        <LeaveReview />
      </ExchangerIdProvider>
      <ExchangerReviews
        exchangerId={exchanger.id}
        initialReviews={initialReviews}
        initialTotal={reviewsTotal}
      />
      <ExternalReviews data={externalReviews} />

      <Text mt="6" fontSize="sm" color="bg.300">
        {t("Вы владелец этого обменника?", "Do you own this exchanger?")}{" "}
        <Link as={NextLink} href="/for-exchangers" color="blue.300">
          {t("Условия для обменников", "Terms for exchangers")}
        </Link>
      </Text>
    </>
  );
}
