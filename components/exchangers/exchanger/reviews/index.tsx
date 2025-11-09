import React, { useCallback, useMemo, useState } from "react";
import { PiChatsFill } from "react-icons/pi";
import ExchangerRootReview from "./ExchangerRootReview";
import { IExchangerReview, IDotColors } from "../../../../types/exchanger";
import { Box3D, ResponsiveText } from "../../../../styles/theme/custom";
import { Divider, HStack } from "@chakra-ui/react";
import { CustomHeader } from "../shared";
import ReviewsFilters from "./ReviewsFilters";

const filterTypeMap: Record<IDotColors, IExchangerReview["type"] | null> = {
  green: "positive",
  gray: "neutral",
  red: "negative",
  orange: null,
};

export default function ExchangerReviews({
  reviews,
}: {
  reviews?: IExchangerReview[] | null;
}) {
  const [activeFilter, setActiveFilter] = useState<IDotColors | null>(null);

  const handleToggleFilter = useCallback((color: IDotColors | null) => {
    setActiveFilter((current) => (current === color ? null : color));
  }, []);

  const filteredReviews = useMemo(() => {
    if (!reviews) return null;
    if (!activeFilter) return reviews;
    const targetType = filterTypeMap[activeFilter];
    if (!targetType) return reviews;
    return reviews.filter((review) => review.type === targetType);
  }, [reviews, activeFilter]);

  const reviewsCount = filteredReviews?.length ?? reviews?.length ?? 0;
  const hasAnyReviews = !!(reviews && reviews.length);
  return (
    <Box3D my="8" p="4" variant="contrast">
      <HStack justifyContent="space-between">
        <CustomHeader text={`Отзывы (${reviewsCount})`} Icon={PiChatsFill} />
        <ReviewsFilters
          toggleFilter={handleToggleFilter}
          activeFilter={activeFilter}
        />
      </HStack>
      <Divider my="4" />
      {!hasAnyReviews ? (
        <ResponsiveText>Пока нет отзывов, оставьте отзыв первым</ResponsiveText>
      ) : filteredReviews && filteredReviews.length > 0 ? (
        filteredReviews.map((review) => (
          <ExchangerRootReview key={review.id} review={review} />
        ))
      ) : (
        <ResponsiveText>Нет отзывов по выбранному фильтру</ResponsiveText>
      )}
    </Box3D>
  );
}
