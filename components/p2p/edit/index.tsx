import React from "react";
import { Center, Divider } from "@chakra-ui/react";
import UniversalSeo from "../../shared/UniversalSeo";
import Loader from "../../shared/Loader";
import { ISEO } from "../../../types/general";
import { IFaqCategory } from "../../../types/faq";
import { IFullOffer, IMaker } from "../../../types/p2p";
import { IPm } from "../../../types/selector";
import MakerDescription from "../maker/MakerDescription";
import MakerMap from "./MakerMap";

import ExchangerReviewsHeader from "../../exchangers/exchanger/reviews/ExchangerReviewsHeader";
import { ExchangerIdProvider } from "../../exchangers/exchanger/ExchangerContext";
import LeaveReview from "../../exchangers/exchanger/leaveReview";
import ExchangerReviews from "../../exchangers/exchanger/reviews";
import { IExchangerReview } from "../../../types/exchanger";
import MakerTopPanel from "./MakerTopPanel";
import MakerStats from "../maker/stats";
import { BoxWrapper } from "../../shared/BoxWrapper";

import { FaqCategoriesList } from "../../faq";
import EditOffers from "./editOffers";
import MakerDescriptionEdit from "./MakerDescriptionEdit";

export default function MakerEditPage({
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

  const offers = Array.isArray(maker.offers)
    ? (maker.offers as IFullOffer[])
    : null;
  const reviews = Array.isArray(maker.reviews) ? maker.reviews : null;

  return (
    <>
      <UniversalSeo seo={seo} />

      <BoxWrapper variant="no_contrast" data-editing="true">
        <MakerTopPanel maker={maker} />
        <Divider my="4" />
        <MakerStats maker={maker} />
      </BoxWrapper>
      <EditOffers offers={offers} pms={pms} />
      <MakerDescriptionEdit description={maker.description} />

      <MakerMap coordinates={maker.coordinates} />

      {faqCategory ? <FaqCategoriesList categories={[faqCategory]} /> : <></>}
      <ExchangerReviews reviews={reviews as IExchangerReview[] | null} />
    </>
  );
}
