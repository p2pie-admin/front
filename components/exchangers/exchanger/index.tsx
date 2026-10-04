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
import ExternalReviews from "./ExternalReviews";
import { IExternalReviews } from "../../../services/competitors";

export default function Exchanger({
  exchanger,
  seo,
  uptime,
  externalReviews,
  initialReviews,
  reviewsTotal,
}: {
  exchanger: IExchanger;
  seo: ISEO;
  uptime?: IExchangerUptime | null;
  externalReviews?: IExternalReviews | null;
  // First page of reviews (all sources, newest first) and the total; the rest loads on demand.
  initialReviews?: IExchangerReview[] | null;
  reviewsTotal?: number | null;
}) {
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
  const description =
    ruText ||
    exchangerCard?.ru_description ||
    exchangerCard?.en_description ||
    "Пока нет описания";

  return (
    <>
      <UniversalSeo seo={seo} />

      <BoxWrapper variant="no_contrast">
        <VStack alignItems="start" gap="4" w="100%">
          <ExchangerTopPanel exchanger={exchanger} />

          <ExchangerStats
            reviews={exchanger.reviews}
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

      <Uptime uptime={uptime} />
      <OfficesDescription offices={exchanger.offices} />
      <ExchangerDescription description={description} />
      <Monitorings monitorings={exchanger.monitorings} />
      <ExchangerContacts exchangerCard={exchangerCard} />

      <ExchangerReviewsHeader title={"Уже пользовались этим обменником?"} />
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
        Вы владелец этого обменника?{" "}
        <Link as={NextLink} href="/for-exchangers" color="blue.300">
          Условия для обменников
        </Link>
      </Text>
    </>
  );
}
