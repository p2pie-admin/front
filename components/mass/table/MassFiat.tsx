import { Box, HStack, Wrap } from "@chakra-ui/react";
import { IPm } from "../../../types/selector";
import CircularIcon from "../../shared/CircularIcon";
import PmName from "../../shared/PmName";
import SmartGrid from "./SmartGrid";
import { ResponsiveText } from "../../../styles/theme/custom";
import { capitalize } from "../../main/side/selector/section/PmGroup/helper";
import MassPmIcon from "./MassPmIcon";

const MassFiat = ({
  codes,
  fiatPms,
}: {
  codes: string[];
  fiatPms: Record<string, IPm>;
}) => (
  <SmartGrid wrapThreshold={6} direction={"end"}>
    {codes.map((code) => (
      <HStack key={code} borderRadius="lg" mx="0.5" cursor="pointer">
        <MassPmIcon pm={fiatPms[code]} />

        {codes.length < 2 && (
          <ResponsiveText>{capitalize(fiatPms[code]?.en_name)}</ResponsiveText>
        )}
      </HStack>
    ))}
  </SmartGrid>
);

export default MassFiat;
