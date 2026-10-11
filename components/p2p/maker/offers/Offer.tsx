import { Grid, Box, Text } from "@chakra-ui/react";
import React from "react";
import { BsArrowRightShort } from "react-icons/bs";
import PmName from "../../../shared/PmName";
import { IMakerOffer } from "../../../../types/p2p";
import { IPm } from "../../../../types/selector";
import { pmsToSlug } from "../../../main/side/selector/section/PmGroup/helper";
import OfferDetails from "./OfferDetails";

export default function Offer({
  offer,
  pmsByCode,
}: {
  offer: IMakerOffer;
  pmsByCode: Map<string, IPm>;
}) {
  const [giveCode, getCode] = offer.dir.split("_");
  const givePm = pmsByCode.get((giveCode || "").toUpperCase());
  const getPm = pmsByCode.get((getCode || "").toUpperCase());

  return (
    <Grid
      gridTemplateColumns={"1fr 40px 1fr"}
      gridTemplateRows="auto"
      color="bg.500"
      alignItems="center"
      columnGap="2"
    >
      <Box gridColumn="1" display="flex" flexDir="column" gap="1">
        {givePm ? <PmName pm={givePm} isFull={true} /> : <Text fontSize="sm">{giveCode}</Text>}
      </Box>

      <Box gridColumn="2" justifySelf="center">
        <BsArrowRightShort size="1.5rem" />
      </Box>

      <Box gridColumn="3" display="flex" flexDir="column" gap="1">
        {getPm ? <PmName pm={getPm} isFull={true} /> : <Text fontSize="sm">{getCode}</Text>}
      </Box>
    </Grid>
  );
}
