import { Box, VStack } from "@chakra-ui/react";
import React from "react";
import { ResponsiveText } from "../../../../styles/theme/custom";
import { useT } from "../../../../services/i18n";

export default function ExchangerReviewsHeader({ title }: { title: string }) {
  const t = useT();
  return (
    <VStack my="20" w="100%">
      <ResponsiveText whiteSpace="unset" size="3xl" textAlign="center">
        {title}
      </ResponsiveText>
      <ResponsiveText
        whiteSpace="unset"
        size="xl"
        variant="no_contrast"
        textAlign="center"
      >
        {t(
          "Оставьте отзыв, он поможет другим пользователям принять решение!",
          "Leave a review, it will help other users make a decision!",
        )}
      </ResponsiveText>
    </VStack>
  );
}
