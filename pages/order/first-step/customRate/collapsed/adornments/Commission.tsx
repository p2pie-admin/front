import { HStack, Highlight, Text, useColorModeValue } from "@chakra-ui/react";
import { assertEnumType } from "graphql";
import { useContext } from "react";
import P2PContext from "../../../../../../components/shared/contexts/p2pContext";
import { format } from "../../../../../../redux/amountsHelper";
import { useAppSelector } from "../../../../../../redux/hooks";
import { ResponsiveText } from "../../../../../../styles/theme/custom";

const Commission = () => {
  const p2pDirIndex = useContext(P2PContext);
  const [defRate, giveBiggerValueThanGet, currentRate] = useAppSelector(
    (state) =>
      p2pDirIndex !== undefined
        ? [
            state.main.p2p.dirs[p2pDirIndex].defRate,
            state.main.p2p.dirs[p2pDirIndex].giveBiggerValueThanGet,
            Number(state.main.p2p.dirs[p2pDirIndex].usersRate?.rate[0]),
          ]
        : [undefined, undefined, undefined]
  );

  if (!defRate || !currentRate || Math.abs(1 - defRate / currentRate) * 200 < 1)
    // if no difference almost
    return <></>;

  const isLowerThanMarketRate = currentRate > defRate;
  const isProfit =
    (giveBiggerValueThanGet && defRate >= currentRate) ||
    (!giveBiggerValueThanGet && defRate < currentRate);
  const value = isLowerThanMarketRate
    ? `+${format(Math.abs(1 - defRate / currentRate) * 100, 3)}%`
    : `-${format(Math.abs(1 - currentRate / defRate) * 100, 3)}%`;

  const text = `to market price`;
  const shadedColor = useColorModeValue("bg.500", "bg.400");

  return (
    <ResponsiveText
      variant="no_contrast"
      color={isProfit ? "green.600" : "red.600"}
    >
      <Highlight query={text} styles={{ py: "1", color: shadedColor }}>
        {value + " " + text}
      </Highlight>
    </ResponsiveText>
  );
};

export default Commission;
