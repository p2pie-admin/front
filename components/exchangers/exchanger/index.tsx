import React from "react";
import {
  IDotColors,
  IExchanger,
  IParserExchanger,
} from "../../../types/exchanger";
import {
  Box,
  Center,
  Divider,
  Flex,
  Grid,
  HStack,
  Spinner,
  Tooltip,
  VStack,
} from "@chakra-ui/react";

import UniversalSeo from "../../shared/UniversalSeo";
import { ISEO } from "../../../types/general";

import OfficesDescription from "./offices";
import { locale } from "../../../services/utils";
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
import { TopButtons } from "./exchangerTopPanel/TopButtons";
import Monitorings from "./monitorings";

export default function Exchanger({
  exchanger,
  seo,
}: {
  exchanger: IExchanger;
  seo: ISEO;
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
        <Spinner size="xl" color="bg.500" />
      </Center>
    );
  }

  const { exchanger_card: exchangerCard } = exchanger;

  const description =
    exchangerCard?.[`${locale}_description`] || "Пока нет описания";

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

          <Box w="100%" display={{ lg: "none", base: "unset" }}>
            <TopButtons exchanger={exchanger} />
          </Box>
        </VStack>
      </BoxWrapper>

      <OfficesDescription offices={exchanger.offices} />
      <ExchangerDescription description={description} />
      <Monitorings monitorings={exchanger.monitorings} />
      <ExchangerContacts exchangerCard={exchangerCard} />

      <ExchangerReviewsHeader />
      <ExchangerIdProvider exchangerId={exchanger.id}>
        <LeaveReview />
      </ExchangerIdProvider>
      <ExchangerReviews reviews={exchanger.reviews} />
    </>
  );
}
