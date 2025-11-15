import React from "react";
import { IReviewCategory } from "../../../../../types/exchanger";
import { Divider, VStack, Wrap } from "@chakra-ui/react";
import map from "../../../../map";
import ReviewCategory from "./ReviewCategory";
import { Box3D, ResponsiveText } from "../../../../../styles/theme/custom";

export default function ReviewCategories({
  categories,
  sentiment,
}: {
  categories?: IReviewCategory[] | null;
  sentiment: "positive" | "neutral" | "negative" | null;
}) {
  if (!categories || !categories?.length) return <></>;

  const negativeCategories = categories.filter((c) => !!c.isNegative);
  const positiveCategories = categories.filter((c) => !c.isNegative);

  return (
    <VStack
      gap="4"
      flexDirection={sentiment == "negative" ? "column-reverse" : "column"}
    >
      <Box3D variant="extra_contrast" p="4" w="100%">
        <ResponsiveText mb="4">Чем порадовал обменник?</ResponsiveText>
        <Wrap gap="4">
          {positiveCategories.map((category) => (
            <ReviewCategory category={category} />
          ))}
        </Wrap>
      </Box3D>

      <Box3D variant="extra_contrast" p="4" w="100%">
        <ResponsiveText mb="4">Чем огорчил обменник?</ResponsiveText>
        <Wrap gap="4">
          {negativeCategories.map((category) => (
            <ReviewCategory category={category} />
          ))}
        </Wrap>
      </Box3D>
    </VStack>
  );
}
