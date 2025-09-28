import { Box, Grid, HStack, VStack } from "@chakra-ui/react";
import Link from "next/link";
import { BsArrowRightShort } from "react-icons/bs";
import { Box3D, ResponsiveText } from "../../styles/theme/custom";
import { useRouter } from "next/router";

import { IPm } from "../../types/selector";
import { getOtherMass } from "./exchangeHelper";
import MassPmIcon from "../mass/table/MassPmIcon";
import SmartGrid from "../mass/table/SmartGrid";
import { IMassDirTextId } from "../../types/mass";
import PmName from "../shared/PmName";

const SimilarMass = ({
  similarPmPairs,
  givePm,
  getPm,
  dirTextIds,
}: {
  similarPmPairs: IPm[][];
  givePm: IPm;
  getPm: IPm;
  dirTextIds: IMassDirTextId[];
}) => {
  const pms = getOtherMass(similarPmPairs, givePm, getPm);
  const [side, cryptoPm, fiatPm] =
    givePm.section == "crypto"
      ? ["sell", givePm, getPm]
      : getPm.section == "crypto"
      ? ["buy", getPm, givePm]
      : [];
  const linkExists = dirTextIds.find(
    (dtid) =>
      dtid.code.toLowerCase() == cryptoPm?.code.toLowerCase() &&
      dtid.currency.code.toLowerCase() == fiatPm?.currency.code.toLowerCase()
  );

  if (!linkExists?.code || !pms || !side || !cryptoPm || !fiatPm) return <></>;

  const pmIconsRender = (
    <SmartGrid wrapThreshold={3} direction={"start"}>
      {pms.map((pm) => (
        <HStack
          key={pm.code + pm.subgroup_name || pm.en_name}
          borderRadius="lg"
          mx="0.5"
          cursor="pointer"
        >
          <MassPmIcon pm={pm} />
        </HStack>
      ))}
    </SmartGrid>
  );

  const cryptoPmRender = (
    <VStack alignItems="start">
      <PmName pm={cryptoPm} isFull={false} />
      <ResponsiveText size="sm" variant="no_contrast">
        {`${
          side == "sell" ? "Продать" : "Купить"
        } ${cryptoPm.currency.code.toUpperCase()} за ${fiatPm.currency.code.toUpperCase()}`}
      </ResponsiveText>
    </VStack>
  );

  return (
    <Link
      href={`/${side}/${cryptoPm.code.toLowerCase()}-for-${fiatPm.currency.code.toLowerCase()}`}
      passHref
    >
      <Box3D
        my="4"
        p="2"
        cursor="pointer"
        transition="filter 0.2s ease-in"
        _hover={{ filter: "brightness(1.1)" }}
        variant="contrast"
        h="77px"
      >
        <Grid
          gridTemplateColumns={"1fr 40px  1fr"}
          color="bg.500"
          alignItems="center"
          justifyContent="center"
          h="100%"
        >
          {side == "buy" ? pmIconsRender : cryptoPmRender}
          <BsArrowRightShort size="1.5rem" />
          {side == "buy" ? cryptoPmRender : pmIconsRender}
        </Grid>
      </Box3D>
    </Link>
  );
};

export default SimilarMass;
