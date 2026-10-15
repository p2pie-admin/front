import React from "react";
import { Box, Button, Center, Divider } from "@chakra-ui/react";
import UniversalSeo from "../../shared/UniversalSeo";
import Loader from "../../shared/Loader";
import { ISEO } from "../../../types/general";
import { IFaqCategory } from "../../../types/faq";
import { IMaker } from "../../../types/p2p";
import { IPm } from "../../../types/selector";
import MakerDescription from "./MakerDescription";
import MakerMap from "./MakerMap";

import ExchangerReviewsHeader from "../../exchangers/exchanger/reviews/ExchangerReviewsHeader";
import { ExchangerIdProvider } from "../../exchangers/exchanger/ExchangerContext";
import LeaveReview from "../../exchangers/exchanger/leaveReview";
import ExchangerReviews from "../../exchangers/exchanger/reviews";
import { IExchangerReview } from "../../../types/exchanger";
import MakerTopPanel from "./topPanel";
import MakerStats from "../edit/stats";
import { BoxWrapper } from "../../shared/BoxWrapper";
import MakerOffers, { scrollToMakerOffers } from "./offers";
import { FaqCategoriesList } from "../../faq";

export default function MakerPage({
  maker,
  seo,
  pms,
  faqCategory,
}: {
  maker: IMaker | null;
  seo: ISEO;
  pms: IPm[] | null;
  faqCategory?: IFaqCategory | null;
}) {
  if (!maker) {
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

  const offers = Array.isArray(maker.offers) ? maker.offers : null;
  const reviews = Array.isArray(maker.reviews) ? maker.reviews : null;
  const description = (maker.description || "").trim();

  return (
    <>
      <UniversalSeo seo={seo} />
      <BoxWrapper variant="no_contrast">
        <MakerTopPanel maker={maker} />
        {/* Phones: the main action under the thumb (desktop has it in the top panel). */}
        <Box display={{ base: "block", lg: "none" }} mt="4">
          <Button variant="primary" color="white" w="100%" size="lg" onClick={scrollToMakerOffers}>
            Начать сделку
          </Button>
        </Box>
        <Divider my="4" />
        <MakerStats maker={maker} />
      </BoxWrapper>
      {offers?.length ? <MakerOffers offers={offers} pms={pms} /> : null}
      {description ? <MakerDescription description={description} /> : null}
      <MakerMap coordinates={maker.coordinates} />

      <ExchangerReviewsHeader
        title={"Уже совершали сделку с этим p2p мейкером?"}
      />

      <ExchangerIdProvider exchangerId={String(maker.id)}>
        <LeaveReview />
      </ExchangerIdProvider>
      <ExchangerReviews initialReviews={reviews as IExchangerReview[] | null} />

      {faqCategory ? <FaqCategoriesList categories={[faqCategory]} /> : <></>}
    </>
  );
}
