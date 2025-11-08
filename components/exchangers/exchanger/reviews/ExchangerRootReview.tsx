import React from "react";
import { Box3D, ResponsiveText } from "../../../../styles/theme/custom";
import { Box, Divider, Text } from "@chakra-ui/react";
import ExchangerReplies from "./ExchangerReplies";
import { IExchangerReview } from "../../../../types/exchanger";

export default function ExchangerRootReview({
  review,
}: {
  review: IExchangerReview;
}) {
  if (!review) return <></>;
  const {
    name,
    categories,
    location,
    screenshots,
    text,
    type,
    userAgent,
    review_replies,
    ipAddress,
  } = review;
  return (
    <Box>
      <ResponsiveText size="lg" variant="no_contrast" fontWeight="bold">
        {name || "Аноним"}
      </ResponsiveText>
      <Text>{review.text}</Text>
      <ExchangerReplies />
    </Box>
  );
}
