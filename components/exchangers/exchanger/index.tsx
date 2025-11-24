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
} from "@chakra-ui/react";

import UniversalSeo from "../../shared/UniversalSeo";
import { ISEO } from "../../../types/general";
import ExchangerCard from "./description";
import ExchangerName from "../../shared/ExchangerNameRating";
import Dot from "../Dot";
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

export default function Exchanger({
  exchanger,
  seo,
}: {
  exchanger: IExchanger & IParserExchanger;
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
        <ExchangerTopPanel exchanger={exchanger} />
        <Divider my="4" />
        <ExchangerStats
          reviews={exchanger.reviews}
          ratesTotal={exchanger.total_rates}
          reserveTotal={exchanger.exchanger_card?.total_reserve_usd}
          workingTime={exchanger.exchanger_card?.working_time}
        />
      </BoxWrapper>

      <ExchangerDescription description={description} />

      <OfficesDescription offices={exchanger.offices} />
      <ExchangerContacts exchangerCard={exchangerCard} />

      <ExchangerReviewsHeader />
      <ExchangerIdProvider exchangerId={exchanger.id}>
        <LeaveReview />
      </ExchangerIdProvider>
      <ExchangerReviews reviews={exchanger.reviews} />
    </>
  );
}
