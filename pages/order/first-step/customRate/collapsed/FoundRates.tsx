import { Box, HStack, useColorModeValue } from "@chakra-ui/react";
import { capitalize } from "../../../../../components/main/side/pmModalButton/section/PmGroup/helper";
import { useAppSelector } from "../../../../../redux/hooks";
import { MainState } from "../../../../../redux/mainReducer";
import { ResponsiveText } from "../../../../../styles/theme/custom";
import { ISide } from "../../../../../types/selector";
import { IP2PDir } from "../../../../../types/p2p";
import NextLink from "next/link";
import { useContext } from "react";
import P2PContext from "../../../../../components/shared/contexts/p2pContext";
import { MdQueryStats } from "react-icons/md";

const FoundRates = () => {
  const p2pDirIndex = useContext(P2PContext);
  const dirSelector = (state: { main: MainState }) =>
    p2pDirIndex !== undefined ? state.main.p2p.dirs[p2pDirIndex] : undefined;

  const pmSelector = (side: ISide) => (state: { main: MainState }) => {
    const dir = dirSelector(state);
    if (dir)
      return `${capitalize(dir[side]?.[0]?.en_name)} ${dir[
        side
      ]?.[0]?.currency.code.toUpperCase()}`;
    return "-";
  };

  const givePmName = useAppSelector(pmSelector("give"));
  const getPmName = useAppSelector(pmSelector("get"));
  const bgColor = useColorModeValue("violet.300", "bg.900");

  return (
    <HStack
      justifyContent="space-between"
      bgColor={bgColor}
      py="1"
      px={["2", "4"]}
      my="2"
      borderRadius="lg"
      color="peach.200"
    >
      <Box>
        <ResponsiveText size="xs">{`Found 18 P2P rates starting from 1 BTC = 3,398,000 RUB`}</ResponsiveText>
        <NextLink href={""}>
          <ResponsiveText size="xs" variant="primary">
            {`${givePmName} → ${getPmName}`}
          </ResponsiveText>
        </NextLink>
      </Box>

      <MdQueryStats size="1.2rem" />
    </HStack>
  );
};

export default FoundRates;
