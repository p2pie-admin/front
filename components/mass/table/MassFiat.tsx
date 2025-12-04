import { Box, HStack, Wrap } from "@chakra-ui/react";
import { IPm } from "../../../types/selector";
import SmartGrid from "./SmartGrid";
import { ResponsiveText } from "../../../styles/theme/custom";
import { capitalize } from "../../main/side/selector/section/PmGroup/helper";
import PmIcon from "../../shared/PmIcon";
import { enrichLink } from "../../../redux/helper";
import { LinkWrapper } from "../../exchange/pmLayout/LinkWrapper";
import { useContext } from "react";
import MassSideContext from "../sideContext";

const MassFiat = ({
  codes,
  fiatPms,
  ref_link,
}: {
  codes: string[];
  fiatPms: Record<string, IPm>;
  ref_link: string;
}) => {
  const { isSell, currentCryptoPm, city } = useContext(MassSideContext);

  const enrichedLink = (fiatPm: IPm) =>
    enrichLink({
      refLink: ref_link,
      givePm: isSell ? currentCryptoPm : fiatPm,
      getPm: isSell ? fiatPm : currentCryptoPm,
      cityCode: city?.codes?.[0],
    });

  // return (
  //  </LinkWrapper>
  return (
    <SmartGrid wrapThreshold={6} direction={"end"}>
      {codes.map((code) => (
        <LinkWrapper
          url={enrichedLink(fiatPms[code])}
          exists={!!ref_link}
          _blank
        >
          <HStack key={code} borderRadius="lg" mx="0.5" cursor="pointer">
            <PmIcon pm={fiatPms[code]} />

            {codes.length < 2 && (
              <ResponsiveText>
                {capitalize(fiatPms[code]?.en_name)}
              </ResponsiveText>
            )}
          </HStack>
        </LinkWrapper>
      ))}
    </SmartGrid>
  );
};

export default MassFiat;
