import React from "react";
import { VStack } from "@chakra-ui/react";
import { shallowEqual } from "react-redux";
import CourseSelector from "./CourseSelector";
import { useAppSelector } from "../../../../../../redux/hooks";

export default function DirectionDetails({ index }: { index: number }) {
  const fullOffer = useAppSelector(
    (state) => state.main.p2pFullOffers[index],
    shallowEqual,
  );

  return (
    <VStack>
      {fullOffer ? <CourseSelector fullOffer={fullOffer} /> : null}
    </VStack>
  );
}
