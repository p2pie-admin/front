import { Text } from "@chakra-ui/react";
import { assertEnumType } from "graphql";
import { useContext } from "react";
import P2PContext from "../../../../components/shared/contexts/p2pContext";
import { format } from "../../../../redux/amountsHelper";
import { useAppSelector } from "../../../../redux/hooks";

const Commission = () => {
  const p2pDirIndex = useContext(P2PContext);
  const [
    defRate,
    giveBiggerValueThanGet,
    currentRate,
  ] = useAppSelector((state) =>
    p2pDirIndex !== undefined
      ? [
          state.main.p2p.dirs[p2pDirIndex].defRate,
          state.main.p2p.dirs[p2pDirIndex].giveBiggerValueThanGet,
          state.main.p2p.dirs[p2pDirIndex].usersRate?.rate[0],
        ]
      : [undefined, undefined]
  );

  if (
    !defRate ||
    !currentRate ||
    Math.abs(1 - defRate / currentRate) * 1000 < 1
  )
    return <></>;
  const isNegative =
    (giveBiggerValueThanGet && defRate >= currentRate) ||
    (!giveBiggerValueThanGet && defRate < currentRate);
  if (isNegative) {
    return (
      <Text color="green.500" textAlign="start">
        {`+${format(Math.abs(1 - defRate / currentRate) * 100, 3)}%`}
      </Text>
    );
  }
  return (
    <Text color="red.500" textAlign="start">
      {`-${format(Math.abs(1 - currentRate / defRate) * 100, 3)}%`}
    </Text>
  );
};

export default Commission;
