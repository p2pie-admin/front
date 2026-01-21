import { Divider, Grid, Box, VStack, HStack } from "@chakra-ui/react";
import { IoMdListBox } from "react-icons/io";
import { addSpaces } from "../../../../redux/amountsHelper";
import { ResponsiveText } from "../../../../styles/theme/custom";
import { IFullOffer } from "../../../../types/p2p";
import { IPm } from "../../../../types/selector";
import { BoxWrapper, CustomHeader } from "../../../shared/BoxWrapper";

import DirectionsPicker from "./directionPicker";

export default function EditOffers({
  offers,
  pms,
}: {
  offers: IFullOffer[] | null | undefined;
  pms: IPm[] | null;
}) {
  const pmsByCode = new Map<string, IPm>();
  (pms || []).forEach((pm) => {
    if (pm?.code) {
      pmsByCode.set(pm.code.toUpperCase(), pm);
    }
  });
  return (
    <BoxWrapper>
      <CustomHeader text="Предложения" Icon={IoMdListBox} />
      <Divider my="4" />
      <DirectionsPicker offers={offers} pms={pms} />

      <Divider my="4" />
    </BoxWrapper>
  );
}
