import { Highlight, Box, useColorModeValue } from "@chakra-ui/react";
import { useContext } from "react";
import { capitalize } from "../../../../main/side/selector/section/PmGroup/helper";
import P2PContext from "../../../../shared/contexts/p2pContext";
import { useAppSelector } from "../../../../../redux/hooks";
import { MainState } from "../../../../../redux/mainReducer";
import { ResponsiveText } from "../../../../../styles/theme/custom";
import { ISide } from "../../../../../types/selector";
import { format } from "../../../../../redux/amountsHelper";

const DirDescription = () => {
  const p2pDirIndex = useContext(P2PContext) || 0;

  const defRate = useAppSelector(
    (state) => state.main.p2p.dirs[p2pDirIndex]?.defRate
  );

  const giveBiggerValueThanGet = useAppSelector(
    (state) => state.main.p2p.dirs[p2pDirIndex]?.giveBiggerValueThanGet
  );

  const currentRate = useAppSelector((state) =>
    Number(state.main.p2p.dirs[p2pDirIndex]?.usersRate?.rate[0])
  );

  const pmsSelector = (side: ISide) => (state: { main: MainState }) => {
    return p2pDirIndex !== undefined
      ? state.main.p2p.dirs[p2pDirIndex]?.[side]
      : [];
  };

  const givePms = useAppSelector(pmsSelector("give"));
  const getPms = useAppSelector(pmsSelector("get"));

  if (!givePms || !getPms || !defRate || !currentRate) return <></>;

  // DIRECTION DESCRIPTION
  const [giveCurrency, getCurrency] = [
    givePms[0]?.currency.code.toUpperCase(),
    getPms[0]?.currency.code.toUpperCase(),
  ];

  const giveNames = String(
    givePms.map((pm) => capitalize(pm.en_name))
  ).replaceAll(",", ", ");
  const getNames = String(
    getPms.map((pm) => capitalize(pm.en_name))
  ).replaceAll(",", ", ");

  const description = `selling ${giveNames} ${giveCurrency} for ${getNames} ${getCurrency}`;
  // : `buying ${getNames} ${getCurrency} with ${giveNames} ${giveCurrency}`;

  // MARKET % CALCULATION

  const isLowerThanMarketRate = currentRate > defRate;
  const isProfit =
    (giveBiggerValueThanGet && defRate >= currentRate) ||
    (!giveBiggerValueThanGet && defRate < currentRate);

  const value = isLowerThanMarketRate
    ? Math.abs(1 - defRate / currentRate) * 100
    : Math.abs(1 - currentRate / defRate) * 100;
  const sign = isLowerThanMarketRate ? "" : "–";
  const color = value > 4 ? "red" : value >= 2 ? "orange" : "green";
  const warning =
    value < 2
      ? "normal"
      : isProfit
      ? value > 4
        ? "very high"
        : "high"
      : value > 4
      ? "very low"
      : "low";

  return (
    <Box my={["2", "4"]} px="1">
      <ResponsiveText
      // textAlign="justify"
      // whiteSpace="normal"
      // _after={{
      //   content: '""',
      //   display: "inline-block",
      //   width: "100%",
      // }}
      >{`You are ${description}`}</ResponsiveText>

      <ResponsiveText whiteSpace="normal">
        <Highlight
          query={["very", "low", "high", "normal"]}
          styles={{
            fontWeight: "bold",
            color: `${color}.600`,
          }}
        >
          {` at a ${warning} price (${sign}${format(value, 3)}% to market)`}
        </Highlight>
      </ResponsiveText>
    </Box>
  );
};

export default DirDescription;
