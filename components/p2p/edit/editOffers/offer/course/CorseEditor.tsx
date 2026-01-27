import React from "react";
import { HStack, VStack } from "@chakra-ui/react";
import { ResponsiveText } from "../../../../../../styles/theme/custom";
import CourseAmountInput from "./CourseAmountInput";
import {
  codeToSymbol,
  powerOfTenOrder,
} from "../../../../../../redux/amountsHelper";
import OfferCourseSlider from "./OfferCourseSlider";

export const CourseEditor = ({
  giveCur,
  getCur,
  index,
  suggestedCourse,
  bestRate,
  bestRateReversed,
}: {
  giveCur?: string;
  getCur?: string;
  index: number;
  suggestedCourse?: number;
  bestRate?: number;
  bestRateReversed?: number;
}) => {
  if (!giveCur || !getCur) return <></>;

  return (
    <VStack align="start" spacing="2" w="fit-content">
      <HStack w="fit-content">
        <ResponsiveText mr="2">{"Курс: "}</ResponsiveText>

        <CourseAmountInput index={index} side="give" />
        <ResponsiveText>{codeToSymbol(giveCur)}</ResponsiveText>
        <ResponsiveText>{` = `}</ResponsiveText>
        <CourseAmountInput index={index} side="get" />
        <ResponsiveText>{codeToSymbol(getCur)}</ResponsiveText>
      </HStack>
      <OfferCourseSlider
        index={index}
        suggestedCourse={suggestedCourse}
        bestRate={bestRate}
        bestRateReversed={bestRateReversed}
      />
    </VStack>
  );
};
