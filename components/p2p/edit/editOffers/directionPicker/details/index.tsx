import React from "react";
import { IFullOffer, IMakerOffer } from "../../../../../../types/p2p";
import { VStack } from "@chakra-ui/react";
import CourseSelector from "./CourseSelector";

export default function DirectionDetails({
  fullOffer,
}: {
  fullOffer?: IFullOffer;
}) {
  const currencyPair = `${fullOffer?.givePm?.currency.code.toUpperCase()}_${fullOffer?.getPm?.currency.code.toUpperCase()}`;

  return (
    <VStack>
      <CourseSelector course={fullOffer?.course} currencyPair={currencyPair} />
    </VStack>
  );
}
