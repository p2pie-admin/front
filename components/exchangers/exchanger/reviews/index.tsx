import React from "react";
import ExchangerReviewsHeader from "./ExchangerReviewsHeader";
import ExchangerReplies from "./ExchangerReplies";
import ExchangerRootReview from "./ExchangerRootReview";
import { IExchangerReview } from "../../../../types/exchanger";
import { Box3D, ResponsiveText } from "../../../../styles/theme/custom";
import { Divider } from "@chakra-ui/react";

export default function ExchangerReviews({
  reviews,
}: {
  reviews?: IExchangerReview[] | null;
}) {
  return (
    <>
      <ExchangerReviewsHeader />
      <Box3D mt="4" p="4" variant="contrast">
        <ResponsiveText size="xl" fontWeight="bold" variant="primary">
          {`Отзывы (${reviews?.length})`}
        </ResponsiveText>
        <Divider my="4" />

        {!reviews ? (
          <ResponsiveText>
            Пока нет отзывов, оставьте отзыв первым
          </ResponsiveText>
        ) : (
          reviews.map((review) => <ExchangerRootReview review={review} />)
        )}
      </Box3D>
    </>
  );
}
