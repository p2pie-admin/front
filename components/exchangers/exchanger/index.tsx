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
  Grid,
  HStack,
  Spinner,
  Tooltip,
} from "@chakra-ui/react";

import { Box3D } from "../../../styles/theme/custom";

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

import TopPanel from "./topPanel";
import ExchangerReviews from "./reviews";
import LeaveReview from "./leaveReview";
import ExchangerReviewsHeader from "./reviews/ExchangerReviewsHeader";
import ExchangerStats from "./ExchangerStats";

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

  //const status = exchanger.status == "active" ? "Активен" : "Приостановлен";
  const color =
    exchanger.status == "active" ? "green" : ("orange" as IDotColors);

  const { exchanger_card: exchangerCard, exchanger_tags } = exchanger;

  const description =
    exchangerCard?.[`${locale}_description`] || "нет описания";

  return (
    <>
      <UniversalSeo seo={seo} />

      <Box3D mt="4" p="4" variant="no_contrast">
        <HStack w="100%" justifyContent="space-between">
          <HStack gap="4" position="relative">
            <ExchangerName
              name={exchanger.name}
              logo={exchanger.logo}
              admin_rating={exchanger.admin_rating}
              isH1={true}
            />
            <Box>
              {exchanger_tags &&
                exchanger_tags.map((tag) => (
                  <Tooltip openDelay={500} hasArrow label={tag.description}>
                    <Box
                      borderRadius="lg"
                      py="1"
                      px="2"
                      my="2"
                      borderColor={resolveColorToken(tag.color)}
                      border="2px solid"
                      color={resolveColorToken(tag.color)}
                      fontWeight="bold"
                      boxShadow="lg"
                      fontSize="sm"
                    >
                      {tag.name.toUpperCase()}
                    </Box>
                  </Tooltip>
                ))}
            </Box>
          </HStack>
          <TopPanel exchanger={exchanger} />
        </HStack>
        <Divider my="4" />
        <ExchangerStats
          reviews={exchanger.reviews}
          ratesTotal={exchanger.total_rates}
          reserveTotal={exchanger.exchanger_card?.total_reserve_usd}
          workingTime={exchanger.exchanger_card?.working_time}
        />
      </Box3D>

      <ExchangerDescription description={description} />

      <OfficesDescription offices={exchanger.offices} />
      <ExchangerContacts exchangerCard={exchangerCard} />

      <ExchangerReviewsHeader />
      <LeaveReview exchangerId={exchanger.id} />
      <ExchangerReviews reviews={exchanger.reviews} />
    </>
  );
}
