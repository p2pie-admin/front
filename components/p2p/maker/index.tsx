import React from "react";
import { Box, Button, Center, Divider } from "@chakra-ui/react";
import UniversalSeo from "../../shared/UniversalSeo";
import Loader from "../../shared/Loader";
import { ISEO } from "../../../types/general";
import { IFaqCategory } from "../../../types/faq";
import { IMaker } from "../../../types/p2p";
import { IPm } from "../../../types/selector";
import MakerMap from "./MakerMap";

import ExchangerReviewsHeader from "../../exchangers/exchanger/reviews/ExchangerReviewsHeader";
import { ExchangerIdProvider } from "../../exchangers/exchanger/ExchangerContext";
import LeaveReview from "../../exchangers/exchanger/leaveReview";
import ExchangerReviews from "../../exchangers/exchanger/reviews";
import { IExchangerReview } from "../../../types/exchanger";
import MakerProfileCard from "./MakerProfileCard";
import MakerStats from "../edit/stats";
import { BoxWrapper } from "../../shared/BoxWrapper";
import MakerOffers from "./offers";
import { FaqCategoriesList } from "../../faq";
import { useT } from "../../../services/i18n";

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
  const t = useT();
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

  return (
    // Phones: a small side gutter so the cards do not touch the screen edges (owner's mockup).
    <Box px={{ base: "2", lg: "0" }}>
      <UniversalSeo seo={seo} />
      <MakerProfileCard maker={maker} />
      {offers?.length ? <MakerOffers offers={offers} pms={pms} maker={maker} /> : null}
      <MakerMap coordinates={maker.coordinates} />

      <ExchangerReviewsHeader
        title={t("Уже совершали сделку с этим p2p мейкером?", "Have you made a deal with this p2p maker?")}
      />

      <ExchangerIdProvider exchangerId={String(maker.id)}>
        <LeaveReview />
      </ExchangerIdProvider>
      <ExchangerReviews initialReviews={reviews as IExchangerReview[] | null} />

      {faqCategory ? <FaqCategoriesList categories={[faqCategory]} /> : <></>}
    </Box>
  );
}
